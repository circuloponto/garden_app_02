import React, { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause, FaExchangeAlt, FaPalette } from 'react-icons/fa'
import FretboardDisplayer from './FretboardDisplayer'
import "./FretboardDisplayer.module.css"
import { flatNotes, getNoteIndex, calculateChordNotes, calculateTwoChords } from '../utils/noteCalculator2'
// Import some functions we still need from the original calculator
import { getFullChordName, findChordTypeByClassName, getOffsetRoot } from '../utils/noteCalculator'
// Import Tone.js for audio playback
import * as Tone from 'tone'

// Function to format chord names by replacing 'min'/'Min' with '-' and 'dim' with '°'
const formatChordName = (chordName) => {
  return chordName
    .replace(/[Mm]in/g, '-')  // Match both 'min' and 'Min'
    .replace(/dim/g, '°');
};

const InfoBox = ({ selectedRoot, selectedChords, chordTypes, chordRootOffsets, onRootChange, onSwapChords, onDisplayOrderSwap, displayOrderSwapped = false }) => {
  // Store the original root to restore it when toggling back
  const [originalRoot, setOriginalRoot] = useState(selectedRoot);
  // Reference to store the current playing sequence for Tone.js
  const currentSequenceRef = useRef(null);
  // Use the prop for display order swap state instead of local state
  // This allows the parent component to control and share this state with other components
  
  // Function to handle swapping the order of selected chords
  const handleSwapChords = (e) => {
    // Stop event propagation to prevent dismissing the InfoBox
    e.stopPropagation();
    
    // Call the prop function passed from the parent component
    if (onSwapChords) {
      onSwapChords();
    }
  };
  
  // Function to handle swapping just the display order without changing chord order
  const handleSwapDisplayColors = (e) => {
    // Stop event propagation to prevent dismissing the InfoBox
    e.stopPropagation();
    
    console.log('Swap display colors clicked');
    
    // Only proceed if we have exactly two chords calculated
    if (calculatedChords.length === 2 && onDisplayOrderSwap) {
      // Store the original root on first swap
      if (!displayOrderSwapped) {
        setOriginalRoot(selectedRoot);
        console.log('Storing original root:', selectedRoot);
      }
      
      // Determine which root to use based on current display state
      // We're about to toggle, so use the opposite of current state
      const newRoot = !displayOrderSwapped 
        ? calculatedChords[1].root  // Going to swapped state, use second chord's root
        : originalRoot;             // Going back to original state, use original root
      
      console.log('Setting root to:', newRoot, 'Original root:', originalRoot);
      
      // First update our internal display root
      // This controls which note is displayed as the root in the UI
      setDisplayRoot(newRoot);
      
      // Set local swap state to prevent originalRoot from being overwritten
      setLocalSwapped(!displayOrderSwapped);
      
      // IMPORTANT: We need to update the matrix root selector
      // WITHOUT triggering a scale recalculation
      if (onRootChange) {
        // We'll use the matrixDisplayRoot state in App.jsx to handle this
        onRootChange(newRoot, true); // Pass true to indicate this is from a swap
      }
      
      // Then toggle the display order state
      onDisplayOrderSwap();
    }
  };
  // Internal display root for ordering notes, without affecting the app's selectedRoot
  const [displayRoot, setDisplayRoot] = useState(selectedRoot);
  const [localSwapped, setLocalSwapped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [calculatedChords, setCalculatedChords] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [electronNotes, setElectronNotes] = useState([]);
  const [availableOffsets, setAvailableOffsets] = useState([]);
  const [selectedOffsetIndex, setSelectedOffsetIndex] = useState(-1);
  const [scaleNotes, setScaleNotes] = useState([]);
  const [scaleType, setScaleType] = useState('chromatic'); // Default to chromatic scale
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
          // Try to find offsets for the exact order of chord selection
          const key = `${selectedChords[0]}_${selectedChords[1]}`;
          const offsetValue = chordRootOffsets[key];
          
          // If we don't find offsets for this order, we'll need to check the reverse order
          // and invert the offsets
          if (offsetValue === undefined) {
            const reverseKey = `${selectedChords[1]}_${selectedChords[0]}`;
            const reverseOffsetValue = chordRootOffsets[reverseKey];
            
            if (reverseOffsetValue !== undefined) {
              console.log(`Found offsets for reverse order: ${reverseKey}`);
              // Invert the offsets to maintain the correct musical relationship
              if (Array.isArray(reverseOffsetValue)) {
                offsets = reverseOffsetValue.map(val => -val);
              } else {
                offsets = [-reverseOffsetValue];
              }
            }
          } else {
            // We found offsets for the direct order
            console.log(`Found offsets for direct order: ${key}`);
            // Check if offset is an array or a single value
            if (Array.isArray(offsetValue)) {
              offsets = offsetValue;
            } else if (offsetValue !== undefined) {
              offsets = [offsetValue];
            }
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
      
      // Always pass the current single offset value
      calculateChordsWithOffset(currentOffset);
    }
  }, [selectedOffsetIndex, availableOffsets]);
  
  // Reset displayRoot to selectedRoot when any of these change:
  // - selectedRoot: When user selects a new root note
  // - selectedChords: When user selects different chords
  // - selectedOffsetIndex: When user selects a different scale offset
  useEffect(() => {
    // This ensures the scale always starts from the proper root
    // whenever any of the key inputs change
    setDisplayRoot(selectedRoot);
    
    // Only update originalRoot if we're not in a swapped state
    // This prevents overwriting our stored original root when swapping
    if (!localSwapped && !displayOrderSwapped) {
      console.log('Setting originalRoot from useEffect:', selectedRoot);
      setOriginalRoot(selectedRoot);
    }
  }, [selectedRoot, selectedChords, selectedOffsetIndex, localSwapped, displayOrderSwapped]);
  
  // We don't need the separate scale calculation useEffect anymore
  // as the scale is now calculated in calculateChordsWithOffset
  // and stored directly in setScaleNotes
  
  // Function to calculate chords with a specific offset
  const calculateChordsWithOffset = (offset) => {
    if (!selectedRoot || selectedChords.length === 0 || !chordTypes) return;
    
    console.log('calculateChordsWithOffset called with offset:', offset);
    
    const chordData = [];
    
    // Process first chord
    if (selectedChords.length > 0) {
      const firstChordId = selectedChords[0];
      const firstChordType = findChordTypeByClassName(chordTypes, firstChordId);
      
      // If we only have one chord, calculate it using the original method
      if (firstChordType && selectedChords.length === 1) {
        const firstRoot = selectedRoot;
        const firstFullName = getFullChordName(firstRoot, firstChordType.name);
        const firstNotes = calculateChordNotes(firstRoot, firstChordType);
        
        chordData.push({
          id: firstChordId,
          fullName: firstFullName,
          notes: firstNotes,
          chordType: firstChordType,
          root: firstRoot
        });
      }
      // If we have two chords, use the new calculateTwoChords function
      else if (firstChordType && selectedChords.length > 1) {
        const secondChordId = selectedChords[1];
        const secondChordType = findChordTypeByClassName(chordTypes, secondChordId);
        
        if (secondChordType) {
          console.log('Using calculateTwoChords with:', {
            root: selectedRoot,
            firstChord: firstChordType,
            secondChord: secondChordType,
            offset: offset
          });
          
          // Use our new function to calculate both chords and the scale
          // Always pass a single offset value
          console.log(`Using offset: ${offset}`);
          const result = calculateTwoChords(selectedRoot, firstChordType, secondChordType, offset);
          console.log('calculateTwoChords result:', result);
          
          // Always respect the original chord selection order for display
          // First selected chord
          chordData.push({
            id: selectedChords[0],
            fullName: getFullChordName(
              selectedChords[0] === firstChordId ? result.firstChord.root : result.secondChord.root,
              selectedChords[0] === firstChordId ? result.firstChord.type : result.secondChord.type
            ),
            notes: selectedChords[0] === firstChordId ? result.firstChord.notes : result.secondChord.notes,
            chordType: selectedChords[0] === firstChordId ? firstChordType : secondChordType,
            root: selectedChords[0] === firstChordId ? result.firstChord.root : result.secondChord.root
          });
          
          // Second selected chord
          chordData.push({
            id: selectedChords[1],
            fullName: getFullChordName(
              selectedChords[1] === secondChordId ? result.secondChord.root : result.firstChord.root,
              selectedChords[1] === secondChordId ? result.secondChord.type : result.firstChord.type
            ),
            notes: selectedChords[1] === secondChordId ? result.secondChord.notes : result.firstChord.notes,
            chordType: selectedChords[1] === secondChordId ? secondChordType : firstChordType,
            root: selectedChords[1] === secondChordId ? result.secondChord.root : result.firstChord.root
          });
          
          // Store the scale for later use
          // Always use the scale directly since we're passing a single offset
          if (result.scale) {
            console.log(`Using scale:`, result.scale);
            setScaleNotes(result.scale);
          } else {
            console.warn('No scale found in result');
          }
        }
      }
    }
    
    setCalculatedChords(chordData);
    
    // Get all unique notes from both chords and track which chord(s) each note belongs to
    if (chordData.length > 0) {
      // Create a map to track which chord(s) each note belongs to
      const notesMap = new Map();
      
      // Process notes from first chord
      if (chordData[0] && chordData[0].notes && Array.isArray(chordData[0].notes)) {
        chordData[0].notes.forEach(note => {
          notesMap.set(note, { note, inFirstChord: true, inSecondChord: false });
        });
      }
      
      // Process notes from second chord
      if (chordData[1] && chordData[1].notes && Array.isArray(chordData[1].notes)) {
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

  const handlePlayClick = async () => {
    // If already playing, stop the sequence
    if (isPlaying) {
      if (currentSequenceRef.current) {
        currentSequenceRef.current.dispose();
        currentSequenceRef.current = null;
      }
      Tone.Transport.stop();
      Tone.Transport.cancel(); // Cancel any scheduled events
      setIsPlaying(false);
      return;
    }

    try {
      // Start audio context - this must happen from a user gesture
      await Tone.start();
      console.log('Audio context started');

      // Get the ordered notes from the current scale
      const notes = getOrderedChordNotes();
      
      if (notes.length === 0) {
        console.log('No notes to play');
        return;
      }

      console.log('Playing notes:', notes);
      
      // Create a PluckSynth for a string-like plucked sound
      const synth = new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 1000,
        resonance: 0.95,
        release: 2.5
      }).toDestination();
      
      // Convert flat notes to sharp notation for Tone.js
      const noteMapping = {
        'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
      };
      
      // Add octave numbers to the notes (default to octave 4)
      const notesWithOctave = notes.map(note => {
        // Convert flat notation to sharp notation if needed
        const mappedNote = noteMapping[note] || note;
        return `${mappedNote}4`;
      });
      
      // Instead of using a sequence, manually schedule each note
      setIsPlaying(true);
      
      // Clear any previous events
      Tone.Transport.cancel();
      
      // Set the BPM
      Tone.Transport.bpm.value = 120;
      
      // Schedule each note individually
      let noteIndex = 0;
      const noteCount = notesWithOctave.length;
      
      // Create a counter to track played notes
      let playedNotes = 0;
      
      // Use a callback function that will be called for each note
      const playNote = () => {
        if (noteIndex < noteCount) {
          // Play the current note
          synth.triggerAttackRelease(notesWithOctave[noteIndex], '8n');
          noteIndex++;
          playedNotes++;
          
          // Log progress
          console.log(`Playing note ${playedNotes} of ${noteCount}: ${notesWithOctave[noteIndex-1]}`);
          
          // Schedule the next note after a delay
          if (noteIndex < noteCount) {
            setTimeout(playNote, 250); // 500ms between notes (120 BPM)
          } else {
            // We've played all notes, clean up
            setTimeout(() => {
              setIsPlaying(false);
              console.log('Finished playing all notes:', playedNotes);
            }, 250);
          }
        }
      };
      
      // Start playing the first note
      playNote();
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const handleTabClick = (e, index) => {
    // Stop event propagation to prevent dismissing the InfoBox
    e.stopPropagation();
    setSelectedOffsetIndex(index);
  };
  
  // Define the chromatic scale for reference
  const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  
  // Define the chromatic scale for reference
  
  // Get ordered notes starting with the display root note
  const getOrderedChordNotes = () => {
    if (!selectedRoot || calculatedChords.length === 0) return [];
    
    // Get all unique notes from both chords
    const uniqueNotes = new Set();
    
    // Determine which chord is displayed first based on swap state
    const firstDisplayedChord = displayOrderSwapped && calculatedChords.length > 1 
      ? calculatedChords[1] 
      : calculatedChords[0];
    
    // Get the root of the first displayed chord
    const firstDisplayedRoot = firstDisplayedChord.root;
    
    // Add all notes from both chords, respecting the display order
    if (displayOrderSwapped && calculatedChords.length > 1) {
      // When swapped, second chord (index 1) becomes first, first chord (index 0) becomes second
      calculatedChords[1].notes.forEach(note => uniqueNotes.add(note));
      calculatedChords[0].notes.forEach(note => uniqueNotes.add(note));
    } else {
      // Normal order
      calculatedChords.forEach(chord => {
        chord.notes.forEach(note => uniqueNotes.add(note));
      });
    }
    
    // IMPORTANT: Always use the root of the first displayed chord as the starting point
    // This ensures the scale always starts from the currently displayed first chord's root
    const rootIndex = flatNotes.indexOf(firstDisplayedRoot);
    if (rootIndex === -1) return Array.from(uniqueNotes);
    
    // Create an array of all notes in chromatic order starting from the first displayed chord's root
    const orderedNotes = [];
    for (let i = 0; i < flatNotes.length; i++) {
      const noteIndex = (rootIndex + i) % flatNotes.length;
      const note = flatNotes[noteIndex];
      if (uniqueNotes.has(note)) {
        orderedNotes.push(note);
      }
    }
    
    console.log('Ordered notes:', orderedNotes, 'First displayed root:', firstDisplayedRoot, 'Swapped:', displayOrderSwapped);
    return orderedNotes;
  };

  // Enhanced arrow click handler that only navigates to notes in the current scale
  const handleArrowClick = (e, direction) => {
    e.preventDefault(); // Prevent default button behavior
    e.stopPropagation(); // Prevent event bubbling
    
    // Get the available notes in the current chord/scale
    const availableNotes = getOrderedChordNotes();
    console.log('Available notes for arrow navigation:', availableNotes);
    
    if (!displayRoot || availableNotes.length === 0) {
      console.log('No display root or available notes');
      return;
    }
    
    // Find the current note's position in the available notes
    const currentNoteIndex = availableNotes.indexOf(displayRoot);
    console.log('Current note index:', currentNoteIndex, 'Current display root:', displayRoot);
    
    // If the current note isn't in the available notes, default to the first note
    if (currentNoteIndex === -1) {
      const newRoot = availableNotes[0];
      setDisplayRoot(newRoot);
      
      // Update the parent component's state
      if (onRootChange) {
        // Pass false to indicate this is not from a swap
        onRootChange(newRoot, false);
      }
      
      console.log('Note not in scale, defaulting to:', newRoot);
      return;
    }
    
    // Navigate to the next/previous note in the available notes
    let newRoot;
    if (direction === 'left') {
      // Left arrow: take first note and move it to the end
      // This is equivalent to moving forward in the array (next index)
      const nextIndex = (currentNoteIndex + 1) % availableNotes.length;
      newRoot = availableNotes[nextIndex];
      setDisplayRoot(newRoot);
      console.log('Left arrow clicked, new root:', newRoot);
    } else {
      // Right arrow: take last note and move it to the beginning
      // This is equivalent to moving backward in the array (previous index)
      const prevIndex = (currentNoteIndex - 1 + availableNotes.length) % availableNotes.length;
      newRoot = availableNotes[prevIndex];
      setDisplayRoot(newRoot);
      console.log('Right arrow clicked, new root:', newRoot);
    }
    
    // Update the parent component's state
    if (onRootChange) {
      // Pass false to indicate this is not from a swap
      onRootChange(newRoot, false);
    }
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
              <div className="infobox-controls" style={{ display: 'flex', alignItems: 'center' }}>
                {/* Only show swap button if we have two different chords selected */}
                {selectedChords.length === 2 && selectedChords[0] !== selectedChords[1] && (
                  <span className="swap-button" onClick={handleSwapChords} title="Swap chord order">
                    <FaExchangeAlt className="swap-icon" />
                  </span>
                )}
                
                {/* Color swap button styled to match other buttons - only show when exactly 2 chords are selected */}
                {selectedChords.length === 2 && (
                  <span 
                    className="color-swap-button" 
                    onClick={handleSwapDisplayColors}
                    title="Swap display colors"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(142, 68, 173, 0.8)',
                      marginLeft: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FaPalette style={{ color: 'white' }} />
                  </span>
                )}
                
                <span className="play-button" onClick={handlePlayClick} style={{ marginLeft: '10px' }}>
                  {isPlaying ? <FaPause className="play-icon" /> : <FaPlay className="play-icon" />}
                </span>
              </div>
              <div className="chordName">
                {calculatedChords.length > 0 ? (
                  <>
                    {/* Show the chords in swapped order but keep the color classes the same */}
                    <span className="firstChord">
                      {/* Make sure the index exists before accessing fullName */}
                      {displayOrderSwapped && calculatedChords.length > 1 
                        ? formatChordName(calculatedChords[1].fullName)
                        : formatChordName(calculatedChords[0].fullName)}
                    </span>
                    {calculatedChords.length > 1 && (
                      <>
                        <span className='plus'>&</span>
                        <span className="secondChord">
                          {/* Make sure the index exists before accessing fullName */}
                          {displayOrderSwapped 
                            ? formatChordName(calculatedChords[0].fullName)
                            : formatChordName(calculatedChords[1].fullName)}
                        </span>
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
                {/* Left arrow - using button for better accessibility and click handling */}
                <button className="arrow-left" onClick={(e) => handleArrowClick(e, 'left')} aria-label="Previous note"></button>
                
                {/* Notes container without drag functionality */}
                <div 
                    className="notes-wrapper"
                    style={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '5px',
                        padding: '10px'
                    }}
                >
                    {/* Display notes that appear in the selected chords, starting with root note */}
                    {getOrderedChordNotes().map((note, index) => {
                        // Safely determine if a note is in each chord
                        let inFirstChord = false;
                        let inSecondChord = false;
                        
                        if (calculatedChords.length > 0) {
                            // First chord is always at index 0
                            if (!displayOrderSwapped) {
                                inFirstChord = calculatedChords[0].notes.includes(note);
                            } else if (calculatedChords.length > 1) {
                                // When swapped and we have 2 chords, first chord is at index 1
                                inFirstChord = calculatedChords[1].notes.includes(note);
                            }
                        }
                        
                        if (calculatedChords.length > 1) {
                            // Second chord is at index 1 when not swapped
                            if (!displayOrderSwapped) {
                                inSecondChord = calculatedChords[1].notes.includes(note);
                            } else {
                                // When swapped, second chord is at index 0
                                inSecondChord = calculatedChords[0].notes.includes(note);
                            }
                        }
                        
                        // Skip notes that don't appear in any chord
                        if (!inFirstChord && !inSecondChord) {
                            return null;
                        }
                        
                        let className = '';
                        if (inFirstChord && inSecondChord) {
                            className = 'bothChords';
                        } else if (inFirstChord) {
                            // First chord is always orange
                            className = 'firstChord';
                        } else if (inSecondChord) {
                            // Second chord is always blue
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
                
                {/* Right arrow - using button for better accessibility and click handling */}
                <button className="arrow-right" onClick={(e) => handleArrowClick(e, 'right')} aria-label="Next note"></button>
            </div>
        </div>
        {allNotes.length === 0 && <span>No notes to display</span>}
        
        {/* Electrons section */}
        <div className="infoSection">
            <div className="sectionTitle">Electrons:</div>
            <div className="sectionContent">
                {electronNotes.map((note, index) => (
                    <span key={index}id="electron" className='infoElectrons'>{note}</span>
                ))}
                {electronNotes.length === 0 && <span>No electron notes to display</span>}
            </div>
        </div>
        {calculatedChords.length === 2 && (
          <FretboardDisplayer 
            firstChord={{
              name: displayOrderSwapped ? calculatedChords[1].fullName : calculatedChords[0].fullName,
              spelling: displayOrderSwapped ? calculatedChords[1].notes : calculatedChords[0].notes,
              root: displayOrderSwapped ? calculatedChords[1].root : calculatedChords[0].root,
              fretStart: 8,
              positions: [
                { string: 6, fret: 8 },
                { string: 5, fret: 8 },
                { string: 4, fret: 8 },
                { string: 3, fret: 9 }
              ]
            }}
            secondChord={{
              name: displayOrderSwapped ? calculatedChords[0].fullName : calculatedChords[1].fullName,
              spelling: displayOrderSwapped ? calculatedChords[0].notes : calculatedChords[1].notes,
              root: displayOrderSwapped ? calculatedChords[0].root : calculatedChords[1].root,
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