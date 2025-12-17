import React from 'react';

const ProgressBar = ({ value }) => {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="progress">
      <div
        className="progress__inner"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

export default ProgressBar;
