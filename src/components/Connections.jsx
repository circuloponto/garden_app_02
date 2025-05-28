import React from 'react'



import { connections } from '../data/connections';
import raiwbow1 from '../assets/SVGs/rainbow1.svg';
import sixteenToEighteen from '../assets/SVGs/sixteenToEighteen.svg';
import eighteenToThree from '../assets/SVGs/eighteenToThree.svg';
import sixteenToThree from '../assets/SVGs/sixteenToThree.svg';
import eightToThree from '../assets/SVGs/eightToThree.svg';
const svgMap = {
  raiwbow1,
  sixteenToEighteen,
  eighteenToThree,
  sixteenToThree,
  eightToThree,
};

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
          conn.svg && svgMap[conn.svg] ? (
            <img
              key={conn.className}
              src={svgMap[conn.svg]}
              className={conn.className}
              alt="connection-svg"
            />
          ) : (
            <div key={conn.className} className={conn.className}></div>
          )
        ))}
       {/*  <div className="squared"></div> */}
      </div>
    );
  }

  // In "connections" mode, show all connections
  return (
    <div className='allConnections'>
      {connections.map(conn => (
        conn.svg && svgMap[conn.svg] ? (
          <img
            key={conn.className}
            src={svgMap[conn.svg]}
            className={conn.className}
            alt="connection-svg"
          />
        ) : (
          <div key={conn.className} className={conn.className}></div>
        )
      ))}
    </div>
  );
};


export default Connections;