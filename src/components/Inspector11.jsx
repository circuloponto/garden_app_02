import React from 'react';
import { findChordTypeByClassName } from '../utils/noteCalculator';

const Inspector = ({ hoveredChord, selectedChords, selectedRoot, chordTypes, chordRootOffsets, hoveredElectron }) => {
  // Always render the component, but with empty or placeholder content when no chord is hovered
  let content = <div className="inspector-placeholder">Hover over a chord</div>;
  
  // Only display chord information if a chord is hovered
  if (hoveredChord) {
    // Find the chord type for the hovered chord
    const hoveredChordType = findChordTypeByClassName(chordTypes, hoveredChord);
    
    if (hoveredChordType) {
      // Just show the chord name
      content = (
        <div className="inspector-chord-name">{hoveredChordType.name}</div>
      );
    }
  }
  
  return (
    <div className="inspector">
      <div className="inspector-content" style={{ textAlign: 'center' }}>
        {content}
      </div>
    </div>
  );
};

export default Inspector;
