import React from 'react'
import styles from './FretboardDisplayer.module.css'
import Fretboard from './Fretboard'
const FretboardDisplayer = () => {

  const mockChord1 = {
    name: 'C7',
    spelling: ['C', 'E', 'G', 'Bb'],
    fretStart: 3,
  }
  const mockChord2 = {
    name: 'Ebmin7b5',
    spelling: ['Eb', 'Gb', 'A', 'Db'],
    fretStart: 5,
  }
  return (
    <div className={styles.fretboardDisplayer}>
        <Fretboard chord={mockChord1} />
        <Fretboard chord={mockChord2} />
    </div>
  )
}

export default FretboardDisplayer