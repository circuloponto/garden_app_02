import React from 'react'

const Chord = ({svg,className}) => {
  return (
    <div className={`element ${className}`}><img className="svg" src={svg} alt="" /></div>
  )
}

export default Chord