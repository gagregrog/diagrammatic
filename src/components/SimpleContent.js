import React, { useCallback } from 'react';

import './simple-content.css';

const SimpleContent = ({ handleClick, name, idx, id }) => {
  const handleClickButton = useCallback(() => {
    handleClick(idx !== undefined ? idx : id);
  }, [handleClick, idx, id]);
  
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
