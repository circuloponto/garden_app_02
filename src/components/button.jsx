import React, { useState } from 'react';

const Button = ({ title, stateOptions = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleState = () => {
    setActiveIndex(prev => (prev === 0 ? 1 : 0));
  };

  const currentState = stateOptions[activeIndex] || '';

  return (
    <div className="button" onClick={toggleState}>
      {title}
      {currentState !== '' ? (
        <>
          : <span className={currentState.toLowerCase()}>{currentState}</span>
        </>
      ) : null}
    </div>
  );
};

export default Button;