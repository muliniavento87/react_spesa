import { useState, useEffect, useRef } from 'react';
import SpesaAperta from "./components/SpesaAperta/SpesaAperta";
import Spesa from "./components/Spesa/Spesa";

function App() {

    const [vecchiaSpesa, setVecchiaSpesa] = useState(null);

    // gestione spesa
    const contextSpesaAperta = {
        get: () => {
            if (!vecchiaSpesa) {
                return -1;
            }
            return -1;
        },
        reset: () => {
            setVecchiaSpesa(null);
        },
        load: async (vecchiaSpesa) => {
            setVecchiaSpesa(vecchiaSpesa);
        },
    };

    return (
        <>
            <div className="p-4" >
                <SpesaAperta context={contextSpesaAperta} />
                <Spesa contextSpesaAperta={contextSpesaAperta} />
            </div>
        </>
    );
}

export default App;