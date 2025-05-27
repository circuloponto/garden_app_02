import React from 'react'



const Connections = ({ viewMode, selectedChords }) => {
  // Show all connections if 'connections' view
  // Show none if 'fruits' view and less than two chords selected
  // (For now, when two chords are selected, still show all as a base)
 //onst showConnections =
   //iewMode === 'connections' || (viewMode === 'fruits' && selectedChords.length === 2);
// If you want to log viewMode changes, use useEffect below:
// useEffect(() => { console.log('viewMode changed:', viewMode); }, [viewMode]);
  if (viewMode === 'fruits') return null;

  return (
    <div className='allConnections'>
      <div className="threeToThree1"></div>
      <div className="threeToThree2"></div>
      <div className="threeToFive1"></div>
      <div className="threeToFive2"></div>
      <div className="sevenToThree1"></div>
      <div className="sevenToThree2"></div>
      <div className="sevenToFive1"></div>
      <div className="sevenToFive2"></div>
      <div className="fourToFive1"></div>
      <div className="sixToFive1"></div>
      <div className="sixToFour1"></div>
      <div className="sixToFour2"></div>
      <div className="threeToTen1"></div>
      <div className="threeToTen2"></div>
      <div className="threeToEight1"></div>
      <div className="threeToEight2"></div>
      <div className="sevenToTen1"></div>
      <div className="sevenToTen2"></div>
      <div className="sevenToEight1"></div>
      <div className="sevenToEight2"></div>
      <div className="fourToSix1"></div>
      <div className="fourToSix2"></div>
      <div className="sixToSix1"></div>
    </div>  

  );
};

export default Connections;