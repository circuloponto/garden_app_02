import React, { useState, useRef } from 'react';

const RootSelector = ({ options = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectorRef = useRef(null);
  
  // Function to move to the previous note
  const movePrev = () => {
    setSelectedIndex(prevIndex => {
      return (prevIndex + 1) % options.length;
    });
  };
  
  // Function to move to the next note
  const moveNext = () => {
    setSelectedIndex(prevIndex => {
      return (prevIndex - 1 + options.length) % options.length;
    });
  };
  
  // Handle click on the left side (move to prev note)
  const handleLeftClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const halfWidth = rect.width / 2;
    
    if (clickX < halfWidth) {
      moveNext();
    } else {
      movePrev();
    }
  };
  
  return (
    <div className="root-selector-container">
      <div className="root-selector" ref={selectorRef}>
        <div className="root-selector-arrows">
          <button 
            className="root-selector-arrow left" 
            onClick={moveNext}
          >
            ←
          </button>
          <div className="root-selector-value">
            {options[selectedIndex]}
          </div>
          <button 
            className="root-selector-arrow right" 
            onClick={movePrev}
          >
            →
          </button>
        </div>
      {/*   <div className="root-selector-hint">
          choose note
        </div> */}
      </div>
      <div className="root-selector-label">
        <span>choose root</span>
      </div>
    </div>
  );
};

export default RootSelector;
