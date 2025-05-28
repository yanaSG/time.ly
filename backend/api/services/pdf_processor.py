import io
import re
import pdfplumber
import torch
import numpy as np
from keybert import KeyBERT
from collections import defaultdict
import textwrap
from dotenv import load_dotenv
import time
from typing import Optional
import requests
import os
import warnings

# Suppress PDFBox warnings
warnings.filterwarnings("ignore", message="CropBox.*")
load_dotenv()

class ChapterProcessor:
    def __init__(self, model_name: str = "deepseek-ai/DeepSeek-V3-0324"):
        """
        Args:
            model_name: Model identifier for Chutes.ai (default: "deepseek-chat")
        """
        # Initialize KeyBERT with smaller model for efficiency
        self.kw_model = KeyBERT(model='paraphrase-MiniLM-L3-v2')
        
        # Chutes.ai API configuration
        self.api_key = os.getenv("CHUTES_API_KEY")
        self.api_url = "https://llm.chutes.ai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        self.model_name = model_name
        
        # Processing parameters
        self.summary_config = {
            'max_tokens': 300,
            'temperature': 0.5,
            'top_p': 0.9
        }

    # Enhanced _generate_summary() with consistent formatting:
    def _generate_summary(self, text: str) -> str:
        if not text or len(text.split()) < 30:
            return ""
            
        if self.api_key:
            try:
                # API call with consistent formatting
                # Updated prompt for Markdown consistency
                prompt = """Generate a comprehensive, structured outline with bullet points from the text below.
                The outline should dynamically adapt its hierarchy (using Markdown headings like #, ##, ### for main topics and standard bullet points - for details) to best represent the natural organization, flow, and depth of the content.

                Focus on:
                - Main ideas and overarching themes.
                - Key concepts and significant sub-points.
                - Crucial supporting details that clarify or elaborate on main points.

                Format:
                # Main Heading
                ## Sub-heading
                - Detail 1
                - Detail 2
                - Sub-detail of Detail 2
                ## Another Sub-heading
                - Detail

                Avoid unnecessary introductory or concluding remarks; go straight to the outline format.

                Text:
                {text}"""
                
                response = requests.post(
                    self.api_url,
                    json={
                        "model": self.model_name,
                        "messages": [{
                            "role": "user",
                            "content": prompt.format(text=text[:8000])
                        }],
                        **self.summary_config
                    },
                    headers=self.headers,
                    timeout=30
                )
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
            except:
                return self._local_summary_fallback(text)
        else:
            return self._local_summary_fallback(text)

    def _local_summary_fallback(self, text: str) -> str:
        """Fallback that still provides structured output"""
        sentences = [s.strip() for s in text.split('.') if 10 < len(s.split()) < 30][:5]
        if not sentences:
            return ""
            
        return f"""Core Thesis:
    {sentences[0]}

    Key Points:
    - {sentences[1] if len(sentences)>1 else 'Not available'}
    - {sentences[2] if len(sentences)>2 else 'Not available'}"""

    # Enhanced _extract_key_elements():
    def _extract_key_elements(self, text: str) -> dict:
        """Enhanced key element extraction with DeepSeek fallback for definitions"""
        content = self._clean_text(text)
        
        # 1. Extract key terms using KeyBERT with validation
        raw_terms = self._get_keybert_terms(content)
        validated_terms = self._validate_terms_with_deepseek(raw_terms, content) if self.api_key else raw_terms
        
        # 2. Extract key points
        key_points = self._extract_key_points(content)
        
        # 3. Extract and enhance definitions
        term_definitions = {}
        for term in validated_terms:
            definition = self._extract_definition_for_term(term, content)
            if not definition and self.api_key:
                definition = self._generate_definition_with_deepseek(term, content)
            if definition:
                term_definitions[term] = definition
        
        return {
            "key_concepts": validated_terms,
            "key_points": key_points,
            "definitions": list(term_definitions.values())
        }

    def _get_keybert_terms(self, text: str) -> list:
        """Get initial terms from KeyBERT with strict filtering"""
        keywords = self.kw_model.extract_keywords(
            text,
            keyphrase_ngram_range=(1, 2),
            stop_words='english',
            top_n=15,  # Get more terms for validation
            diversity=0.7
        )
        
        filtered_terms = []
        blacklist = {'page', 'chapter', 'section', 'exist', 'question'}
        min_char_length = 4
        
        for term, score in keywords:
            if isinstance(term, tuple):
                term = term[0]
            clean_term = self._clean_text(term)
            
            if (clean_term and 
                len(clean_term.split()) <= 2 and
                len(clean_term) >= min_char_length and
                clean_term.lower() not in blacklist and
                not any(c.isdigit() for c in clean_term)):
                filtered_terms.append(clean_term.title())
        
        return filtered_terms

    def _validate_terms_with_deepseek(self, terms: list, context: str) -> list:
        """Validate and filter terms using DeepSeek"""
        if not terms or not self.api_key:
            return terms[:8]  # Return top terms if no API
        
        prompt = f"""Review these potential key terms extracted from an academic text and select only the most relevant 5-8 terms:
        
    Terms to evaluate:
    {", ".join(terms)}

    Text Context:
    {context[:2000]}

    Please return ONLY a comma-separated list of the most important terms, nothing else."""
        
        try:
            response = requests.post(
                self.api_url,
                json={
                    "model": self.model_name,
                    "messages": [{
                        "role": "user",
                        "content": prompt
                    }],
                    "max_tokens": 100,
                    "temperature": 0.1
                },
                headers=self.headers,
                timeout=15
            )
            response.raise_for_status()
            validated_terms = response.json()["choices"][0]["message"]["content"].split(',')
            return [t.strip() for t in validated_terms if t.strip()][:8]
        except:
            return terms[:8]  # Fallback to original terms

    def _extract_definition_for_term(self, term: str, context: str) -> str:
        """Extract definition from text patterns"""
        sentences = [s.strip() for s in context.split('.') if term.lower() in s.lower()]
        
        # Look for definition patterns
        definition_patterns = [
            rf"{re.escape(term)}\s+(is|are|means|refers to)[^.]*",
            rf"[^.]*\b{re.escape(term)}\s*:[^.]*",
            rf"defined as\s+{re.escape(term)}[^.]*"
        ]
        
        for s in sentences:
            for pattern in definition_patterns:
                match = re.search(pattern, s, re.I)
                if match:
                    return s.strip()
        
        return ""

    def _generate_definition_with_deepseek(self, term: str, context: str) -> str:
        """Generate definition using DeepSeek when not found in text"""
        prompt = f"""Provide a concise, academic definition of "{term}" as used in this context:
        
    Context:
    {context[:2000]}

    Avoid unnecessary introductory or concluding remarks; go straight to the term and definition.

    Definition (1 sentence):"""
        
        try:
            response = requests.post(
                self.api_url,
                json={
                    "model": self.model_name,
                    "messages": [{
                        "role": "user",
                        "content": prompt
                    }],
                    "max_tokens": 100,
                    "temperature": 0.1
                },
                headers=self.headers,
                timeout=15
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"].strip()
        except:
            return ""

    def _extract_key_points(self, text: str) -> list:
        """Extract important standalone points using DeepSeek for better quality."""
        if not self.api_key:
            # Fallback to simple sentence extraction if API not available
            sentences = [s.strip() for s in text.split('.') if 10 < len(s.split()) < 50]
            return [s for s in sentences if not s.startswith(('and', 'but', 'or')) and not s.isupper()][:5]

        # Use DeepSeek to extract key points
        prompt = f"""From the following text, identify and list 5-7 distinct and concise key points.
        Each point should be a complete, standalone idea. Do not introduce the list; just provide the bulleted points.

        Text:
        {text[:5000]}

        Key Points:
        -
        -
        """
        try:
            response = requests.post(
                self.api_url,
                json={
                    "model": self.model_name,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 200, # Adjust as needed
                    "temperature": 0.3,
                    "top_p": 0.9
                },
                headers=self.headers,
                timeout=20
            )
            response.raise_for_status()
            points_text = response.json()["choices"][0]["message"]["content"].strip()
            # Split by bullet points and clean up
            return [line.lstrip('- ').strip() for line in points_text.split('\n') if line.strip()]
        except Exception as e:
            print(f"Error generating key points with DeepSeek: {e}")
            # Fallback in case of API error
            sentences = [s.strip() for s in text.split('.') if 10 < len(s.split()) < 50]
            return [s for s in sentences if not s.startswith(('and', 'but', 'or')) and not s.isupper()][:5]

    def extract_structured_text(self, pdf_blob):
        """Robust PDF text extraction with heading detection"""
        with pdfplumber.open(io.BytesIO(pdf_blob)) as pdf:
            elements = []
            
            for page in pdf.pages:
                try:
                    text = page.extract_text(
                        layout=True,
                        x_tolerance=2,
                        y_tolerance=2,
                        keep_blank_chars=False
                    )
                    if not text:
                        continue
                        
                    paragraphs = [p for p in text.split('\n') if p.strip()]
                    
                    for i, para in enumerate(paragraphs):
                        # Detect headings based on formatting and content
                        is_heading = (
                            (para.isupper() and 3 <= len(para.split()) <= 8) or
                            re.match(r'^(Chapter|Section|Part)\s\d+', para) or
                            any(word in para.lower() for word in 
                                ["introduction", "conclusion", "references"])
                        )
                        
                        elements.append({
                            "text": para,
                            "is_heading": is_heading,
                            "page": page.page_number,
                            "position": i  # Add position index
                        })
                except Exception as e:
                    print(f"Page {page.page_number} error: {str(e)}")
                    continue
                    
        return elements

    def process(self, pdf_blob):
        """Complete processing pipeline with timing and structured output"""
        start_time = time.time()
        try:
            # Validate PDF
            with pdfplumber.open(io.BytesIO(pdf_blob)) as pdf:
                if not any(page.extract_text() for page in pdf.pages[:3]):
                    raise ValueError("No readable text in first 3 pages")
                page_count = len(pdf.pages)
            
            # Extract and structure content
            elements = self.extract_structured_text(pdf_blob)
            
            # Segment content into sections
            sections = []
            current_section = {
                "title": "Introduction",  # Default first section title
                "content": "",
                "page": elements[0]["page"] if elements else 1
            }
            
            for element in elements:
                if element["is_heading"]:
                    # Save previous section if it has content
                    if current_section["content"].strip():
                        sections.append(current_section)
                    
                    # Start new section
                    current_section = {
                        "title": element["text"],
                        "content": "",
                        "page": element["page"]
                    }
                else:
                    # Add to current section's content
                    current_section["content"] += " " + element["text"]
            
            # Add the last section if it has content
            if current_section["content"].strip():
                sections.append(current_section)
            
            # Process each section and filter out those without summaries
            processed_sections = []
            all_key_terms = []
            
            for section in sections:
                # Clean and prepare section content
                clean_content = self._clean_text(section["content"])
                if not clean_content:
                    continue
                    
                # Generate summary - skip section if no summary generated
                summary = self._generate_summary(clean_content)
                if not summary:
                    continue
                    
                # Process section with summary
                processed = {
                    "title": self._clean_text(section["title"]),
                    "page": section["page"],
                    "summary": summary,
                    "content": clean_content
                }
                
                # Extract and add other elements
                elements = self._extract_key_elements(clean_content)
                processed.update(elements)
                processed_sections.append(processed)
                
                # Collect key terms in model-compatible format
                for term in elements["key_concepts"]:
                    all_key_terms.append({
                        "term": term,
                        "definition": next(
                            (d for d in elements["definitions"] if term.lower() in d.lower()), 
                            ""
                        ),
                        "page_reference": section["page"]
                    })
            
            # Generate Markdown output
            markdown = self._generate_markdown(processed_sections, all_key_terms)
            
            processing_time = time.time() - start_time
            
            return {
                "status": "processing_completed",
                "markdown": markdown,
                "sections": processed_sections,
                "key_terms": all_key_terms,
                "page_count": page_count,
                "processing_time": processing_time,
                "model_used": self.model_name
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "processing_time": time.time() - start_time
            }

    def _generate_markdown(self, sections, key_terms):
        """Convert processed content to structured Markdown"""
        md_lines = [
            "# Book Summary\n",
            "## Key Terms and Definitions\n"
        ]
        
        # Add glossary section
        for term in key_terms:
            md_lines.append(f"- **{term['term']}**")
            if term["definition"]:
                md_lines.append(f"  - *Definition*: {term['definition']}")
            md_lines.append(f"  - *Page Reference*: {term['page_reference']}")
            md_lines.append("")

        # Add chapter summaries
        md_lines.append("\n## Chapter Summaries\n")
        for section in sections:
            title = section["title"]
            summary = section["summary"]
            page = section["page"]
            
            md_lines.append(f"### {title}\n")
            md_lines.append(f"**Summary**: {summary}\n")
            
            if section.get("key_points"):
                md_lines.append("**Key Points**:")
                md_lines.extend(f"- {point}" for point in section["key_points"])
                md_lines.append("")
            
            md_lines.append(f"*Page {page}*")
            md_lines.append("\n---\n")

        return "\n".join(md_lines)

    def _clean_text(self, text):
        """Normalize text formatting"""
        # Remove extra whitespace (including newlines from PDF)
        text = re.sub(r'\s+', ' ', text)
        # This regex attempts to fix words that got concatenated due to OCR/PDF extraction
        # e.g., "wordExample" -> "word Example"
        text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
        # Remove any leading/trailing whitespace that might be left
        return text.strip()