import React from 'react';
import { findChordTypeByClassName, getFullChordName } from '../utils/noteCalculator';
import { flatNotes } from '../utils/noteCalculator2';
import { calculateChordNotes, calculateTwoChords } from '../utils/noteCalculator2';

const Inspector = ({ hoveredChord, selectedChords, selectedRoot, chordTypes, chordRootOffsets, hoveredElectron }) => {
  // Always render the component, but with empty or placeholder content when no chord or electron is hovered
  let content = <div className="inspector-placeholder">Hover over a chord or electron</div>;
  
  // Display electron information if an electron is hovered
  if (hoveredElectron && selectedChords.length > 0) {
    // Handle different electron naming patterns
    const dittoMatch = hoveredElectron.match(/electron_ditto([A-Z][a-z]+)/);
    const connectionMatch = hoveredElectron.match(/electron_([a-zA-Z]+)To([a-zA-Z0-9]+)/);
    
    if (dittoMatch) {
      // Handle ditto electrons (self-connections)
      const targetChord = dittoMatch[1].toLowerCase();
      const chordType = findChordTypeByClassName(chordTypes, targetChord);
      
      if (chordType) {
        const chordNotes = calculateChordNotes(selectedRoot, chordType);
        
        content = (
          <>
            <div className="inspector-electron-name">Self-Connection: {targetChord}</div>
            <div className="inspector-notes">
              <div>Chord: {selectedRoot} {chordType.name}</div>
              <div>Notes: {chordNotes.join(', ')}</div>
            </div>
          </>
        );
      }
    } else if (connectionMatch) {
      // Handle regular connections
      const fromChord = connectionMatch[1];
      const toChord = connectionMatch[2];
      
      // Find chord types for the connection
      const fromChordType = findChordTypeByClassName(chordTypes, fromChord);
      const toChordType = findChordTypeByClassName(chordTypes, toChord);
      
      if (fromChordType && toChordType) {
        // Calculate the notes for the connection
        const result = calculateTwoChords(selectedRoot, fromChordType, toChordType, 0);
        
        // Get the offset between the chords
        const key = `${fromChord}_${toChord}`;
        let offset = chordRootOffsets[key];
        
        // If direct offset not found, try reverse direction and negate
        if (offset === undefined) {
          const reverseKey = `${toChord}_${fromChord}`;
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
        
        content = (
          <>
            <div className="inspector-electron-name">Electron: {fromChord} → {toChord}</div>
            <div className="inspector-relationship">
              <span>Offset: {offset !== undefined ? (Array.isArray(offset) ? offset.join('/') : offset) : 'N/A'}</span>
            </div>
            <div className="inspector-notes">
              <div>From: {result.firstChord.notes.join(', ')}</div>
              <div>To: {result.secondChord.notes.join(', ')}</div>
              <div>Scale: {result.scale.join(', ')}</div>
            </div>
          </>
        );
      }
    }
  } else if (hoveredChord) {
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
