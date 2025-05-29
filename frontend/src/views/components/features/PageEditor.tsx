import React, { useState, useRef, useEffect, useCallback } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import useDebounce from '../../../hooks/useDebounce'; // Ensure this path is correct
import { useNotebookContent } from '../../../providers/NotebookContentProvider';

interface LineItem {
  id: string;
  content: string;
  isEditing: boolean;
}

interface PageEditorProps {
  notebook: number;
  initialContent: string | null;
  appendMarkdown: string | null;
  onContentChange: (content: string) => void;
  onAppendDone: () => void;
}

const PageEditor = ({ notebook, initialContent, appendMarkdown, onContentChange, onAppendDone }: PageEditorProps) => {
  const { currentContent, getNotebookContent } = useNotebookContent(); // Ensure this is imported correctly
  // Helper to generate unique IDs for lines
  const generateUniqueId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  }, []);

  // Initialize editorLines state using a functional initializer.
  // This runs ONLY ONCE when the component mounts (or remounts due to a changing key prop).
  const [editorLines, setEditorLines] = useState<LineItem[]>(() => {
    console.log('PageEditor: useState initializer. initialContent:', initialContent);

    if (initialContent) {
      const lines = initialContent.split('\n').map(content => ({
        id: generateUniqueId(),
        content,
        isEditing: false,
      }));
      // Ensure there's always an editable empty line at the end
      return [...lines, { id: generateUniqueId(), content: '', isEditing: true }];
    }
    // If initialContent is empty or null, start with a single empty editable line.
    console.log('PageEditor: useState initializer: initialContent is empty/null, starting with empty line.');
    return [{ id: generateUniqueId(), content: '', isEditing: true }];
  });

  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Removed the previous complex useEffect for initialContent.
  // The key prop on PageEditor in Note.tsx now handles remounting and re-initialization.

  // Effect to append markdown when appendMarkdown prop changes
  useEffect(() => {
    if (appendMarkdown) {
      console.log('PageEditor: Appending markdown:', appendMarkdown);
      setEditorLines(prevLines => {
        const filteredPrevLines = prevLines.filter(line => line.content.trim() !== '');

        const newLines = appendMarkdown.split('\n').map(content => ({
          id: generateUniqueId(),
          content,
          isEditing: false,
        }));

        const updatedLines = [...filteredPrevLines, ...newLines, { id: generateUniqueId(), content: '', isEditing: true }];
        return updatedLines;
      });
      onAppendDone();
    }
  }, [appendMarkdown, onAppendDone, generateUniqueId]);

  // Derive the full content from the editorLines state for saving
  const fullContentForSave = editorLines.filter((line, index) =>
    !(index === editorLines.length - 1 && line.content.trim() === '')
  ).map(line => line.content).join('\n');

  // Debounce the fullContentForSave before passing it to onContentChange
  const debouncedContent = useDebounce(fullContentForSave, 1000); // Debounce for 1 second (1000ms)

  // Effect to call onContentChange whenever debouncedContent updates
  useEffect(() => {
    // Only save if debouncedContent is different from initialContent.
    // This prevents saving an empty string if the editor was initially empty and nothing was typed.
    // It also prevents saving if the content hasn't truly changed from the last loaded state (debouncedContent === initialContent).
    if (initialContent === null) {
      getNotebookContent(notebook).catch((err: any) => {
        console.error('Error fetching notebook content:', err);
      });

      if (currentContent) {
        initialContent = currentContent;
      }
    }

    if (debouncedContent !== initialContent) {
      console.log('PageEditor: Debounced content changed. Calling onContentChange with content:', debouncedContent);
      onContentChange(debouncedContent);
    } else {
      console.log('PageEditor: Debounced content is same as initialContent, skipping save.');
    }
  }, [debouncedContent, onContentChange, initialContent]);


  // Auto-resize textareas and focus management
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
