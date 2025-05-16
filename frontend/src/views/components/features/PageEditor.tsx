import React, { useState, useRef, useEffect } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

interface LineItem {
  id: string;
  content: string;
  isEditing: boolean;
}

const MarkdownEditor = () => {
  const [lines, setLines] = useState<LineItem[]>([
    { id: '1', content: '', isEditing: true }
  ]);
  const textareaRefs = useRef<{[key: string]: HTMLTextAreaElement | null}>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure there's always an empty line at the end
  useEffect(() => {
    if (lines.length === 0 || lines[lines.length - 1].content.trim() !== '') {
      setLines(prev => [...prev, { id: Date.now().toString(), content: '', isEditing: false }]);
    }
  }, [lines]);

  // Auto-resize textareas and focus management
  useEffect(() => {
    const handleTextareaInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    };

    const editingLine = lines.find(line => line.isEditing);
    if (editingLine && textareaRefs.current[editingLine.id]) {
      const textarea = textareaRefs.current[editingLine.id];
      textarea?.addEventListener('input', handleTextareaInput);
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.focus();
      }
    }

    return () => {
      Object.values(textareaRefs.current).forEach(textarea => {
        if (textarea) {
          textarea.removeEventListener('input', handleTextareaInput);
        }
      });
    };
  }, [lines]);

  const handleLineChange = (id: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLines(prev => prev.map(line => 
      line.id === id ? { ...line, content: e.target.value } : line
    ));
  };

  const handleLineBlur = (id: string) => {
    setLines(prev => prev.map(line => 
      line.id === id ? { ...line, isEditing: false } : line
    ));
  };

  const handleLineClick = (id: string) => {
    setLines(prev => prev.map(line => 
      line.id === id ? { ...line, isEditing: true } : line
    ));
  };

  const handleKeyDown = (id: string, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const currentIndex = lines.findIndex(line => line.id === id);
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const newId = Date.now().toString();
      setLines(prev => prev.map((line, idx) => ({
      ...line,
      isEditing: idx === currentIndex ? false : line.isEditing
      })).flatMap((line, idx) =>
      idx === currentIndex
        ? [
        line,
        { id: newId, content: '', isEditing: true }
        ]
        : [line]
      ));
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const targetIndex = currentIndex > 0 ? currentIndex - 1 : lines.length - 1;
      const targetLine = lines[targetIndex];
      setLines(prev => prev.map(line => 
      line.id === targetLine.id ? { ...line, isEditing: true } : { ...line, isEditing: false }
      ));
    } 
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const targetIndex = currentIndex < lines.length - 1 ? currentIndex + 1 : 0;
      const targetLine = lines[targetIndex];
      setLines(prev => prev.map(line => 
      line.id === targetLine.id ? { ...line, isEditing: true } : { ...line, isEditing: false }
      ));
    }
    else if (
      (e.key === 'Backspace') &&
      lines[currentIndex].content === '' &&
      lines.length > 1
    ) {
      e.preventDefault();
      setLines(prev => {
      const newLines = prev.filter((_, idx) => idx !== currentIndex);
      // Focus previous line if possible, otherwise next
      const newFocusIdx = currentIndex > 0 ? currentIndex - 1 : 0;
      return newLines.map((line, idx) => ({
        ...line,
        isEditing: idx === newFocusIdx
      }));
      });
    }
  };

  const setTextareaRef = (id: string) => (el: HTMLTextAreaElement | null) => {
    if (el) {
      textareaRefs.current[id] = el;
    } else {
      delete textareaRefs.current[id];
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: 'system-ui, sans-serif',
      }}
      className='bg-white text-[#333333] h-full w-full flex flex-col p-4'
    >
      {lines.map((line, index) => (
        <div 
          key={line.id} 
          style={{ 
            marginBottom: '3px',
            cursor: 'text',
            borderRadius: '4px',
            backgroundColor: line.isEditing ? '#F0F0F0' : 'transparent',
            transition: 'background-color 0.1s ease',
            padding: '4px 8px',
            minHeight: '1.5em',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => !line.isEditing && handleLineClick(line.id)}
        >
          {line.isEditing ? (
            <textarea
              value={line.content}
              onChange={(e) => handleLineChange(line.id, e)}
              onBlur={() => handleLineBlur(line.id)}
              onKeyDown={(e) => handleKeyDown(line.id, e)}
              ref={setTextareaRef(line.id)}
              style={{
                background: 'transparent',
                color: '#333333',
                width: '100%',
                border: 'none',
                fontFamily: 'inherit',
                fontSize: '16px',
                padding: '0',
                outline: 'none',
                resize: 'none',
                minHeight: '1.5em',
                lineHeight: '1.6',
                overflow: 'hidden',
              }}
              rows={1}
              placeholder={index === lines.length - 1 ? 'Start typing...' : ''}
            />
          ) : (
            <MarkdownPreview 
              source={line.content || ' '} 
              style={{ 
                background: 'transparent',
                color: '#333333',
                fontFamily: 'inherit',
                margin: '0',
                padding: '0',
                display: 'inline',
                minHeight: '1.5em',
                fontSize: '16px',
                lineHeight: '1.6',
              }} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MarkdownEditor;