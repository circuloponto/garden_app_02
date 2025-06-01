import React from 'react'
import styles from './FretboardDisplayer.module.css'
import Fretboard from './Fretboard'
const FretboardDisplayer = () => {

  const mockChord1 = {
    name: 'C7',
    spelling: ['C', 'E', 'G', 'Bb'],
    positions: [
      {string: 6, fret: null},
      {string: 5, fret:5},
      {string: 4, fret:3},
      {string: 3, fret: 5},
      {string: 2, fret:3},
      {string: 1, fret: null},
    ],
    fretStart: 3,
  }
  const mockChord2 = {
    name: 'Eb7',
    positions: [
      {string: 6, fret: null},
      {string: 5, fret:7},
      {string: 4, fret:6},
      {string: 3, fret: 7},
      {string: 2, fret:6},
      {string: 1, fret: null},
    ],
    spelling: ['Eb', 'Gb', 'A', 'Db'],
    fretStart: 5,
  }
  
  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Fretboard chord={mockChord1} type="first" />
      <Fretboard chord={mockChord2} type="second" />
    </div>
  )
}

export default FretboardDisplayer