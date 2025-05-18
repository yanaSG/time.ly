import io
import pdfminer.high_level
from transformers import pipeline
from keybert import KeyBERT
import spacy
import re

nlp = spacy.load("en_core_web_sm")
kw_model = KeyBERT(model='all-MiniLM-L6-v2')
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class AcademicPDFProcessor:
    @staticmethod
    def extract_text(blob):
        """Improved PDF text extraction with layout preservation"""
        with io.BytesIO(blob) as pdf_file:
            text = pdfminer.high_level.extract_text(pdf_file)
        return AcademicPDFProcessor._clean_text(text)

    @staticmethod
    def _clean_text(text):
        """Academic paper-specific cleaning"""
        # Remove headers/footers
        text = re.sub(r'Page \d+ of \d+', '', text)
        # Preserve section headings
        text = re.sub(r'\n(\d+\.\d+\s+.+)\n', r'\nSECTION: \1\n', text)
        return text

    @staticmethod
    def generate_outline(text):
        """Creates hierarchical outline from section headings"""
        doc = nlp(text)
        outline = []
        current_section = None
        
        for sent in doc.sents:
            if "SECTION: " in sent.text:
                if current_section:
                    outline.append(current_section)
                current_section = {
                    'heading': sent.text.replace("SECTION: ", "").strip(),
                    'summary': "",
                    'children': []
                }
            elif current_section:
                if len(sent.text.split()) > 15:  # Only summarize longer sentences
                    current_section['summary'] += " " + AcademicPDFProcessor._summarize_chunk(sent.text)
        
        if current_section:
            outline.append(current_section)
        return outline

    @staticmethod
    def _summarize_chunk(text):
        """Summarizes a single section"""
        result = summarizer(text, max_length=75, min_length=15, truncation=True)
        return result[0]['summary_text']

    @staticmethod
    def extract_definitions(text):
        """Finds academic definitions using pattern matching"""
        definitions = []
        # Matches patterns like "X is defined as Y" or "Definition 1 (X): Y"
        pattern = r'([A-Z][A-Za-z\s]+)\s+(?:is|are)\s+(?:defined as|termed)\s+([^.]+)'
        for match in re.finditer(pattern, text):
            definitions.append({
                'term': match.group(1).strip(),
                'definition': match.group(2).strip()
            })
        return definitions

    @staticmethod
    def process(blob):
        text = AcademicPDFProcessor.extract_text(blob)
        return {
            'structured_outline': AcademicPDFProcessor.generate_outline(text),
            'key_definitions': AcademicPDFProcessor.extract_definitions(text),
            'critical_quotes': AcademicPDFProcessor.extract_quotes(text),
            'tl_dr': AcademicPDFProcessor.generate_tldr(text)
        }

    @staticmethod
    def extract_quotes(text):
        """Extracts important quotes using KeyBERT"""
        keywords = kw_model.extract_keywords(
            text, 
            keyphrase_ngram_range=(1, 3),
            stop_words='english',
            top_n=5
        )
        return [kw[0] for kw in keywords]

    @staticmethod
    def generate_tldr(text):
        """Generates ultra-concise summary"""
        return summarizer(text, max_length=50, min_length=20)[0]['summary_text']