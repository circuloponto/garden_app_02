import React from 'react'
import Button from './button'
import RootSelector from './RootSelector'
import { FaEye, FaEyeSlash, FaLink, FaApple, FaChessBoard, FaSlidersH } from 'react-icons/fa'

const Sidebar = ({ setViewMode, onRootChange, onToggleSlides }) => {
  return (
    <div className='buttons'>
      <Button 
        title="Toggle view" 
        stateOptions={['Connections', 'Fruits']} 
        setViewMode={setViewMode} 
        icon={FaLink}
      />
      <Button 
        title="All Electrons" 
        stateOptions={['OFF', 'ON']} 
        icon={FaChessBoard}
      />
      <Button 
        title="Show Trichords" 
        stateOptions={['OFF', 'ON']} 
        icon={FaEye}
      />
      <Button 
        title="Hide Electrons" 
        stateOptions={['OFF', 'ON']} 
        icon={FaEyeSlash}
      />
      <RootSelector 
        options={['C', 'Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']}
        onRootChange={onRootChange}
      />
      <Button 
        title="Slide Presentation" 
        stateOptions={['OFF', 'ON']} 
        setViewMode={(mode) => {
          onToggleSlides();
        }} 
        icon={FaSlidersH}
      />
    </div>
  )
}

export default Sidebar