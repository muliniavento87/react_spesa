import { useState, useEffect } from 'react';
import Notifica from '../Toasts/Notifica';
import ItemCarrello from './ItemCarrello/ItemCarrello';
import Prodotto from "./Prodotto/Prodotto";

/*
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
export default function Spesa() {
    const [listaProdotti, setListaProdotti] = useState([]);
    const [count, setCount] = useState(0);
    const [valTicket, setValTicket] = useState("");
    const [totAmount, setTotAmount] = useState(0);
    const [notifica, setNotifica] = useState({ count: -1, title: "", msg: "" });

    // ---------------
    const addProdottoAlCarrello = (prodotto, prezzo) => {
        // Salviamo in "rows" la "newRow" attuale
        console.log("Aggiunto prodotto: " + prodotto['name'] + " al prezzo " + prezzo);
        setListaProdotti([{ id: count, idPrd: prodotto['id'], name: prodotto['name'], price: prezzo }].concat(listaProdotti));
        setCount(count + 1);
        setTotAmount(totAmount + prezzo);
        if (prodotto['id'] === -1) {
            setNotifica({ count: notifica.count + 1, title: "", msg: "Aggiunto nuovo prodotto \"" + prodotto['name'] + "\" al db" });
        }

    };
    // ---------------
    const remProdottoDalCarrello = (id) => {
        let prod = listaProdotti.filter((p) => p.id === id)[0];
        setTotAmount(totAmount - prod.price);
        setListaProdotti(listaProdotti.filter((p) => p.id !== id));
        //setNotifica({ count: notifica.count + 1, title: "", msg: "Rimosso " + prod['name'] });
    };
    // ---------------
    const editPrezzoProdottoDelCarrello = (id, prezzo) => {
        let i = listaProdotti.findIndex(function (p) {
            return p.id === id;
        });
        setTotAmount((parseFloat(totAmount) - parseFloat(listaProdotti[i].price)) + parseFloat(prezzo));
        listaProdotti[i].price = prezzo;
        setListaProdotti(listaProdotti);
    };
    // ---------------
    const chiudiNotifica = () => {
        console.log("chiusa notifica");
        setNotifica(prevState => ({ ...prevState, "count": -1 }))
    }


    useEffect(() => {
        if (listaProdotti.length === 0) {
            setTotAmount(0);
        }
    }, [listaProdotti]);

    return (
        <>
            {(<Notifica show={(notifica.count >= 0) ? true : false} title={notifica.title} msg={notifica.msg} disable={chiudiNotifica}></Notifica>)}
            <br />
            <table>
                <tbody>
                    <tr>
                        <td>
                            <input type="number" step='0.01' placeholder="Valore ticket" className="input-price" value={valTicket} onChange={(e) => setValTicket(e.target.value)} />
                        </td>

                    </tr>
                </tbody>
            </table>
            <br />
            {"Totale carrello: " + totAmount.toFixed(2)} {(valTicket !== 0 && valTicket !== "") ? "  (" + parseInt(totAmount / valTicket) + " ticket e " + (totAmount % valTicket).toFixed(2) + " cash)" : ""}
            <br /><br />
            <table>
                <tbody>
                    {(<Prodotto onAdd={addProdottoAlCarrello}
                    />)}
                </tbody>
            </table>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listaProdotti.map((p) => (
                        <ItemCarrello
                            key={p.id}
                            id={p.id}
                            name={p.name}
                            price={p.price}
                            onChange={editPrezzoProdottoDelCarrello}
                            onRemove={remProdottoDalCarrello}
                        />
                    ))}
                </tbody>
            </table>
            <br />
            <button className="btn btn-outline-dark" onClick={() => { console.log(listaProdotti); console.log("Inserimenti: " + count); }}>Print</button>
        </>
    );
}