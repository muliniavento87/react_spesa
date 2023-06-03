import { useState } from 'react';
import SpesaAperta from "./components/SpesaAperta/SpesaAperta";
import Spesa from "./components/Spesa/Spesa";

function App() {

    const [vecchiaSpesa, setVecchiaSpesa] = useState(null);

    // gestione spesa
    const contextSpesaAperta = {
        get: () => {
            if (!vecchiaSpesa) {
                return null;
            }
            return vecchiaSpesa;
        },
        getId: () => {
            if (!vecchiaSpesa) {
                return -1;
            }
            return vecchiaSpesa.id;
        },
        reset: () => {
            setVecchiaSpesa(null);
        },
        load: async (spesa) => {
            setVecchiaSpesa(spesa);
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