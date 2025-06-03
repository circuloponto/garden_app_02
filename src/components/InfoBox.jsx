import React, { useState, useEffect } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import FretboardDisplayer from './FretboardDisplayer'
import "./FretboardDisplayer.module.css"
import { calculateChordNotes, getFullChordName, findChordTypeByClassName, getOffsetRoot, getRootOffset, getNoteIndex } from '../utils/noteCalculator'

const InfoBox = ({ selectedRoot, selectedChords, chordTypes, chordRootOffsets }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [calculatedChords, setCalculatedChords] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [availableOffsets, setAvailableOffsets] = useState([]);
  const [selectedOffsetIndex, setSelectedOffsetIndex] = useState(0);

  useEffect(() => {
    if (selectedRoot && selectedChords.length > 0 && chordTypes) {
      // Get available offsets for this chord pair
      let offsets = [];
      if (selectedChords.length > 1) {
        const key = `${selectedChords[0]}_${selectedChords[1]}`;
        const offsetValue = chordRootOffsets[key];
        
        // Check if offset is an array or a single value
        if (Array.isArray(offsetValue)) {
          offsets = offsetValue;
        } else if (offsetValue !== undefined) {
          offsets = [offsetValue];
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
      calculateChordsWithOffset(selectedOffsetIndex >= 0 && offsets.length > 0 ? offsets[0] : 0);
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
      calculateChordsWithOffset(availableOffsets[selectedOffsetIndex]);
    }
  }, [selectedOffsetIndex]);
  
  // Function to calculate chords with a specific offset
  const calculateChordsWithOffset = (offset) => {
    if (!selectedRoot || selectedChords.length === 0 || !chordTypes) return;
    
    const chordData = [];
    
    // Process first chord with the selected root
    if (selectedChords.length > 0) {
      const firstChordId = selectedChords[0];
      const firstChordType = findChordTypeByClassName(chordTypes, firstChordId);
      
      if (firstChordType) {
        const firstFullName = getFullChordName(selectedRoot, firstChordType.name);
        const firstNotes = calculateChordNotes(selectedRoot, firstChordType.intervals);
        
        chordData.push({
          id: firstChordId,
          fullName: firstFullName,
          notes: firstNotes,
          chordType: firstChordType,
          root: selectedRoot
        });
      }
    }
    
    // Process second chord with offset root if available
    if (selectedChords.length > 1) {
      const secondChordId = selectedChords[1];
      const secondChordType = findChordTypeByClassName(chordTypes, secondChordId);
      
      if (secondChordType && chordData.length > 0) {
        // Calculate the offset root using the provided offset
        const offsetRoot = getOffsetRoot(selectedRoot, offset);
        
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
    } else {
      setAllNotes([]);
    }
  };

  const handlePlayClick = () => {
    // Toggle play state
    setIsPlaying(!isPlaying);
    
    // Here you would add actual audio playback logic in the future
    console.log(`${isPlaying ? 'Stopping' : 'Playing'} chord audio`);
  };
  
  // Handle tab selection
  const handleTabClick = (index) => {
    setSelectedOffsetIndex(index);
  };

  return (
    <div className={`infoBox ${selectedChords.length < 2 ? 'hidden' : ''}`}>
        {/* Scale tabs - now at the very top */}
        {availableOffsets.length > 1 && (
          <div className="scaleTabs">
            {availableOffsets.map((offset, index) => (
              <div 
                key={index} 
                className={`scaleTab ${selectedOffsetIndex === index ? 'active' : ''}`}
                onClick={() => handleTabClick(index)}
              >
                Scale {index + 1}
              </div>
            ))}
          </div>
        )}
        
        {/* Header section */}
        <div className="infoTitle">
            <div className="titleRow">
              <span className="play-button" onClick={handlePlayClick}>
                {isPlaying ? <FaPause className="play-icon" /> : <FaPlay className="play-icon" />}
              </span>
              <div className="chordName">
                {calculatedChords.length > 0 ? (
                  <>
                    <span className='firstChord'>{calculatedChords[0].fullName}</span>
                    {calculatedChords.length > 1 && (
                      <>
                        <span className='plus'>+</span>
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
        
        {/* Notes section */}
        <div className="infoSection">
            <div className="sectionTitle">Notes:</div>
            <div className="sectionContent">
                {allNotes.map((noteData, index) => {
                    let className = '';
                    if (noteData.inFirstChord && noteData.inSecondChord) {
                        className = 'bothChords';
                    } else if (noteData.inFirstChord) {
                        className = 'firstChord';
                    } else if (noteData.inSecondChord) {
                        className = 'secondChord';
                    }
                    
                    return (
                        <span key={index} className={className}>{noteData.note}</span>
                    );
                })}
                {allNotes.length === 0 && <span>No notes to display</span>}
            </div>
        </div>
        
        {/* Electrons section */}
        <div className="infoSection">
            <div className="sectionTitle">Electrons:</div>
            <div className="sectionContent">
                <span className='infoElectrons'>D</span>
                <span className='infoElectrons'>F</span>
                <span className='infoElectrons'>Ab</span>
                <span className='infoElectrons'>B</span>
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