import Chord from "./Chord";





const Diagram = () => {
    return (
        <div className="diagram">
            <div className="vertical"> 
                <Chord svg="/src/components/SVGs/Dash.svg" className="one" />
                <Chord svg="/src/components/SVGs/Trigram.svg" className="two" />
                <Chord svg="/src/components/SVGs/3vertical.svg" className="three" />
                <Chord svg="/src/components/SVGs/4vertical.svg" className="four" />
                <Chord svg="/src/components/SVGs/5vertical.svg" className="five" />
                <Chord svg="/src/components/SVGs/6vertical.svg" className="six" />
                <Chord svg="/src/components/SVGs/7vertical.svg" className="seven" />
                <Chord svg="/src/components/SVGs/Trigram.svg" className="eight" />
                <Chord svg="/src/components/SVGs/Dash.svg" className="nine" />
            </div>
            <div className="horizontal">
                <Chord svg="/src/components/SVGs/Dash.svg" className="ten" />
                <Chord svg="/src/components/SVGs/TrigramHorizontal.svg" className="eleven" />
                <Chord svg="/src/components/SVGs/3horizontal.svg" className="twelve" />
                <Chord svg="/src/components/SVGs/4horizontal.svg" className="thirteen" />
                <Chord svg="/src/components/SVGs/5horizontal.svg" className="fourteen" />
                <Chord svg="/src/components/SVGs/6horizontal.svg" className="fifteen" />
                <Chord svg="/src/components/SVGs/7horizontal.svg" className="sixteen" />
                <Chord svg="/src/components/SVGs/TrigramHorizontal.svg" className="seventeen" />
                <Chord svg="/src/components/SVGs/Dash.svg" className="eighteen" />
            </div>
            <div className="squared"></div>
           
           
        </div>
    );
};

export default Diagram;