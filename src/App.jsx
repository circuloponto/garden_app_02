import { useState, useEffect } from 'react'
import Diagram from './components/Diagram'
import Button from './components/button'
import Connections from './components/Connections'
import { connections } from './data/connections';
import './App.css'



function App() {
  const [viewMode, setViewMode] = useState('connections'); // 'connections' or 'fruits'
  const [selectedChords, setSelectedChords] = useState([]); // e.g. ['four', 'five']

  // Reset selection when switching from 'fruits' to 'connections' and there is a selection
 
  useEffect(() => {
    if (viewMode === 'connections' && selectedChords.length > 0) {
      setSelectedChords([]);
    }
  }, [viewMode]);

  // Chord selection handler (only allow valid pairs)
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

  return (
    <>
      <div className='app'>
        <div className="buttons">
          <Button title="Toggle view" stateOptions={['Connections', 'Fruits']}  setViewMode={setViewMode}/>
          <Button title="All Electrons" stateOptions={['OFF', 'ON']} />
          <Button title="Show Trichords" state={null} />
          <Button title="Hide Electrons" state={null} />
        </div>
        <div className="scaler">

        <Diagram handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>


        <Connections viewMode={viewMode} selectedChords={selectedChords} />
        </div>
      </div>
    </>
  )
}

export default App
