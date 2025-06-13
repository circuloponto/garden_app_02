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
import electronEightToFifteen from '../assets/SVGs/list/electron_eightToFifteen.svg';
import electronEightToNineteen from '../assets/SVGs/list/electron_eightToNineteen.svg';
import electronTenToFifteen from '../assets/SVGs/list/electron_tenToFifteen.svg';
import electronTenToNineteen from '../assets/SVGs/list/electron_tenToNineteen.svg';
import electronEightToTen from '../assets/SVGs/list/electron_eightToTen.svg';
import electronTenToTwelve from '../assets/SVGs/list/electron_tenToTwelve.svg';
import electronThirteenToFifteen from '../assets/SVGs/list/electron_thirteenToFifteen.svg';
import electronFifteenToSixteen from '../assets/SVGs/list/electron_fifteenToSixteen.svg';
import electronSixteenToSeventeen from '../assets/SVGs/list/electron_sixteenToSeventeen.svg';
import electronSeventeenToEighteen from '../assets/SVGs/list/electron_seventeenToEighteen.svg';
import electronSixteenToEighteen from '../assets/SVGs/list/electron_sixteenToEighteen.svg';
import electronEighteenToNineteen from '../assets/SVGs/list/electron_eighteenToNineteen.svg';
import electronNineteenToTwentyOne from '../assets/SVGs/list/electron_nineteenToTwentyOne.svg';
import electronDittoFive from '../assets/SVGs/list/electron_dittoFive.svg';
import electronDittoEight from '../assets/SVGs/list/electron_dittoEight.svg';
import electronDittoTwelve from '../assets/SVGs/list/electron_dittoTwelve.svg';
import electronDittoFifteen from '../assets/SVGs/list/electron_dittoFifteen.svg';
import electronDittoSixteen from '../assets/SVGs/list/electron_dittoSixteen.svg';
import electronDittoSeventeen from '../assets/SVGs/list/electron_dittoSeventeen.svg';
import electronDittoEighteen from '../assets/SVGs/list/electron_dittoEighteen.svg';
import electronDittoNineteen from '../assets/SVGs/list/electron_dittoNineteen.svg';




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
        <img 
          src={electronEightToFifteen} 
          alt="Electron 26" 
          className={styles['electron_eightToFifteen']} 
        />   
        <img 
          src={electronEightToNineteen} 
          alt="Electron 27" 
          className={styles['electron_eightToNineteen']} 
        />   
        <img 
          src={electronTenToFifteen} 
          alt="Electron 28" 
          className={styles['electron_tenToFifteen']} 
        />   
        <img 
          src={electronTenToNineteen} 
          alt="Electron 29" 
          className={styles['electron_tenToNineteen']} 
        />    
        <img 
          src={electronEightToTen} 
          alt="Electron 30" 
          className={styles['electron_eightToTen']} 
        />    
        <img 
          src={electronTenToTwelve} 
          alt="Electron 31" 
          className={styles['electron_tenToTwelve']} 
        />    
        <img 
          src={electronThirteenToFifteen} 
          alt="Electron 32" 
          className={styles['electron_thirteenToFifteen']} 
        />   
        <img 
          src={electronFifteenToSixteen} 
          alt="Electron 33" 
          className={styles['electron_fifteenToSixteen']} 
        />   
        <img 
          src={electronSixteenToSeventeen} 
          alt="Electron 34" 
          className={styles['electron_sixteenToSeventeen']} 
        />   
        <img 
          src={electronSeventeenToEighteen} 
          alt="Electron 35" 
          className={styles['electron_seventeenToEighteen']} 
        />   
        <img 
          src={electronSixteenToEighteen} 
          alt="Electron 36" 
          className={styles['electron_sixteenToEighteen']} 
        />   
        <img 
          src={electronEighteenToNineteen} 
          alt="Electron 37" 
          className={styles['electron_eighteenToNineteen']} 
        />   
        <img 
          src={electronNineteenToTwentyOne} 
          alt="Electron 38" 
          className={styles['electron_nineteenToTwentyOne']} 
        />   
        <img 
          src={electronDittoFive} 
          alt="Electron 39" 
          className={styles['electron_dittoFive']} 
        />   
        <img 
          src={electronDittoEight} 
          alt="Electron 40" 
          className={styles['electron_dittoEight']} 
        />   
        <img 
          src={electronDittoTwelve} 
          alt="Electron 41" 
          className={styles['electron_dittoTwelve']} 
        />   
        <img 
          src={electronDittoFifteen} 
          alt="Electron 42" 
          className={styles['electron_dittoFifteen']} 
        />   
        <img 
          src={electronDittoSixteen} 
          alt="Electron 43" 
          className={styles['electron_dittoSixteen']} 
        />   
        <img 
          src={electronDittoSeventeen} 
          alt="Electron 44" 
          className={styles['electron_dittoSeventeen']} 
        />   
        <img 
          src={electronDittoEighteen} 
          alt="Electron 45" 
          className={styles['electron_dittoEighteen']} 
        />   
        <img 
          src={electronDittoNineteen} 
          alt="Electron 46" 
          className={styles['electron_dittoNineteen']} 
        />   
    </div>
  );
};

export default ElectronsDisplay;
