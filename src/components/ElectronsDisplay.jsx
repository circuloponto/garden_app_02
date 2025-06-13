import React from 'react';
import styles from './ElectronsDisplay.module.css';
// Import SVG files directly
import electronOneToThree from '../assets/SVGs/list/electron_oneToThree.svg';
import electronThreeToFive1 from '../assets/SVGs/list/electron_threeToFive1.svg';
import electronThreeToFive2 from '../assets/SVGs/list/electron_threeToFive2.svg';
import electronThreeToNineteen1 from '../assets/SVGs/list/electron_threeToNineteen1.svg';
import electronThreeToNineteen2 from '../assets/SVGs/list/electron_threeToNineteen2.svg';
import electronDittoThree from '../assets/SVGs/list/electron_dittoThree.svg';
import electronThreeToFifteen1 from '../assets/SVGs/list/electron_threeToFifteen1.svg';
import electronThreeToFifteen2 from '../assets/SVGs/list/electron_threeToFifteen2.svg';
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
        <img 
          src={electronThreeToNineteen1} 
          alt="Electron 4" 
          className={styles['electron_threeToNineteen1']} 
        />
        <img 
          src={electronThreeToNineteen2} 
          alt="Electron 5" 
          className={styles['electron_threeToNineteen2']} 
        /> 
        <img 
          src={electronDittoThree} 
          alt="Electron 6" 
          className={styles['electron_dittoThree']} 
        /> 
        <img 
          src={electronThreeToFifteen1} 
          alt="Electron 7" 
          className={styles['electron_threeToFifteen1']} 
        />
        <img 
          src={electronThreeToFifteen2} 
          alt="Electron 8" 
          className={styles['electron_threeToFifteen2']} 
        />  
     
    </div>
  );
};

export default ElectronsDisplay;
