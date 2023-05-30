import { useState, useEffect } from 'react';
import Notifica from '../Toasts/Notifica';
import ItemCarrello from './ItemCarrello/ItemCarrello';
import Prodotto from "./Prodotto/Prodotto";
import "./Spesa.css";

/*
                            **** DA AGGIORNARE ****
    APPUNTI:
        - push in testa
            rows.unshift({ id: i, name: 'Row ' + i, value: 0 });
        - cambia solo 1 attributo nel "setState"
            setState(prevState => ({ ...prevState, [key]: value }))
        - dichiarazione ed esportazione inline di un nuovo componente
            export default function NewComponent() {}
        - init valori con "useEffect" (eseguito solo una volta, quando il componente viene montato)
            - passa un array vuoto [] come dipendenza
        - "useEffect" al suo interno mostra SEMPRE il valore aggiornato della sua dipendenza
            - un "setState" di una variabile (es. "v") non setta istantaneamente il valore di
                "v" che rimarrà il precedente. Per essere sicuri di avere il valore di "v"
                aggiornato devi SEMPRE leggerlo dentro il suo "useEffect":
                    useEffect(() => {console.log(v)}, [v]);
        - "setState" (setRows) ha in "prevRows" il vecchio valore che modifichiamo e settiamo con "setRows"
            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.id === id ? { ...row, value: value } : row
                )
            );
*/
export default function Spesa({ idSpesa, delSpesa }) {
    const [localContext, setLocalContext] = useState({
        listaProdotti: [],
        valTicket: "",
        totAmount: 0,
        notifica: { show: false, title: "", msg: "" }
    });

    // ---------------
    const addProdottoAlCarrello = (prodotto, prezzo, quantita) => {
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
                name: prodotto['name'] + (" (" + (i + 1) + ")"),
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
    };
    // ---------------
    const remProdottoDalCarrello = (id) => {
        let prod = localContext.listaProdotti.filter((p) => p.id === id)[0];
        setLocalContext(prevState => ({
            ...prevState,
            listaProdotti: localContext.listaProdotti.filter((p) => p.id !== id),
            totAmount: localContext.totAmount - prod.price
        }));
    };
    // ---------------
    const editPrezzoProdottoDelCarrello = (id, prezzo) => {
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
    };
    // ---------------
    const chiudiNotifica = () => {
        //console.log("chiusa notifica");
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

    function removeSpesa() {
        delSpesa(idSpesa);
    }

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
                Spesa {idSpesa + 1}
                <button className="btn ps-4" onClick={removeSpesa}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="blue" className="bi bi-dash-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                    </svg>
                </button>
            </div>

            <br />
            <table>
                <tbody>
                    <tr>
                        <td>
                            <input
                                type="number"
                                step='0.01'
                                placeholder="Valore ticket"
                                className="select-input"
                                value={localContext.valTicket}
                                onChange={(e) => setLocalContext(prevState => ({
                                    ...prevState, valTicket: e.target.value
                                }))}
                                style={{ minWidth: "120px", maxWidth: "130px" }}
                            />
                        </td>

                    </tr>
                </tbody>
            </table>
            <br />
            {"Totale carrello: " + localContext.totAmount.toFixed(2)}
            {
                (localContext.valTicket !== 0 && localContext.valTicket === "") ? "" :
                    "  (" + parseInt(localContext.totAmount / localContext.valTicket) + " ticket e " + (localContext.totAmount % localContext.valTicket).toFixed(2) + " cash)"
            }
            <br />
            {<Prodotto onAdd={addProdottoAlCarrello} />}
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
                                onChange={editPrezzoProdottoDelCarrello}
                                onRemove={remProdottoDalCarrello}
                            />
                        ))
                    }
                </tbody>
            </table>
            <br />
        </>
    );
    // <button className="btn btn-outline-dark" onClick={() => { console.log(listaProdotti); console.log("Inserimenti: " + count); }}>Print</button>
}