import { useState } from 'react'
import Diagram from './components/Diagram'
import Button from './components/button'
import Connections from './components/Connections'
import './App.css'

function App() {
  

  return (
    <>
      <div className='app'>
        <div className="buttons">
          <Button title="Toggle view" stateOptions={['Connections', 'Fruits']} />
          <Button title="All Electrons"stateOptions={['OFF', 'ON']} />
          <Button title="Show Trichords" state={''} />
          <Button title="Hide Electrons" state={''} />
        </div>
        
        <Diagram />
        <Connections />
        </div>
    </>
  )
}

export default App
