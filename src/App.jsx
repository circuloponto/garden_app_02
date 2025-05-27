import { useState } from 'react'
import Diagram from './components/Diagram'
import Button from './components/button'
import Connections from './components/Connections'
import { connections } from './data/connections';
import './App.css'



function App() {
  const [viewMode, setViewMode] = useState('connections'); // 'connections' or 'fruits'
  const [selectedChords, setSelectedChords] = useState([]); // e.g. ['four', 'five']

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

  return (
    <>
      <div className='app'>
        <div className="buttons">
          <Button title="Toggle view" stateOptions={['Connections', 'Fruits']}  setViewMode={setViewMode}/>
          <Button title="All Electrons" stateOptions={['OFF', 'ON']} />
          <Button title="Show Trichords" state={null} />
          <Button title="Hide Electrons" state={null} />
        </div>
        <Diagram handleChordSelect={handleChordSelect} selectedChords={selectedChords}/>

        <Connections viewMode={viewMode} selectedChords={selectedChords} />
      </div>
    </>
  )
}

export default App
