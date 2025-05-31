import React, { useState } from 'react';

const Button = ({ title, stateOptions = [], setViewMode, icon: Icon }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleState = () => {
    setActiveIndex(prev => (prev === 0 ? 1 : 0));
    if (setViewMode) {
      setViewMode(prev => (prev === 'connections' ? 'fruits' : 'connections'));
    }
  };

  const currentState = stateOptions[activeIndex] || '';

  return (
    <div className="button-container">
      <div className="button" onClick={toggleState}>
        {Icon && <Icon className="button-icon" />}
      </div>
      <div className="button-text">
        {title}
        {currentState !== '' ? (
          <>
            : <span className={currentState.toLowerCase()}>{currentState}</span>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Button;