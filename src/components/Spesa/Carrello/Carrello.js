import { useState, useEffect } from 'react';
import Notifica from '../../Toasts/Notifica';
import ItemCarrello from './ItemCarrello/ItemCarrello';
import Prodotto from "./Prodotto/Prodotto";
import "./Carrello.css";


export default function Carrello({ idCarrello, context }) {
    const [localContext, setLocalContext] = useState({
        idCarrello: -1,
        listaProdotti: [],
        valTicket: "",
        totAmount: 0,
        notifica: { show: false, title: "", msg: "" }
    });
    const [fields, setFields] = useState({
        nomeCarrello: ''
    });

    // ---------------
    const chiudiNotifica = () => {
        let newNotifica = localContext.notifica;
        newNotifica.show = false;
        setLocalContext(prevState => ({
            ...prevState,
            notifica: newNotifica
        }));
    }


    useEffect(() => {
        if (localContext.listaProdotti.length === 0) {
            setLocalContext(prevState => ({
                ...prevState,
                totAmount: 0
            }));
        }
    },
        // eslint-disable-next-line
        [localContext.listaProdotti]
    );

    // gestione prodotto
    const contextProdotto = {
        add: async (prodotto, prezzo, quantita) => {
            // Salviamo in "rows" la "newRow" attuale
            let newNotifica = localContext.notifica;
            let newListaProdotti = [];
            for (let i = 0; i < quantita; i++) {
                if (prodotto['id'] === -1) {
                    newNotifica = {
                        show: false,
                        title: "",
                        msg: "Aggiunto nuovo prodotto \"" + prodotto['name'] + "\" al db"
                    };
                }

                newListaProdotti.push({
                    id: localContext.listaProdotti.length + i,
                    idPrd: prodotto['id'],
                    name: prodotto['name'] + ((i > 0) ? (" (" + (i + 1) + ")") : ""),
                    price: prezzo
                });
            }

            newListaProdotti = newListaProdotti.concat(localContext.listaProdotti);
            setLocalContext(prevState => ({
                ...prevState,
                listaProdotti: newListaProdotti,
                totAmount: localContext.totAmount + (prezzo * quantita),
                notifica: newNotifica
            }));
        }
    };

    // gestione item carrello
    const contextItemCarrello = {
        update: async (id, prezzo) => {
            let i = localContext.listaProdotti.findIndex(function (p) {
                return p.id === id;
            });
            let newTotAmount = (parseFloat(localContext.totAmount) - parseFloat(localContext.listaProdotti[i].price)) + parseFloat(prezzo);
            localContext.listaProdotti[i].price = prezzo;

            setLocalContext(prevState => ({
                ...prevState,
                listaProdotti: localContext.listaProdotti,
                totAmount: newTotAmount
            }));
        },
        remove: async (id, prezzo) => {
            let i = localContext.listaProdotti.findIndex(function (p) {
                return p.id === id;
            });
            let newTotAmount = (parseFloat(localContext.totAmount) - parseFloat(localContext.listaProdotti[i].price)) + parseFloat(prezzo);
            localContext.listaProdotti[i].price = prezzo;

            setLocalContext(prevState => ({
                ...prevState,
                listaProdotti: localContext.listaProdotti,
                totAmount: newTotAmount
            }));
        },
    };

    return (
        <>
            {
                <Notifica
                    show={localContext.notifica.show}
                    title={localContext.notifica.title}
                    msg={localContext.notifica.msg}
                    disable={chiudiNotifica}
                />
            }
            <br /><br />

            <div style={{ color: "blue" }}>
                <input type="text" placeholder="Nome carrello"
                    className={`select-input`}
                    value={fields.nomeCarrello}
                    onChange={(e) => setFields(prevState => ({
                        ...prevState,
                        nomeCarrello: e.target.value
                    }))}
                    style={{ marginRight: '10px', width: '150px' }}
                />
                <input
                    type="number"
                    step='0.01'
                    placeholder="Valore ticket"
                    className="select-input"
                    value={localContext.valTicket}
                    onChange={(e) => setLocalContext(prevState => ({
                        ...prevState, valTicket: e.target.value
                    }))}
                    style={{ width: "120px" }}
                />
                {
                    //Carrello {idCarrello + 1}
                }
                <button className="btn ps-3" onClick={() => { context.remove(idCarrello) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="blue" className="bi bi-dash-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                    </svg>
                </button>
            </div>
            {"Totale carrello: " + localContext.totAmount.toFixed(2)}
            {
                (localContext.valTicket !== 0 && localContext.valTicket === "") ? "" :
                    "  (" + parseInt(localContext.totAmount / localContext.valTicket) + " ticket e " + (localContext.totAmount % localContext.valTicket).toFixed(2) + " cash)"
            }
            <br />
            {<Prodotto context={contextProdotto} />}
            <table
                className="table table-striped table-hover"
                style={{ minWidth: "350px", maxWidth: "600px" }}
            >
                <thead>
                    <tr>
                        <th className="tdClass">Prodotto</th>
                        <th className="tdClass">Prezzo</th>
                        <th className="tdClass">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        localContext.listaProdotti.map((p) => (
                            <ItemCarrello
                                key={p.id}
                                id={p.id}
                                name={p.name}
                                price={p.price}
                                context={contextItemCarrello}
                            />
                        ))
                    }
                </tbody>
            </table>
            <br />
        </>
    );
}