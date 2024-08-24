import React, { useState, useRef, useEffect } from 'react';

const EditableTitle = ({ title, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (currentTitle.trim() !== title) {
      onSave(currentTitle);
    }
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setCurrentTitle(e.target.value);

  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div
      className="flex items-center justify-between mb-2 relative"
      onDoubleClick={handleDoubleClick}
    >
      {!isEditing && (
        <h3 className="text-2xl font-extralight">{title}</h3>
      )}
      {isEditing && (
        <input
          ref={inputRef}
          type="text"
          value={currentTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-2xl font-extralight border-none p-0 bg-transparent outline-none"
          style={{ width: '100%' }}
        />
      )}
    </div>
  );
};

export default EditableTitle;
    