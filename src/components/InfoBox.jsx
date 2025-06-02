import React, { useState, useEffect } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import FretboardDisplayer from './FretboardDisplayer'
import "./FretboardDisplayer.module.css"
import { calculateChordNotes, getFullChordName, findChordTypeByClassName, getOffsetRoot, getRootOffset } from '../utils/noteCalculator'

const InfoBox = ({ selectedRoot, selectedChords, chordTypes, chordRootOffsets }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [calculatedChords, setCalculatedChords] = useState([]);
  const [allNotes, setAllNotes] = useState([]);

  useEffect(() => {
    if (selectedRoot && selectedChords.length > 0 && chordTypes) {
      // Calculate notes for each selected chord
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
          // Get the offset for this chord pair
          const offset = getRootOffset(chordRootOffsets, selectedChords[0], secondChordId);
          
          // Calculate the offset root
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
      
      // Get all unique notes from both chords
      if (chordData.length > 0) {
        const notesSet = new Set();
        chordData.forEach(chord => {
          chord.notes.forEach(note => notesSet.add(note));
        });
        setAllNotes(Array.from(notesSet));
      } else {
        setAllNotes([]);
      }
    } else {
      setCalculatedChords([]);
      setAllNotes([]);
    }
  }, [selectedRoot, selectedChords, chordTypes, chordRootOffsets]);

  const handlePlayClick = () => {
    // Toggle play state
    setIsPlaying(!isPlaying);
    
    // Here you would add actual audio playback logic in the future
    console.log(`${isPlaying ? 'Stopping' : 'Playing'} chord audio`);
  };

  return (
    <div className={`infoBox ${selectedChords.length < 2 ? 'hidden' : ''}`}>
        {/* Header section */}
        <div className="infoTitle">
            <h2>
              <span className="play-button" onClick={handlePlayClick}>
                {isPlaying ? <FaPause className="play-icon" /> : <FaPlay className="play-icon" />}
              </span> 
              Hear it
            </h2>
           {/*  <div className="rootNote">
              <span>Root: </span>
              <span className="selectedRoot">{selectedRoot}</span>
            </div> */}
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
        
        {/* Notes section */}
        <div className="infoSection">
            <div className="sectionTitle">Notes:</div>
            <div className="sectionContent">
                {allNotes.map((note, index) => {
                    const isInFirstChord = calculatedChords[0]?.notes.includes(note);
                    const isInSecondChord = calculatedChords.length > 1 && calculatedChords[1].notes.includes(note);
                    
                    let className = '';
                    if (isInFirstChord && isInSecondChord) {
                        className = 'bothChords';
                    } else if (isInFirstChord) {
                        className = 'firstChord';
                    } else if (isInSecondChord) {
                        className = 'secondChord';
                    }
                    
                    return (
                        <span key={index} className={className}>{note}</span>
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