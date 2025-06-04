import React, { useState, useRef, useEffect, useCallback } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import useDebounce from '../../../hooks/useDebounce';
import { useNotebookContent } from '../../../providers/NotebookContentProvider';

interface LineItem {
  id: string;
  content: string;
  isEditing: boolean;
}

interface PageEditorProps {
  initialContent: string | null;
  appendMarkdown: string | null;
  onContentChange: (content: string) => void;
  onAppendDone: () => void;
}

const PageEditor = ({ initialContent, appendMarkdown, onContentChange, onAppendDone }: PageEditorProps) => {
  const { currentContent } = useNotebookContent();

  const generateUniqueId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  }, []);

  const [editorLines, setEditorLines] = useState<LineItem[]>(() => {
    console.log('PageEditor: useState initializer. initialContent:', initialContent);

    if (initialContent) {
      const lines = initialContent.split('\n').map(content => ({
        id: generateUniqueId(),
        content,
        isEditing: false,
      }));

      return [...lines, { id: generateUniqueId(), content: '', isEditing: true }];
    }

    console.log('PageEditor: useState initializer: initialContent is empty/null, starting with empty line.');
    return [{ id: generateUniqueId(), content: '', isEditing: true }];
  });

  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const lastProcessedAppendMarkdownRef = useRef<string | null>(null);
  const debouncedAppendMarkdown = useDebounce(appendMarkdown, 2000);

  useEffect(() => {
    if (debouncedAppendMarkdown && debouncedAppendMarkdown !== lastProcessedAppendMarkdownRef.current) {
      console.log('PageEditor: Appending markdown:', debouncedAppendMarkdown);
      setEditorLines(prevLines => {
        const filteredPrevLines = prevLines.filter((line, index) => {
          return !(line.content.trim() === '' && prevLines.length > 1 && index === prevLines.length - 1);
        });

        const newLines = debouncedAppendMarkdown.split('\n').map(content => ({
          id: generateUniqueId(),
          content,
          isEditing: false,
        }));

        const updatedLines = [
          ...filteredPrevLines,
          ...newLines,
          { id: generateUniqueId(), content: '', isEditing: true },
        ];
        return updatedLines;
      });

      lastProcessedAppendMarkdownRef.current = debouncedAppendMarkdown;

      onAppendDone();
    }
  }, [debouncedAppendMarkdown, generateUniqueId, onAppendDone]);

  useEffect(() => {
    const handleTextareaInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    };

    const editingLine = editorLines.find(line => line.isEditing);
    if (editingLine && textareaRefs.current[editingLine.id]) {
      const textarea = textareaRefs.current[editingLine.id];
      textarea?.addEventListener('input', handleTextareaInput);
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    }

    return () => {
      Object.values(textareaRefs.current).forEach(textarea => {
        if (textarea) {
          textarea.removeEventListener('input', handleTextareaInput);
        }
      });
    };
  }, [editorLines]);

  const fullContentForSave = editorLines.filter((line, index) =>
    !(index === editorLines.length - 1 && line.content.trim() === '')
  ).map(line => line.content).join('\n');

  const debouncedContent = useDebounce(fullContentForSave, 1000);

  useEffect(() => {
    console.log('PageEditor: INITIAL CONTENT:', initialContent);
    if (debouncedContent !== initialContent && currentContent !== null) {
      console.log('PageEditor: Debounced content changed. Calling onContentChange with content:', debouncedContent);
      onContentChange(debouncedContent);
    } else {
      console.log('PageEditor: Debounced content is same as initialContent, skipping save.');
    }
  }, [debouncedContent, onContentChange, initialContent, currentContent]);

  const handleLineChange = (id: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorLines(prev => prev.map(line =>
      line.id === id ? { ...line, content: e.target.value } : line
    ));
  };

  const handleLineBlur = (id: string) => {
    setEditorLines(prev => prev.map(line =>
      line.id === id ? { ...line, isEditing: false } : line
    ));
  };

  const handleLineClick = (id: string) => {
    setEditorLines(prev => prev.map(line =>
      line.id === id ? { ...line, isEditing: true } : { ...line, isEditing: false }
    ));
  };

  const handleKeyDown = (id: string, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const currentIndex = editorLines.findIndex(line => line.id === id);

    if (e.key === 'Enter') {
      e.preventDefault();
      const newId = generateUniqueId();
      setEditorLines(prev => prev.map((line, idx) => ({
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
      const targetIndex = currentIndex > 0 ? currentIndex - 1 : editorLines.length - 1;
      const targetLine = editorLines[targetIndex];
      setEditorLines(prev => prev.map(line =>
        line.id === targetLine.id ? { ...line, isEditing: true } : { ...line, isEditing: false }
      ));
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const targetIndex = currentIndex < editorLines.length - 1 ? currentIndex + 1 : 0;
      const targetLine = editorLines[targetIndex];
      setEditorLines(prev => prev.map(line =>
        line.id === targetLine.id ? { ...line, isEditing: true } : { ...line, isEditing: false }
      ));
    }
    else if (
      (e.key === 'Backspace') &&
      editorLines[currentIndex].content === '' &&
      editorLines.length > 1
    ) {
      e.preventDefault();
      setEditorLines(prev => {
        const newLines = prev.filter((_, idx) => idx !== currentIndex);
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
      className='bg-white text-[#333333] h-full w-full flex flex-col p-4 overflow-y-auto'
    >
      {editorLines.map((line, index) => (
        <div
          key={line.id}
          style={{
            marginBottom: '3px',
            cursor: 'text',
            borderRadius: '4px',
            backgroundColor: line.isEditing ? '#F0F0F0' : 'transparent',
            transition: 'background-color 0.1s ease',
            padding: '4px 8px',
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
              placeholder={index === editorLines.length - 1 ? 'Start typing...' : ''}
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
                display: 'block',
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

export default PageEditor;
