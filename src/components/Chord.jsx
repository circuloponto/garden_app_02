import React from 'react'

const Chord = ({ svg, className, handleChordSelect,selectedChords }) => {
  const isSelected = selectedChords.includes(className);
  return (
    <div
      className={`element ${className}${isSelected ? ' selected-chord' : ''}`}
      onClick={ () => handleChordSelect(className)}
    >
      <img className="svg" src={svg} alt="" />
    </div>
  );
}

export default Chord