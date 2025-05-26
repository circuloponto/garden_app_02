import Chord from "./Chord";
import Dash from './src/assets/SVGs/Dash.svg';
import Trigram from './src/assets/SVGs/Trigram.svg';
import TrigramHorizontal from './src/assets/SVGs/TrigramHorizontal.svg';
import ThreeVertical from './src/assets/SVGs/3vertical.svg';
import FourVertical from './src/assets/SVGs/4vertical.svg';
import FiveVertical from './src/assets/SVGs/5vertical.svg';
import SixVertical from './src/assets/SVGs/6vertical.svg';
import SevenVertical from './src/assets/SVGs/7vertical.svg';
import ThreeHorizontal from './src/assets/SVGs/3horizontal.svg';
import FourHorizontal from './src/assets/SVGs/4horizontal.svg';
import FiveHorizontal from './src/assets/SVGs/5horizontal.svg';
import SixHorizontal from './src/assets/SVGs/6horizontal.svg';
import SevenHorizontal from './src/assets/SVGs/7horizontal.svg';



const Diagram = () => {
    return (
        <div className="diagram">
            <div className="vertical"> 
                <Chord svg={Dash} className="one" />
                <Chord svg={Trigram} className="two" />
                <Chord svg={ThreeVertical} className="three" />
                <Chord svg={FourVertical} className="four" />
                <Chord svg={FiveVertical} className="five" />
                <Chord svg={SixVertical} className="six" />
                <Chord svg={SevenVertical} className="seven" />
                <Chord svg={Trigram} className="eight" />
                <Chord svg={Dash} className="nine" />
            </div>
            <div className="horizontal">
                <Chord svg={Dash} className="ten" />
                <Chord svg={TrigramHorizontal} className="eleven" />
                <Chord svg={ThreeHorizontal} className="twelve" />
                <Chord svg={FourHorizontal} className="thirteen" />
                <Chord svg={FiveHorizontal} className="fourteen" />
                <Chord svg={SixHorizontal} className="fifteen" />
                <Chord svg={SevenHorizontal} className="sixteen" />
                <Chord svg={TrigramHorizontal} className="seventeen" />
                <Chord svg={Dash} className="eighteen" />
            </div>
            <div className="squared"></div>
           
           
        </div>
    );
};

export default Diagram;