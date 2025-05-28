import React from 'react'

// Chord component: renders a chord with optional selection and possible-chord animation
const Chord = ({ svg, className, handleChordSelect, selectedChords, possibleChords = [] }) => {
  const isSelected = selectedChords.includes(className);
  const isPossible = possibleChords.includes(className);
  return (
    <div
      className={`element ${className}${isSelected ? ' selected-chord' : ''}${isPossible ? ' possible-chord' : ''}`}
      onClick={() => handleChordSelect(className)}
    >
      <img className="svg" src={svg} alt="" />
    </div>
  );
}

export default Chord