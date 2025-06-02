import React, { useState, useRef, useEffect } from 'react';

const RootSelector = ({ options = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'], onRootChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const selectorRef = useRef(null);
  
  // Threshold for drag distance to trigger a note change
  const dragThreshold = 20;
  
  // Function to change the note
  const changeNote = (direction) => {
    if (isChanging) return; // Prevent changes during transition
    
    setIsChanging(true);
    
    // Change the note
    setSelectedIndex(prevIndex => {
      const newIndex = (prevIndex + direction + options.length) % options.length;
      // Notify parent component about the root change
      if (onRootChange) {
        onRootChange(options[newIndex]);
      }
      return newIndex;
    });
    
    // Force stop dragging
    setIsDragging(false);
    
    // Reset after transition completes
    setTimeout(() => {
      setIsChanging(false);
    }, 600);
  };
  
  // Handle mouse down - start dragging
  const handleMouseDown = (e) => {
    if (isChanging) return; // Don't start dragging during transitions
    setIsDragging(true);
    setStartX(e.clientX);
  };
  
  // Handle mouse up - stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Initialize root note on component mount
  useEffect(() => {
    if (onRootChange) {
      onRootChange(options[selectedIndex]);
    }
  }, []);
  
  // Global mouse events
  useEffect(() => {
    // Only add listeners if we're dragging
    if (!isDragging) return;
    
    // Mouse move handler
    const handleMouseMove = (e) => {
      if (!isDragging || isChanging) return;
      
      const currentDragDistance = e.clientX - startX;
      
      // Check if we've dragged past the threshold
      if (Math.abs(currentDragDistance) > dragThreshold) {
        const direction = currentDragDistance > 0 ? 1 : -1;
        changeNote(direction);
      }
    };
    
    // Mouse up handler - force stop dragging
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseUp);
    
    // Clean up
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging, isChanging, startX, options.length, dragThreshold]);
  
  return (
    <div className="root-selector-container">
      <div 
        className={`root-selector ${isDragging ? 'dragging' : ''} ${isChanging ? 'changing' : ''}`} 
        ref={selectorRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className="root-selector-value">
          {options[selectedIndex]}
        </div>
      </div>
      <div className="root-selector-label">
        <span>choose root</span>
      </div>
    </div>
  );
};

export default RootSelector;
