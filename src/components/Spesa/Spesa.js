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
            // refresh pagina => inizializza a vuoto o se selezionata usa la vecchia spesa
            const spesaAperta = contextSpesaAperta.get();

            let vecchiaSpesa = spesaAperta;
            if (!vecchiaSpesa) {
                vecchiaSpesa = {
                    id: -1,
                    name: '',
                    supermercato: ''
                };
            }
            setLocalContext(prevState => ({
                ...prevState,
                idSpesa: vecchiaSpesa.id,
                nomeSpesa: vecchiaSpesa.name,
                nomeSupermercato: vecchiaSpesa.supermercato,
            }));

            // creo N carrelli quanti sono quelli recuperati dal db
            let newIndex = 0;
            let newIndexCarrello = [];
            if (spesaAperta) {
                // carico gli id del db dalla vecchia spesa
                for (let c of spesaAperta.carrelli) {
                    // li carico al contrario in modo da avere in cima gli ultimi carrelli
                    newIndexCarrello = [{
                        index: newIndex,
                        id: c.id
                    }].concat(newIndexCarrello);
                    newIndex++;
                }
                setIndexCarrello(newIndexCarrello);
            }
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
                //newIndex = indexCarrello[0] + 1;
                for (let ic of indexCarrello) {
                    if (ic > newIndex) {
                        newIndex = ic;
                    }
                }
                newIndex++;
            }
            setIndexCarrello([{
                index: newIndex,
                id: -1
            }].concat(indexCarrello));
        },
        update: async (id) => {

        },
        remove: async (idCarrello) => {
            setIndexCarrello(indexCarrello.filter(o => o.index !== idCarrello.index));
        },
        addProdotto: async () => {

        },
        updateProdotto: async () => {

        },
        removeProdotto: async () => {

        },
    };

    useEffect(() => {
        //console.log(indexCarrello);
    },
        // eslint-disable-next-line
        [indexCarrello]
    );


    useEffect(() => {
        /*
            Entro qui dentro se:
                1. seleziono una vecchia spesa
                2. resetto la vecchia spesa selezionata
        */
        (async () => {
            await contextSpesa.refresh();
            if (!contextSpesaAperta.get()) {
                // reset vecchia spesa => svuoto lista carrelli della spesa
                setIndexCarrello([]);
            }
            //await contextCarrello.loadVecchiaSpesa();
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
                    indexCarrello.length > 0 && indexCarrello.map(o =>
                        <Carrello
                            key={o.index}
                            idCarrello={o}
                            context={contextCarrello}
                            contextSpesaAperta={contextSpesaAperta} />)
                }
            </div>
        </>
    );
}