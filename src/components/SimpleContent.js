import React, { useCallback } from 'react';

import './simple-content.css';

const SimpleContent = ({ handleClick, name, idx }) => {
  const handleClickButton = useCallback(() => {
    handleClick(name, idx);
  }, [handleClick, name, idx]);
  const parts = name.split('-');

  return (
    <div className="simple-content-root">
      <button
        className="simple-content-btn"
        onClick={handleClickButton}
      >
        {parts[parts.length - 1]}
      </button>
    </div>
  );
};

export default SimpleContent;
