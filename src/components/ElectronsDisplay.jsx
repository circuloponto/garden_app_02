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
import electronThreeToEighteen from '../assets/SVGs/list/electron_threeToEighteen.svg';
import electronThreeToSixteen from '../assets/SVGs/list/electron_threeToSixteen.svg';
import electronFiveToNineteen from '../assets/SVGs/list/electron_fiveToNineteen.svg';
import electronFiveToEighteen from '../assets/SVGs/list/electron_fiveToEighteen.svg';
import electronFiveToSixteen1 from '../assets/SVGs/list/electron_fiveToSixteen1.svg';
import electronFiveToFifteen from '../assets/SVGs/list/electron_fiveToFifteen.svg';
import electronEightToSixteen from '../assets/SVGs/list/electron_eightToSixteen.svg';
import electronEightToEighteen from '../assets/SVGs/list/electron_eightToEighteen.svg';
import electronEightToThree from '../assets/SVGs/list/electron_eightToThree.svg';
import electronOneToThirteen from '../assets/SVGs/list/electron_oneToThirteen.svg';
import electronOneToTwentyOne from '../assets/SVGs/list/electron_oneToThirteen.svg';
import electronTwelveToTwentyOne from '../assets/SVGs/list/electron_oneToThirteen.svg';
import electronTwelveToThirteen from '../assets/SVGs/list/electron_oneToThirteen.svg';
import electronSeventeenToEight from '../assets/SVGs/list/electron_seventeenToEight.svg';
import electronFifteenToNineteen1 from '../assets/SVGs/list/electron_fifteenToNineteen1.svg';
import electronFifteenToNineteen2 from '../assets/SVGs/list/electron_fifteenToNineteen2.svg';
import electronFifteenToNineteen3 from '../assets/SVGs/list/electron_fifteenToNineteen3.svg';




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
        <img 
          src={electronThreeToEighteen} 
          alt="Electron 9" 
          className={styles['electron_threeToEighteen']} 
        />
        <img 
          src={electronThreeToSixteen} 
          alt="Electron 10" 
          className={styles['electron_threeToSixteen']} 
        />  
        <img 
          src={electronFiveToNineteen} 
          alt="Electron 11" 
          className={styles['electron_fiveToNineteen']} 
        />
        <img 
          src={electronFiveToEighteen} 
          alt="Electron 12" 
          className={styles['electron_fiveToEighteen']} 
        />  
        <img 
          src={electronFiveToSixteen1} 
          alt="Electron 13" 
          className={styles['electron_fiveToSixteen1']} 
        />  
        <img 
          src={electronFiveToFifteen} 
          alt="Electron 14" 
          className={styles['electron_fiveToFifteen']} 
        />  
        <img 
          src={electronEightToSixteen} 
          alt="Electron 15" 
          className={styles['electron_eightToSixteen']} 
        />  
        <img 
          src={electronEightToEighteen} 
          alt="Electron 16" 
          className={styles['electron_eightToEighteen']} 
        />    
        <img 
          src={electronEightToThree} 
          alt="Electron 17" 
          className={styles['electron_eightToThree']} 
        />    
        <img 
          src={electronOneToThirteen} 
          alt="Electron 18" 
          className={styles['electron_oneToThirteen']} 
        />    
        <img 
          src={electronOneToTwentyOne} 
          alt="Electron 19" 
          className={styles['electron_oneToTwentyOne']} 
        />    
        <img 
          src={electronTwelveToTwentyOne} 
          alt="Electron 20" 
          className={styles['electron_twelveToTwentyOne']} 
        />    
        <img 
          src={electronTwelveToThirteen} 
          alt="Electron 21" 
          className={styles['electron_twelveToThirteen']} 
        />   
        <img 
          src={electronSeventeenToEight} 
          alt="Electron 22" 
          className={styles['electron_seventeenToEight']} 
        />    
        <img 
          src={electronFifteenToNineteen1} 
          alt="Electron 23" 
          className={styles['electron_fifteenToNineteen1']} 
        />   
        <img 
          src={electronFifteenToNineteen2} 
          alt="Electron 24" 
          className={styles['electron_fifteenToNineteen2']} 
        />   
        <img 
          src={electronFifteenToNineteen3} 
          alt="Electron 25" 
          className={styles['electron_fifteenToNineteen3']} 
        />   
    </div>
  );
};

export default ElectronsDisplay;
