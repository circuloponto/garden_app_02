import React, { useState } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import FretboardDisplayer from './FretboardDisplayer'
import "./FretboardDisplayer.module.css"
const InfoBox = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    // Toggle play state
    setIsPlaying(!isPlaying);
    
    // Here you would add actual audio playback logic in the future
    console.log(`${isPlaying ? 'Stopping' : 'Playing'} chord audio`);
  };

  return (
    <div className='infoBox'>
        {/* Header section */}
        <div className="infoTitle">
            <h2>
              <span className="play-button" onClick={handlePlayClick}>
                {isPlaying ? <FaPause className="play-icon" /> : <FaPlay className="play-icon" />}
              </span> 
              Hear it
            </h2>
            <div className="chordName">
                <span className='firstChord'>C7</span>
                <span className='plus'>+</span>
                <span className='secondChord'>Ebmin7b5</span>
            </div>
        </div>
        
        {/* Notes section */}
        <div className="infoSection">
            <div className="sectionTitle">Notes:</div>
            <div className="sectionContent">
                <span className='firstChord'>C</span>
                <span className='secondChord'>Db</span>
                <span className='secondChord'>Eb</span>
                <span className='firstChord'>E</span>
                <span className='secondChord'>Gb</span>
                <span className='firstChord'>G</span>
                <span className='secondChord'>A</span>
                <span className='firstChord'>Bb</span>
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
        <FretboardDisplayer />
    </div>
  )
}

export default InfoBox