import Chord from "./Chord";
import Dash from '../assets/SVGs/Dash.svg';
import Trigram from '../assets/SVGs/Trigram.svg';
import TrigramHorizontal from '../assets/SVGs/TrigramHorizontal.svg';
import ThreeVertical from '../assets/SVGs/3vertical.svg';
import FourVertical from '../assets/SVGs/4vertical.svg';
import FiveVertical from '../assets/SVGs/5vertical.svg';
import SixVertical from '../assets/SVGs/6vertical.svg';
import SevenVertical from '../assets/SVGs/7vertical.svg';
import EightVertical from '../assets/SVGs/8vertical.svg';
import NineVertical from '../assets/SVGs/9vertical.svg';
import TenVertical from '../assets/SVGs/10vertical.svg';
import ThreeHorizontal from '../assets/SVGs/3horizontal.svg';
import FourHorizontal from '../assets/SVGs/4horizontal.svg';

import SixHorizontal from '../assets/SVGs/6horizontal.svg';
import SevenHorizontal from '../assets/SVGs/7horizontal.svg';


const Diagram = ({ handleChordSelect, selectedChords, possibleChords = [] }) => {
    return (
        <div className="diagram">
            <div className="vertical"> 
                <Chord svg={Dash} className="one" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={Trigram} className="two" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={ThreeVertical} className="three" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={FourVertical} className="four" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={FiveVertical} className="five" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
               
                <div className="six-spacer" style={{ width: '30px', height: '30px', display: 'block' }}></div>
                <Chord svg={SevenVertical} className="seven" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={EightVertical} className="eight" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={NineVertical} className="nine" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={TenVertical} className="ten" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={Trigram} className="eleven" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={Dash} className="twelve" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
            </div>
            <div className="horizontal">
                <Chord svg={Dash} className="thirteen" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={TrigramHorizontal} className="fourteen" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={ThreeHorizontal} className="fifteen" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={FourHorizontal} className="sixteen" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={SixVertical} className="seventeen" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={SixHorizontal} className="eighteen" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={SevenHorizontal} className="nineteen" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={TrigramHorizontal} className="twenty" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
                <Chord svg={Dash} className="twentyOne" handleChordSelect={handleChordSelect} selectedChords={selectedChords} possibleChords={possibleChords}/>
            </div>
            <div className="squared"></div>
           
           
        </div>
    );
};

export default Diagram;