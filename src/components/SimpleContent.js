import React, { useCallback } from 'react';

import './simple-content.css';

const SimpleContent = ({ handleClick, name, idx, id, isGraph, data }) => {
  const handleClickButton = useCallback(() => {
    handleClick(isGraph ? id : idx);
  }, [handleClick, idx, id, isGraph]);

  return (
    <div className="simple-content-root">
      <button className="simple-content-btn" onClick={handleClickButton}>
        {data?.option || data?.name || name}
      </button>
    </div>
  );
};

export default SimpleContent;
