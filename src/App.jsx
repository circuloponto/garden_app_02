import React, { useState, useEffect } from "react";

import Diagram from './components/Diagram'
import Connections from './components/Connections'
import InfoBox from './components/InfoBox'
import Fretboard from './components/Fretboard'
import Sidebar from './components/Sidebar'
import SlidePresentation from './components/SlidePresentation'

import { connections, chordTypes, chordRootOffsets } from './data/connections';

import logo from './assets/SVGs/logo.svg'

import './App.css'
import './tutorial.css' 

function App() {
  const [viewMode, setViewMode] = useState('fruits'); // 'connections' or 'fruits'
  const [selectedChords, setSelectedChords] = useState([]); // e.g. ['four', 'five']
  const [tutorialStep, setTutorialStep] = useState(0); // 0 = not showing, 1 = chords, 2 = connections
  const [selectedRoot, setSelectedRoot] = useState('C'); // Default root note
  const [showSlides, setShowSlides] = useState(false); // Control slide presentation visibility
  
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

  // Deselect all chords function
  const deselectAllChords = () => {
    setSelectedChords([]);
  };

  // Chord selection handler for both view modes
  const handleChordSelect = (chord) => {
    console.log('Chord selected:', chord, 'Current viewMode:', viewMode);
    console.log('Current selectedChords:', JSON.stringify(selectedChords));
    
    if (viewMode === 'fruits') {
      if (selectedChords.length === 0) {
        // First click: select the chord
        console.log('First selection:', chord);
        setSelectedChords([chord]);
      } else if (selectedChords.length === 1) {
        const first = selectedChords[0];
        console.log('Second selection attempt. First chord:', first, 'Current chord:', chord);
        
        if (first === chord) {
          // Second click on the same chord: create a scale with two versions of the chord a semitone apart
          console.log('Same chord clicked twice - creating scale');
          // We add the same chord twice to the selection array
          const newSelection = [chord, chord];
          console.log('Setting new selection:', JSON.stringify(newSelection));
          setSelectedChords(newSelection);
        } else {
          // Clicking a different chord when one is already selected
          // Only allow if a connection exists in either direction
          const isValidPair = connections.some(
            c =>
              (c.from === first && c.to === chord) ||
              (c.from === chord && c.to === first)
          );
          console.log('Is valid pair?', isValidPair);
          if (isValidPair) {
            const newSelection = [first, chord];
            console.log('Setting valid pair:', JSON.stringify(newSelection));
            setSelectedChords(newSelection);
          }
          // else do nothing if not a valid pair
        }
      } else if (selectedChords.length === 2) {
        // If two chords are already selected
        if (selectedChords[0] === selectedChords[1] && selectedChords[0] === chord) {
          // Third click on the same chord that was selected twice - deselect it
          console.log('Third click on same chord - deselecting');
          setSelectedChords([]);
        } else {
          // Clicking a different chord when two chords are already selected
          console.log('Resetting selection to:', chord);
          setSelectedChords([chord]);
        }
      } else {
        // Fallback case
        console.log('Resetting selection to:', chord);
        setSelectedChords([chord]);
      }
    } else if (viewMode === 'connections') {
      console.log('In connections mode, chord:', chord);
      console.log('Includes chord?', selectedChords.includes(chord), 'Length:', selectedChords.length);
      
      if (selectedChords.length === 0) {
        // First click: select the chord
        console.log('First selection in connections mode:', chord);
        setSelectedChords([chord]);
      } else if (selectedChords.length === 1) {
        const first = selectedChords[0];
        
        if (first === chord) {
          // Second click on the same chord: create a scale
          console.log('Same chord clicked twice in connections mode - creating scale');
          setSelectedChords([chord, chord]);
        } else {
          // Clicking a different chord when one is already selected
          setSelectedChords([first, chord]);
        }
      } else if (selectedChords.length === 2) {
        // If two chords are already selected
        if (selectedChords[0] === selectedChords[1] && selectedChords[0] === chord) {
          // Third click on the same chord that was selected twice - deselect it
          console.log('Third click on same chord in connections mode - deselecting');
          setSelectedChords([]);
        } else {
          // Clicking a different chord when two chords are already selected
          console.log('Resetting selection in connections mode to:', chord);
          setSelectedChords([chord]);
        }
      } else {
        // Fallback case
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
        <Sidebar setViewMode={setViewMode} onRootChange={setSelectedRoot} onToggleSlides={() => setShowSlides(prev => !prev)} />
        <div className="content-wrapper">
          {showSlides ? (
            <SlidePresentation onClose={() => setShowSlides(false)} />
          ) : (
            <>
              <div className="scaler">
                <div className="controls">
                  <button className="deselect-button" onClick={deselectAllChords}>Deselect All</button>
                </div>
                <Diagram handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Connections viewMode={viewMode} selectedChords={selectedChords} />
              </div>
              <InfoBox selectedRoot={selectedRoot} selectedChords={selectedChords} chordTypes={chordTypes} chordRootOffsets={chordRootOffsets} />
            </>
          )}
        </div> 
    </div>
    
  )
}

export default App
