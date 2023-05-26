import { useEffect, useState } from 'react';
import Spesa from "./components/Spesa/Spesa";

function App() {
    const [indexSpesa, setIndexSpesa] = useState([]);

    const addSpesa = () => {
        let newIndex = 0;
        if (indexSpesa.length > 0) {
            newIndex = indexSpesa[0] + 1;
        }
        setIndexSpesa([newIndex].concat(indexSpesa));
    };

    const delSpesa = (idSpesa) => {
        setIndexSpesa(indexSpesa.filter(o => o !== idSpesa));
    };


    useEffect(() => {
        addSpesa();
    },
        // eslint-disable-next-line
        []
    );

    return (
        <>
            <div className="p-4" id="schermata">
                <button onClick={addSpesa}>Nuova spesa</button>
                <br />
                {
                    indexSpesa.length > 0 && indexSpesa.map(id => <Spesa key={id} idSpesa={id} delSpesa={delSpesa} />)
                }
            </div>
        </>
    );
}

export default App;