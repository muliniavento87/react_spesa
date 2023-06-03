import { useEffect, useState } from 'react';
import { Api } from '../../Api/Api';
import Carrello from "./Carrello/Carrello";
import "./Spesa.css";


export default function Spesa() {
    const [indexCarrello, setIndexCarrello] = useState([]);
    const [localContext, setLocalContext] = useState({
        idSpesa: -1,
        nomeSpesa: '',
        nomeSupermercato: ''
    });


    function removeSpesa() {
        // cancello tutti i carrelli
        (async () => {
            // eslint-disable-next-line
            const response = await Api.eliminaSpesa(null);
        })();
        // svuoto lista carrelli della spesa
        setIndexCarrello([]);
    }

    // gestione carrello
    const contextCarrello = {
        add: async () => {
            let newIndex = 0;
            if (indexCarrello.length > 0) {
                newIndex = indexCarrello[0] + 1;
            }
            setIndexCarrello([newIndex].concat(indexCarrello));
        },
        update: async (id) => {

        },
        remove: async (id) => {
            setIndexCarrello(indexCarrello.filter(o => o !== id));
        },
        addProdotto: async () => {

        },
        updateProdotto: async () => {

        },
        removeProdotto: async () => {

        },
    };

    useEffect(() => {
    },
        // eslint-disable-next-line
        []
    );


    return (
        <>
            <br />
            <div
                className="p-4"
                id="info_spesa"
                style={{ color: "blue" }}
            >
                <input type="text" placeholder="Supermercato"
                    className={`select-input`}
                    value={localContext.nomeSupermercato}
                    onChange={(e) => setLocalContext(prevState => ({
                        ...prevState,
                        nomeSupermercato: e.target.value
                    }))}
                    style={{ width: '150px' }}
                />
                <input type="text" placeholder="Nome spesa"
                    className={`select-input`}
                    value={localContext.nomeSpesa}
                    onChange={(e) => setLocalContext(prevState => ({
                        ...prevState,
                        nomeSpesa: e.target.value
                    }))}
                    style={{ marginLeft: '10px', width: '120px' }}
                />
                <button className="btn ps-3" onClick={removeSpesa}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="red" className="bi bi-dash-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                    </svg>
                </button>
            </div>
            <div className="p-4 pt-0">
                <button onClick={() => { contextCarrello.add() }}>Nuovo carrello</button>
                {
                    indexCarrello.length > 0 && indexCarrello.map(id => <Carrello key={id} idCarrello={id} context={contextCarrello} />)
                }
            </div>
        </>
    );
}