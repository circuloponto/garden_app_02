import React from 'react';
import { findChordTypeByClassName } from '../utils/noteCalculator';
import { flatNotes } from '../utils/noteCalculator2';
import { calculateChordNotes, calculateTwoChords } from '../utils/noteCalculator2';

const Inspector = ({ hoveredChord, selectedChords, selectedRoot, chordTypes, chordRootOffsets, hoveredElectron }) => {
  // Always render the component, but with empty or placeholder content when no chord or electron is hovered
  let content = <div className="inspector-placeholder">Hover over a chord or electron</div>;
  
  // Display electron information if an electron is hovered
  if (hoveredElectron && selectedChords.length > 0) {
    // Check if hoveredElectron is the new detailed object format
    if (typeof hoveredElectron === 'object' && hoveredElectron.type) {
      if (hoveredElectron.type === 'connection') {
        // Handle regular connections
        const fromChord = hoveredElectron.sourceChord;
        const toChord = hoveredElectron.targetChord;
        
        // Find chord types for the connection
        const fromChordType = findChordTypeByClassName(chordTypes, fromChord);
        const toChordType = findChordTypeByClassName(chordTypes, toChord);
        
        if (fromChordType && toChordType) {
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
          
          // Extract electron index from the electron class name if available
          let electronIndex = 0;
          if (hoveredElectron.electronClass) {
            // Try to extract index from the class name (format: electron_sourceToTarget_index)
            const indexMatch = hoveredElectron.electronClass.match(/electron_.*?_(\d+)$/);
            if (indexMatch && indexMatch[1]) {
              electronIndex = parseInt(indexMatch[1], 10) || 0;
            }
          }
          
          // Use the appropriate offset based on electron index if it's an array
          const offsetValue = offset !== undefined ? 
            (Array.isArray(offset) ? 
              (electronIndex < offset.length ? offset[electronIndex] : offset[0]) : 
              offset) : 
            0;
          
          // Calculate the notes for the connection using the correct offset
          const result = calculateTwoChords(selectedRoot, fromChordType, toChordType, offsetValue);
          
          // Calculate electron notes (notes in scale but not in either chord)
          const electronNotes = result.scale.filter(note => 
            !result.firstChord.notes.includes(note) && !result.secondChord.notes.includes(note)
          );
          
          // Only show electron notes
          content = (
            <div className="inspector-notes">
              <div><strong>Electron Notes:</strong> {electronNotes.join(', ')}</div>
            </div>
          );
        }
      }
    } else {
      // Handle legacy string format for backward compatibility
      const connectionMatch = hoveredElectron.match(/electron_([a-zA-Z]+)To([a-zA-Z0-9]+)(?:_(\d+))?/);
      
      if (connectionMatch) {
        // Handle regular connections
        const fromChord = connectionMatch[1].toLowerCase();
        const toChord = connectionMatch[2].replace(/[0-9]/g, '').toLowerCase();
        
        // Extract electron index if available in the format electron_sourceToTarget_index
        const electronIndex = connectionMatch[3] ? parseInt(connectionMatch[3], 10) : 0;
        
        // Find chord types for the connection
        const fromChordType = findChordTypeByClassName(chordTypes, fromChord);
        const toChordType = findChordTypeByClassName(chordTypes, toChord);
        
        if (fromChordType && toChordType) {
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
          
          // Use the appropriate offset based on electron index if it's an array
          const offsetValue = offset !== undefined ? 
            (Array.isArray(offset) ? 
              (electronIndex < offset.length ? offset[electronIndex] : offset[0]) : 
              offset) : 
            0;
          
          // Calculate the notes for the connection using the correct offset
          const result = calculateTwoChords(selectedRoot, fromChordType, toChordType, offsetValue);
          
          // Calculate electron notes (notes in scale but not in either chord)
          const electronNotes = result.scale.filter(note => 
            !result.firstChord.notes.includes(note) && !result.secondChord.notes.includes(note)
          );
          
          // Only show electron notes
          content = (
            <div className="inspector-notes">
              <div><strong>Electron Notes:</strong> {electronNotes.join(', ')}</div>
            </div>
          );
        }
      }
    }
  } else if (hoveredChord) {
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
