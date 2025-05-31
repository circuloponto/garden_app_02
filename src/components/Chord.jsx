import React from 'react'

// Chord component: renders a chord with optional selection and possible-chord animation
const Chord = ({ svg, className, handleChordSelect, selectedChords, possibleChords = [] }) => {
  const isSelected = selectedChords.includes(className);
  const isPossible = possibleChords.includes(className);
  
console.log("svg",svg, className)
  const handleClick = (e) => {
    // Prevent the default behavior
    e.preventDefault();
    
    // Log which chord was clicked
    console.log(`Clicked on chord: ${className}`);
    
    // Call the handler with the className
    handleChordSelect(className);
  };
  
  return (
    <div
      className={`element ${className}${isSelected ? ' selected-chord' : ''}${isPossible ? ' possible-chord' : ''}`}
      onClick={handleClick}
    >
      <img className="svg" src={svg} alt="" />
    </div>
  );
}

export default Chord