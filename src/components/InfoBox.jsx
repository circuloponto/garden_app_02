import React, { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import FretboardDisplayer from './FretboardDisplayer'
import "./FretboardDisplayer.module.css"
import { calculateChordNotes, getFullChordName, findChordTypeByClassName, getOffsetRoot, getRootOffset, getNoteIndex, calculateScale } from '../utils/noteCalculator'

const InfoBox = ({ selectedRoot, selectedChords, chordTypes, chordRootOffsets, onRootChange }) => {
  // Internal display root for ordering notes, without affecting the app's selectedRoot
  const [displayRoot, setDisplayRoot] = useState(selectedRoot);
  const [isPlaying, setIsPlaying] = useState(false);
  const [calculatedChords, setCalculatedChords] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [electronNotes, setElectronNotes] = useState([]);
  const [availableOffsets, setAvailableOffsets] = useState([]);
  const [selectedOffsetIndex, setSelectedOffsetIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [scaleNotes, setScaleNotes] = useState([]);
  const [scaleType, setScaleType] = useState('chromatic'); // Default to chromatic scale
  const dragThreshold = 30; // Minimum drag distance to trigger a note change
  const notesContainerRef = useRef(null);

  useEffect(() => {
    if (selectedRoot && selectedChords.length > 0 && chordTypes) {
      // Get available offsets for this chord pair
      let offsets = [];
      
      if (selectedChords.length > 1) {
        // Check if the same chord is selected twice (creating a semitone scale)
        if (selectedChords[0] === selectedChords[1]) {
          // When the same chord is selected twice, look up the offset from chordRootOffsets
          const chord = selectedChords[0];
          const key = `${chord}_${chord}`;
          const offsetValue = chordRootOffsets[key];
          
          // Check if offset is an array or a single value
          if (Array.isArray(offsetValue)) {
            offsets = offsetValue;
          } else if (offsetValue !== undefined) {
            offsets = [offsetValue];
          } else {
            // Fallback to semitone if no specific offset is defined
            offsets = [1];
          }
        } else {
          // Normal case: two different chords selected
          const key = `${selectedChords[0]}_${selectedChords[1]}`;
          const offsetValue = chordRootOffsets[key];
          
          // Check if offset is an array or a single value
          if (Array.isArray(offsetValue)) {
            offsets = offsetValue;
          } else if (offsetValue !== undefined) {
            offsets = [offsetValue];
          }
        }
      }
      
      setAvailableOffsets(offsets);
      
      // Reset selected offset index when chord pair changes
      if (offsets.length > 0) {
        setSelectedOffsetIndex(0);
      } else {
        setSelectedOffsetIndex(-1);
      }
      
      // Calculate chords based on the selected offset
      // Make sure to use the first available offset or 0 if none available
      const offsetToUse = (selectedOffsetIndex >= 0 && offsets.length > 0) ? offsets[0] : 0;
      calculateChordsWithOffset(offsetToUse);
    } else {
      setCalculatedChords([]);
      setAllNotes([]);
      setAvailableOffsets([]);
      setSelectedOffsetIndex(-1);
    }
  }, [selectedRoot, selectedChords, chordTypes, chordRootOffsets]);
  
  // Update when selected offset changes
  useEffect(() => {
    if (availableOffsets.length > 0 && selectedOffsetIndex >= 0 && selectedOffsetIndex < availableOffsets.length) {
      // Get the current offset value from the available offsets
      const currentOffset = availableOffsets[selectedOffsetIndex];
      console.log(`Selected offset index changed to ${selectedOffsetIndex}, using offset: ${currentOffset}`);
      calculateChordsWithOffset(currentOffset);
    }
  }, [selectedOffsetIndex, availableOffsets]);
  
  // Calculate scale notes whenever the selected root changes
  // Sync displayRoot with selectedRoot when it changes from outside
  useEffect(() => {
    setDisplayRoot(selectedRoot);
  }, [selectedRoot]);

  useEffect(() => {
    if (selectedRoot) {
      const scale = calculateScale(selectedRoot, scaleType);
      setScaleNotes(scale);
      console.log(`Calculated ${scaleType} scale for root ${selectedRoot}:`, scale);
    } else {
      setScaleNotes([]);
    }
  }, [selectedRoot, scaleType]);
  
  // Function to calculate chords with a specific offset
  const calculateChordsWithOffset = (offset) => {
    if (!selectedRoot || selectedChords.length === 0 || !chordTypes) return;
    
    const chordData = [];
    
    // Process first chord - ALWAYS use the original selected root (no offset)
    if (selectedChords.length > 0) {
      const firstChordId = selectedChords[0];
      const firstChordType = findChordTypeByClassName(chordTypes, firstChordId);
      
      if (firstChordType) {
        // First chord ALWAYS uses the original root note (e.g., C) with NO OFFSET
        const firstRoot = selectedRoot; // Always use the original selected root
        const firstFullName = getFullChordName(firstRoot, firstChordType.name);
        const firstNotes = calculateChordNotes(firstRoot, firstChordType.intervals);
        
        chordData.push({
          id: firstChordId,
          fullName: firstFullName,
          notes: firstNotes,
          chordType: firstChordType,
          root: firstRoot
        });
      }
    }
    
    // Process second chord with offset root if available
    if (selectedChords.length > 1) {
      const secondChordId = selectedChords[1];
      const secondChordType = findChordTypeByClassName(chordTypes, secondChordId);
      
      if (secondChordType && chordData.length > 0) {
        // Apply offset ONLY to the second chord
        // This is where we use the offset to calculate a different root note
        const offsetRoot = getOffsetRoot(selectedRoot, offset);
        console.log(`Applying offset ${offset} to root ${selectedRoot} gives ${offsetRoot}`);
        
        const secondFullName = getFullChordName(offsetRoot, secondChordType.name);
        const secondNotes = calculateChordNotes(offsetRoot, secondChordType.intervals);
        
        chordData.push({
          id: secondChordId,
          fullName: secondFullName,
          notes: secondNotes,
          chordType: secondChordType,
          root: offsetRoot
        });
      }
    }
    
    setCalculatedChords(chordData);
    
    // Get all unique notes from both chords and track which chord(s) each note belongs to
    if (chordData.length > 0) {
      // Create a map to track which chord(s) each note belongs to
      const notesMap = new Map();
      
      // Process notes from first chord
      if (chordData[0]) {
        chordData[0].notes.forEach(note => {
          notesMap.set(note, { note, inFirstChord: true, inSecondChord: false });
        });
      }
      
      // Process notes from second chord
      if (chordData[1]) {
        chordData[1].notes.forEach(note => {
          if (notesMap.has(note)) {
            // Update existing entry if note is in both chords
            const noteData = notesMap.get(note);
            noteData.inSecondChord = true;
          } else {
            // Add new entry if note is only in second chord
            notesMap.set(note, { note, inFirstChord: false, inSecondChord: true });
          }
        });
      }
      
      // Convert map to array and sort by chromatic order
      const notesArray = Array.from(notesMap.values());
      notesArray.sort((a, b) => getNoteIndex(a.note) - getNoteIndex(b.note));
      
      setAllNotes(notesArray);
      
      // Calculate electron notes (notes from the chromatic scale that don't appear in the current scale)
      const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
      const scaleNotes = new Set(notesArray.map(noteData => noteData.note));
      const electrons = flatNotes.filter(note => !scaleNotes.has(note));
      
      // Sort electron notes chromatically
      electrons.sort((a, b) => getNoteIndex(a) - getNoteIndex(b));
      
      setElectronNotes(electrons);
    } else {
      setAllNotes([]);
      setElectronNotes([]);
    }
  };

  const handlePlayClick = () => {
    // Toggle play state
    setIsPlaying(!isPlaying);
  };

  const handleTabClick = (e, index) => {
    // Stop event propagation to prevent dismissing the InfoBox
    e.stopPropagation();
    setSelectedOffsetIndex(index);
  };
  
  // Define the chromatic scale for reference
  const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  
  // Handle arrow clicks - only navigate through the chromatic scale for display purposes
  const handleArrowClick = (e, direction) => {
    // Stop event propagation to prevent dismissing the InfoBox
    e.stopPropagation();
    
    if (!displayRoot) return;
    
    // Use the chromatic scale for navigation, not the chord notes
    const currentIndex = flatNotes.indexOf(displayRoot);
    if (currentIndex !== -1) {
      if (direction === 'left') {
        // Navigate to previous note in the chromatic scale
        const prevIndex = (currentIndex - 1 + flatNotes.length) % flatNotes.length;
        setDisplayRoot(flatNotes[prevIndex]);
      } else {
        // Navigate to next note in the chromatic scale
        const nextIndex = (currentIndex + 1) % flatNotes.length;
        setDisplayRoot(flatNotes[nextIndex]);
      }
    }
  };
  
  // Get ordered notes starting with the display root note
  const getOrderedChordNotes = () => {
    if (!selectedRoot || calculatedChords.length === 0) return [];
    
    // Get all unique notes from both chords
    const uniqueNotes = new Set();
    
    // Add all notes from both chords
    calculatedChords.forEach(chord => {
      chord.notes.forEach(note => uniqueNotes.add(note));
    });
    
    // Convert to array and sort starting from the display root note
    const rootIndex = flatNotes.indexOf(displayRoot || selectedRoot);
    if (rootIndex === -1) return Array.from(uniqueNotes);
    
    // Create an array of all notes in chromatic order starting from the display root
    const orderedNotes = [];
    for (let i = 0; i < flatNotes.length; i++) {
      const noteIndex = (rootIndex + i) % flatNotes.length;
      const note = flatNotes[noteIndex];
      if (uniqueNotes.has(note)) {
        orderedNotes.push(note);
      }
    }
    
    return orderedNotes;
  };

  // Drag functionality for notes
  const handleDragStart = (e) => {
    // Stop event propagation to prevent dismissing the InfoBox
    e.stopPropagation();
    
    setIsDragging(true);
    setStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
    setCurrentTranslate(0);
  };

  const handleDragMove = (e) => {
    // Stop event propagation to prevent dismissing the InfoBox
    e.stopPropagation();
    
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diff = currentX - startX;
    setCurrentTranslate(diff);
  };
  
  const handleDragEnd = (e) => {
    // Stop event propagation to prevent dismissing the InfoBox
    if (e) e.stopPropagation();
    
    if (!isDragging) return;
    setIsDragging(false);
    
    // If dragged far enough, change the display root note
    if (Math.abs(currentTranslate) > dragThreshold && displayRoot) {
      const currentIndex = flatNotes.indexOf(displayRoot);
      
      if (currentIndex !== -1) {
        // If dragged right, go to previous note in the chromatic scale
        if (currentTranslate > dragThreshold) {
          const prevIndex = (currentIndex - 1 + flatNotes.length) % flatNotes.length;
          setDisplayRoot(flatNotes[prevIndex]);
        }
        // If dragged left, go to next note in the chromatic scale
        else if (currentTranslate < -dragThreshold) {
          const nextIndex = (currentIndex + 1) % flatNotes.length;
          setDisplayRoot(flatNotes[nextIndex]);
        }
      }
    }
    
    setCurrentTranslate(0);
  };

  return (
    <div className={`infoBox ${selectedChords.length === 2 ? '' : 'hidden'}`}>
        {/* Scale tabs - now at the very top */}
        {availableOffsets.length > 1 && (
          <div className="scaleTabs">
            {availableOffsets.map((offset, index) => (
              <div 
                key={index} 
                className={`scaleTab ${selectedOffsetIndex === index ? 'active' : ''}`}
                onClick={(e) => handleTabClick(e, index)}
              >
                Scale {index + 1}
              </div>
            ))}
          </div>
        )}
        
        {/* Header section */}
        <div className="infoTitle">
            <div className="titleRow">
              <div className="tabbytitle">Tabby Pair</div>
              <span className="play-button" onClick={handlePlayClick}>
                {isPlaying ? <FaPause className="play-icon" /> : <FaPlay className="play-icon" />}
              </span>
              <div className="chordName">
                {calculatedChords.length > 0 ? (
                  <>
                    <span className='firstChord'>{calculatedChords[0].fullName}</span>
                    {calculatedChords.length > 1 && (
                      <>
                        <span className='plus'>&</span>
                        <span className='secondChord'>{calculatedChords[1].fullName}</span>
                      </>
                    )}
                  </>
                ) : (
                  <span>No chords selected</span>
                )}
              </div>
            </div>
        </div>
        
        {/* Notes section without navigation arrows */}
        <div className="infoSection">
            <h3>Scale</h3>
            
            <div className="sectionContent notesContainer" ref={notesContainerRef}>
                {/* Left arrow */}
                <div className="arrow-left" onClick={(e) => handleArrowClick(e, 'left')}></div>
                
                {/* Notes container with drag functionality */}
                <div 
                    className="notes-wrapper"
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                    style={{ 
                        cursor: isDragging ? 'grabbing' : 'grab',
                        transition: isDragging ? 'none' : 'transform 0.3s ease',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '5px',
                        padding: '10px'
                    }}
                >
                    {/* Display notes that appear in the selected chords, starting with root note */}
                    {getOrderedChordNotes().map((note, index) => {
                        // Check if the note is in any of the chords
                        const inFirstChord = calculatedChords.length > 0 && calculatedChords[0].notes.includes(note);
                        const inSecondChord = calculatedChords.length > 1 && calculatedChords[1].notes.includes(note);
                        
                        // Skip notes that don't appear in any chord
                        if (!inFirstChord && !inSecondChord) {
                            return null;
                        }
                        
                        let className = '';
                        if (inFirstChord && inSecondChord) {
                            className = 'bothChords';
                        } else if (inFirstChord) {
                            className = 'firstChord';
                        } else if (inSecondChord) {
                            className = 'secondChord';
                        }
                        
                        // Highlight the root note
                        if (note === selectedRoot) {
                            className += ' rootNote';
                        }
                        
                        return (
                            <span 
                                key={index} 
                                className={`${className}${index === 0 ? ' currentRoot' : ''}`}
                            >
                                {note}
                            </span>
                        );
                    })}
                </div>
                
                {/* Right arrow */}
                <div className="arrow-right" onClick={(e) => handleArrowClick(e, 'right')}></div>
            </div>
        </div>
        {allNotes.length === 0 && <span>No notes to display</span>}
        
        {/* Electrons section */}
        <div className="infoSection">
            <div className="sectionTitle">Electrons:</div>
            <div className="sectionContent">
                {electronNotes.map((note, index) => (
                    <span key={index} className='infoElectrons'>{note}</span>
                ))}
                {electronNotes.length === 0 && <span>No electron notes to display</span>}
            </div>
        </div>
        {calculatedChords.length === 2 && (
          <FretboardDisplayer 
            firstChord={{
              name: calculatedChords[0].fullName,
              spelling: calculatedChords[0].notes,
              root: calculatedChords[0].root,
              fretStart: 8,
              positions: [
                { string: 6, fret: 8 },
                { string: 5, fret: 8 },
                { string: 4, fret: 8 },
                { string: 3, fret: 9 }
              ]
            }}
            secondChord={{
              name: calculatedChords[1].fullName,
              spelling: calculatedChords[1].notes,
              root: calculatedChords[1].root,
              fretStart: 8,
              positions: [
                { string: 6, fret: 8 },
                { string: 5, fret: 9 },
                { string: 4, fret: 8 },
                { string: 3, fret: 8 }
              ]
            }}
          />
        )}
    </div>
  )
}

export default InfoBox