import React, { useEffect, useState } from 'react';
import { findChordTypeByClassName } from '../utils/noteCalculator';
import { flatNotes } from '../utils/noteCalculator2';
import { calculateChordNotes, calculateTwoChords } from '../utils/noteCalculator2';

const Inspector = ({ hoveredChord, selectedChords, selectedRoot, chordTypes, chordRootOffsets, hoveredElectron }) => {
  // State to store electron notes
  const [displayedElectronNotes, setDisplayedElectronNotes] = useState([]);
  
  // Always render the component, but with empty or placeholder content when no chord or electron is hovered
  let content = <div className="inspector-placeholder">Hover over a chord or electron</div>;
  
  // Reset displayed electron notes when hoveredElectron changes
  useEffect(() => {
    if (!hoveredElectron) {
      setDisplayedElectronNotes([]);
    }
  }, [hoveredElectron]);
  
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
          
          // Extract electron index from the electron class name
          let electronIndex = 0;
          
          if (hoveredElectron.electronClass) {
            // Look for patterns like "threeToFive1", "threeToFive2", "fifteenToNineteen3"
            const indexMatch = hoveredElectron.electronClass.match(/([a-zA-Z]+)To([a-zA-Z]+)(\\d+)$/);
            if (indexMatch && indexMatch[3]) {
              // Convert the index to zero-based (1 -> 0, 2 -> 1, etc.)
              electronIndex = parseInt(indexMatch[3], 10) - 1;
              if (electronIndex < 0) electronIndex = 0;
            }
          }
          
          // Use the appropriate offset based on electron index if it's an array
          const offsetValue = offset !== undefined ? 
            (Array.isArray(offset) ? 
              (electronIndex < offset.length ? offset[electronIndex] : offset[0]) : 
              offset) : 
            0;
          
          console.log(`Electron: ${hoveredElectron.electronClass}, Index: ${electronIndex}, Offset: ${offsetValue}`);
          
          // Calculate the notes for the connection using the correct offset
          const result = calculateTwoChords(selectedRoot, fromChordType, toChordType, offsetValue);
          
          // Check if we have shared electron notes from InfoBox
          let electronNotes;
          
          if (displayedElectronNotes.length > 0) {
            // Use the pre-calculated electron notes from InfoBox
            console.log('Inspector2: Using shared electron notes from InfoBox:', displayedElectronNotes);
            electronNotes = displayedElectronNotes;
          } else {
            // Fall back to calculating electron notes directly
            electronNotes = result.scale
              .filter(note => note !== undefined && note !== null)
              .filter(note => !result.firstChord.notes.includes(note) && !result.secondChord.notes.includes(note))
              .map(note => note.toString().replace(/;/g, ''));
              
            // Store these notes for future use
            setDisplayedElectronNotes(electronNotes);
          }
          
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
      const connectionMatch = hoveredElectron.match(/electron_([a-zA-Z]+)To([a-zA-Z0-9]+)/);
      
      if (connectionMatch) {
        // Handle regular connections
        const fromChord = connectionMatch[1].toLowerCase();
        // Extract the base chord name without any numbers
        const toChordWithIndex = connectionMatch[2];
        const toChord = toChordWithIndex.replace(/[0-9]/g, '').toLowerCase();
        
        // Extract the index number if present (e.g., "nineteen1" -> 1)
        let electronIndex = 0;
        const indexMatch = toChordWithIndex.match(/([a-zA-Z]+)(\\d+)$/);
        if (indexMatch && indexMatch[2]) {
          // Convert the index to zero-based (1 -> 0, 2 -> 1, etc.)
          electronIndex = parseInt(indexMatch[2], 10) - 1;
          if (electronIndex < 0) electronIndex = 0;
        }
        
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
          
          console.log(`Electron: ${hoveredElectron}, Index: ${electronIndex}, Offset: ${offsetValue}`);
          
          // Calculate the notes for the connection using the correct offset
          const result = calculateTwoChords(selectedRoot, fromChordType, toChordType, offsetValue);
          
          // Check if we have shared electron notes from InfoBox
          let electronNotes;
          
          if (displayedElectronNotes.length > 0) {
            // Use the pre-calculated electron notes from InfoBox
            console.log('Inspector2: Using shared electron notes from InfoBox:', displayedElectronNotes);
            electronNotes = displayedElectronNotes;
          } else {
            // Fall back to calculating electron notes directly
            electronNotes = result.scale
              .filter(note => note !== undefined && note !== null)
              .filter(note => !result.firstChord.notes.includes(note) && !result.secondChord.notes.includes(note))
              .map(note => note.toString().replace(/;/g, ''));
              
            // Store these notes for future use
            setDisplayedElectronNotes(electronNotes);
          }
          
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
