import React from 'react'



import { connections } from '../data/connections';

const Connections = ({ viewMode, selectedChords }) => {
  // In "fruits" mode, show only connections between the two selected chords
  if (viewMode === 'fruits') {
    if (selectedChords.length !== 2) return null;
    const [chordA, chordB] = selectedChords;
    const visibleConnections = connections.filter(
      c =>
        (c.from === chordA && c.to === chordB) ||
        (c.from === chordB && c.to === chordA)
    );
    return (
      <div className='allConnections'>
        {visibleConnections.map(conn => (
          <div key={conn.className} className={conn.className}></div>
        ))}
      </div>
    );
  }

  // In "connections" mode, show all connections
  return (
    <div className='allConnections'>
      {connections.map(conn => (
        <div key={conn.className} className={conn.className}></div>
      ))}
    </div>
  );
};


export default Connections;