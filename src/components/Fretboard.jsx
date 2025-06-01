import React, { useState } from 'react'
import styles from './fretboard.module.css'
import classNames from 'classnames';

const Fretboard = ({chord, type}) => {
  const {name, fretStart, positions, spelling = []} = chord;
  // Ensure fretStart is at least 1 to avoid negative indices
  const startFret = Math.max(1, fretStart);
  
  const [notes] = useState([
    ['E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E'], 
    ['B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'], 
    ['G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'], 
    ['D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D'], 
    ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A'], 
    ['E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E'], 
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

  // Function to check if a position should be displayed based on positions prop
  const shouldShowPosition = (string, fretIndex) => {
    if (!positions || positions.length === 0) {
      // If no positions provided, show all notes that are in the chord
      return true;
    }
    
    // Convert fretIndex to actual fret number
    const actualFret = startFret + fretIndex - 1;
    
    // Find the position for this string (strings are 1-indexed in the positions array)
    const position = positions.find(pos => pos.string === 6 - string);
    
    // Return true if this position matches the fret
    return position && position.fret === actualFret;
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
        const isInChord = isNoteInChord(note);
        const shouldShow = shouldShowPosition(string, fret);
        
        cells.push(
          <div 
            key={`cell-${string}-${fret}`} 
            className={styles.cell}
            style={{ gridRow: string + 1, gridColumn: fret + 1 }}
          >
            <div 
              className={classNames(
                styles.note,
                {
                  [styles.inChord]: isInChord && shouldShow && !type,
                  [styles.firstChord]: isInChord && shouldShow && type === 'first',
                  [styles.secondChord]: isInChord && shouldShow && type === 'second'
                }
              )}
            >
              {isInChord && shouldShow ? note : ''}
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