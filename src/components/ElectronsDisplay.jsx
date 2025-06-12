import React from 'react';
import styles from './ElectronsDisplay.module.css';
// Import SVG files directly
import electronOneToThree from '../assets/SVGs/list/electron_oneToThree.svg';
import electronThreeToFive1 from '../assets/SVGs/list/electron_threeToFive1.svg';
import electronThreeToFive2 from '../assets/SVGs/list/electron_threeToFive2.svg';

const ElectronsDisplay = ({ isVisible }) => {
  // Debug log to check if component is being rendered
  console.log('ElectronsDisplay rendering with isVisible:', isVisible);
  console.log('SVG imports:', { electronOneToThree, electronThreeToFive1, electronThreeToFive2 });
  
  // Component is conditionally rendered by parent now, so isVisible should always be true
  // but we'll keep the check for safety
  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles['electrons-display']}>
    
        <img 
          src={electronOneToThree} 
          alt="Electron 1" 
          className={styles['electron_oneToThree']}
        />
     
     
        <img 
          src={electronThreeToFive1} 
          alt="Electron 2" 
          className={styles['electron_threeToFive1']} 
        />
      
        <img 
          src={electronThreeToFive2} 
          alt="Electron 3" 
          className={styles['electron_threeToFive2']} 
        />
      
     
    </div>
  );
};

export default ElectronsDisplay;
