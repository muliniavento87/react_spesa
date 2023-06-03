import { useEffect, useState } from 'react';
import { Api } from '../../Api/Api';
import Carrello from "./Carrello/Carrello";
import "./Spesa.css";


export default function Spesa({ contextSpesaAperta }) {
    const [indexCarrello, setIndexCarrello] = useState([]);
    const [localContext, setLocalContext] = useState({
        nomeSpesa: '',
        nomeSupermercato: ''
    });
    /*
    const [fields, setFields] = useState({
        nomeSpesa: '',
        nomeSupermercato: ''
    });
    */

    function removeSpesa() {
        // cancello tutti i carrelli
        (async () => {
            // eslint-disable-next-line
            const response = await Api.eliminaSpesa(null);
        })();
        // svuoto lista carrelli della spesa
        setIndexCarrello([]);
    }

    // gestione spesa
    const contextSpesa = {
        refresh: async () => {
            let spesaAttuale = contextSpesaAperta.get();

            console.log(spesaAttuale);
            if (!spesaAttuale) {
                spesaAttuale = {
                    id: -1,
                    name: '',
                    supermercato: ''
                };
            }
            setLocalContext(prevState => ({
                ...prevState,
                idSpesa: spesaAttuale.id,
                nomeSpesa: spesaAttuale.name,
                nomeSupermercato: spesaAttuale.supermercato,
            }));
        },
        setNomeSupermercato: (e) => {
            setLocalContext(prevState => ({
                ...prevState,
                nomeSupermercato: e.target.value
            }))
        },
        setNomeSpesa: (e) => {
            setLocalContext(prevState => ({
                ...prevState,
                nomeSpesa: e.target.value
            }))
        },
    };

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
        (async () => {
            await contextSpesa.refresh();
        })();

    },
        // eslint-disable-next-line
        [contextSpesaAperta.get()]
    );


    return (
        <>
            <br />
            <div>
                <input type="text" placeholder="Supermercato"
                    className={`select-input`}
                    value={localContext.nomeSupermercato}
                    onChange={(e) => contextSpesa.setNomeSupermercato(e)}
                    style={{ width: '150px' }}
                />
                <input type="text" placeholder="Nome spesa"
                    className={`select-input`}
                    value={localContext.nomeSpesa}
                    onChange={(e) => contextSpesa.setLocalContext(prevState => ({
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
            <div className="pt-3">
                <button onClick={() => { contextCarrello.add() }}>Nuovo carrello</button>
                {
                    indexCarrello.length > 0 && indexCarrello.map(id => <Carrello key={id} idCarrello={id} context={contextCarrello} />)
                }
            </div>
        </>
    );
}