import React, { useState, useEffect } from "react";

import Diagram from './components/Diagram'
import Connections from './components/Connections'
import InfoBox from './components/InfoBox'
import Fretboard from './components/Fretboard'
import Sidebar from './components/Sidebar'

import { connections } from './data/connections';

import logo from './assets/SVGs/logo.svg'

import './App.css'
import './tutorial.css' 

function App() {
  const [viewMode, setViewMode] = useState('connections'); // 'connections' or 'fruits'
  const [selectedChords, setSelectedChords] = useState([]); // e.g. ['four', 'five']
  const [tutorialStep, setTutorialStep] = useState(0); // 0 = not showing, 1 = chords, 2 = connections
  
  // Start tutorial automatically when app loads
  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window !== 'undefined') {
      // Show first step after a short delay
      const timer = setTimeout(() => {
        setTutorialStep(1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Apply data attribute to body for CSS targeting
  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window !== 'undefined' && document && document.body) {
      if (tutorialStep > 0) {
        document.body.setAttribute('data-tutorial-step', tutorialStep);
      } else {
        document.body.removeAttribute('data-tutorial-step');
      }
    }
  }, [tutorialStep]);
  
  // Handle tutorial navigation
  const handleNextStep = () => {
    if (tutorialStep === 1) {
      setTutorialStep(2);
    } else {
      setTutorialStep(0); // End tutorial
    }
  };
  
  const handleSkipTutorial = () => {
    setTutorialStep(0);
  };

  // Reset selection when switching from 'fruits' to 'connections' and there is a selection
 
  useEffect(() => {
    if (viewMode === 'connections' && selectedChords.length > 0) {
      setSelectedChords([]);
    }
  }, [viewMode]);

  // Chord selection handler for both view modes
  const handleChordSelect = (chord) => {
    console.log(chord)
    console.log('its working')
    
    if (viewMode === 'fruits') {
      if (selectedChords.length === 0) {
        setSelectedChords([chord]);
      } else if (selectedChords.length === 1) {
        const first = selectedChords[0];
        // Only allow if a connection exists in either direction
        const isValidPair = connections.some(
          c =>
            (c.from === first && c.to === chord) ||
            (c.from === chord && c.to === first)
        );
        if (isValidPair && first !== chord) {
          setSelectedChords([first, chord]);
        } else if (first === chord) {
          // Optionally, deselect if the same chord is clicked again
          setSelectedChords([]);
        }
        // else do nothing if not a valid pair
      } else {
        setSelectedChords([chord]);
      }
    } else if (viewMode === 'connections') {
      // In connections view, handle chord selection for filtering
      if (selectedChords.includes(chord)) {
        // If chord is already selected, deselect it
        setSelectedChords(selectedChords.filter(c => c !== chord));
      } else if (selectedChords.length < 2) {
        // Add chord to selection if we have less than 2 chords selected
        setSelectedChords([...selectedChords, chord]);
      } else {
        // If we already have 2 chords selected, replace with the new chord
        setSelectedChords([chord]);
      }
    }
  };

  // Compute possible chords for animation (only in 'fruits' mode, when one chord is selected)
  let possibleChords = [];
  if (viewMode === 'fruits' && selectedChords.length === 1) {
    const first = selectedChords[0];
    possibleChords = Array.from(new Set(
      connections
        .filter(c => c.from === first || c.to === first)
        .map(c => (c.from === first ? c.to : c.from))
    ));
  }
  // DEBUG: log selection and possible chords
  console.log('selectedChords:', selectedChords);
  console.log('possibleChords:', possibleChords);

  // Determine the app class based on tutorial step
  const appClassName = tutorialStep > 0 ? `app tutorial-step-${tutorialStep}` : 'app';

  return (
    <div className={appClassName}>
      {/* Simple Tutorial UI */}
      {tutorialStep > 0 && (
        <div className="tutorial-container">
          {/* Tutorial modal */}
          <div className="tutorial-modal">
            <h3>
              {tutorialStep === 1 ? 'Chords' : 'Connections'}
            </h3>
            <p>
              {tutorialStep === 1 
                ? 'These elements are chords.' 
                : 'These are connections.'}
            </p>
            <div className="tutorial-buttons">
              <button onClick={handleSkipTutorial}>Skip</button>
              <button onClick={handleNextStep}>
                {tutorialStep === 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          </div>
        </div>
      )}
<div className="logo">
  <img src={logo} width={100} height={100} alt="" />
</div>
        <Sidebar setViewMode={setViewMode} />
        <div className="content-wrapper">
          <div className="scaler">
            <Diagram handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
            <Connections viewMode={viewMode} selectedChords={selectedChords} />
          </div>
          <InfoBox />
         
        </div> 
    </div>
    
  )
}

export default App
