import React, { useState } from 'react'
import styles from './fretboard.module.css'

const Fretboard = ({chord}) => {
  const {name, fretStart, spelling = []} = chord;
  // Ensure fretStart is at least 1 to avoid negative indices
  const startFret = Math.max(1, fretStart);
  
  const [notes] = useState([
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'], 
    ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], 
    ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'], 
    ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'], 
    ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'], 
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'], 
  ]);
  
  // Get the 6 notes for each string starting from startFret - 1
  const visibleNotes = notes.map(stringNotes => {
    // Slice 6 notes starting from startFret - 1 (0-indexed)
    return stringNotes.slice(startFret - 1, startFret + 5);
  });
  
  // Function to check if a note is in the chord spelling
  const isNoteInChord = (note) => {
    // Direct match first
    if (spelling.includes(note)) {
      return true;
    }
    
    // Handle enharmonic equivalents
    const enharmonicMap = {
      'C#': 'Db', 'Db': 'C#',
      'D#': 'Eb', 'Eb': 'D#',
      'F#': 'Gb', 'Gb': 'F#',
      'G#': 'Ab', 'Ab': 'G#',
      'A#': 'Bb', 'Bb': 'A#'
    };
    
    // Check if the enharmonic equivalent is in the spelling
    const enharmonic = enharmonicMap[note];
    return enharmonic && spelling.includes(enharmonic);
  };

  // Create a grid of cells for the fretboard
  const renderFretboard = () => {
    const cells = [];
    
    // We don't need to add fret numbers here anymore as they're added separately
    // to be properly centered between fret lines
    
    // Add notes and create the grid
    for (let string = 0; string < 6; string++) {
      for (let fret = 0; fret < 6; fret++) {
        const note = visibleNotes[string][fret];
        const inChord = isNoteInChord(note);
        cells.push(
          <div 
            key={`${string}-${fret}`} 
            className={styles.cell}
            style={{
              gridRow: string + 1,
              gridColumn: fret + 1
            }}
          >
            <div className={`${styles.note} ${inChord ? styles.inChord : ''}`}>
              {inChord ? note : ''}
            </div>
          </div>
        );
      }
    }
    
    return cells;
  };

  return (
    <div className={styles.fretboard}>
      <div className={styles.chorNameTitle}>{name}</div>
      
      <div className={styles.fretboardGrid}>
        {/* Horizontal string lines */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={`string-${i}`} 
            className={styles.stringLine}
            style={{ gridRow: i + 1 }}
          ></div>
        ))}
        
        {/* Vertical fret lines */}
        {[...Array(7)].map((_, i) => (
          <div 
            key={`fret-${i}`} 
            className={styles.fretLine}
            style={{ gridColumn: i + 1 }}
          ></div>
        ))}
        
        {/* Notes */}
        {renderFretboard()}
        
        {/* Fret numbers */}
        <div className={styles.fretNumbersRow}>
          {[...Array(6)].map((_, i) => (
            <div 
              key={`fretNum-${i}`} 
              className={styles.fretNumberCell} 
              style={{ gridColumn: i + 1 }}>
              {startFret + i - 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Fretboard