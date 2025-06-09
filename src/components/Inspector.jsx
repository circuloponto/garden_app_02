import React from 'react';
import { findChordTypeByClassName, getFullChordName } from '../utils/noteCalculator';
import { flatNotes } from '../utils/noteCalculator2';

const Inspector = ({ hoveredChord, selectedChords, selectedRoot, chordTypes, chordRootOffsets }) => {
  // Always render the component, but with empty or placeholder content when no chord is hovered
  let content = <div className="inspector-placeholder">Hover over a chord</div>;
  
  if (hoveredChord) {
    // Find the chord type for the hovered chord
    const hoveredChordType = findChordTypeByClassName(chordTypes, hoveredChord);
    
    if (hoveredChordType) {
      let displayRoot = selectedRoot;
      let offsetInfo = null;
      
      // Check if we have a selected chord and the hovered chord is different
      if (selectedChords.length === 1 && selectedChords[0] !== hoveredChord) {
        // Get the offset between the selected chord and the hovered chord
        const key = `${selectedChords[0]}_${hoveredChord}`;
        let offset = chordRootOffsets[key];
        
        // If direct offset not found, try reverse direction and negate
        if (offset === undefined) {
          const reverseKey = `${hoveredChord}_${selectedChords[0]}`;
          const reverseOffset = chordRootOffsets[reverseKey];
          
          if (reverseOffset !== undefined) {
            // Negate the offset for reverse direction
            if (Array.isArray(reverseOffset)) {
              offset = reverseOffset.map(val => -val);
            } else {
              offset = -reverseOffset;
            }
          }
        }
        
        if (offset !== undefined) {
          // Use the first offset if it's an array
          const offsetValue = Array.isArray(offset) ? offset[0] : offset;
          
          // Calculate the second chord root based on offset using the same logic as in calculateTwoChords
          const rootIndex = getNoteIndex(selectedRoot);
          const secondRootIndex = (rootIndex + offsetValue + 12) % 12; // Add 12 to handle negative offsets
          displayRoot = flatNotes[secondRootIndex];
          
          offsetInfo = (
            <div className="inspector-relationship">
              <span>Offset: {Array.isArray(offset) ? offset.join('/') : offset}</span>
            </div>
          );
        }
      }
      
      // Just show the chord type name without the root
      const chordName = hoveredChordType.name;
      
      content = (
        <>
          <div className="inspector-chord-name">{chordName}</div>
          {offsetInfo}
        </>
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

// Helper function to get the index of a note in the flatNotes array
function getNoteIndex(note) {
  return flatNotes.indexOf(note);
}

export default Inspector;
