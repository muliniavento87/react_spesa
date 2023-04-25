import { useState, useEffect, useRef } from 'react';
import NTRow from "./NTRow";
import TRow from "./TRow";

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

export default function Chart() {
    const [rows, setRows] = useState([]);
    const [newRow, setNewRow] = useState({ id: 0, name: 'Row ' + 0, value: "" });
    const lastNewRow = useRef();


    useEffect(() => {
        // calcolo prossimo id
        let ind = 0;
        if (rows.length > 0) {
            rows.sort((a, b) => b['id'] - a['id']);
            ind = rows[0]['id'] + 1;
        }

        if (lastNewRow.lenRows > rows.length) {
            // Rimosso 1 record => resetto il "newRow" (id, etichetta, etc. che
            // vengono ricalcolati). Manteniamo il valore digitato dall'utente
            // perchè non ha senso resettarlo
            setNewRow({ id: ind, name: 'Row ' + ind, value: lastNewRow.value });
        } else {
            // Nuovo record aggiunto alla lista
            setNewRow({ id: ind, name: 'Row ' + ind, value: "" });
        }
        lastNewRow.lenRows = rows.length;
    }, [rows]);



    // ---------------
    const NTRow_add = (r) => {
        // Salviamo in "rows" la "newRow" attuale
        setRows([r].concat(rows));
    };
    // ---------------
    const NTRow_changePrev = (o) => {
        // quando rimuoviamo un record da "rows" vogliamo
        // che l'eventuale contenuto di "newRow" non si
        // resetti. Per fare ciò dobbiamo tenere un backup
        // di ciò che sta contenendo al momento
        lastNewRow.value = o.value;
    };

    // ---------------
    const TRow_remove = (id) => {
        setRows(rows.filter((row) => row.id !== id));
    };


    // ----------------------------------------------------
    return (
        <>
            <table>
                <tbody>
                    {(<NTRow
                        key={newRow.id}
                        id={newRow.id}
                        name={newRow.name}
                        value={newRow.value}
                        onAdd={NTRow_add}
                        onChange={NTRow_changePrev}
                    />)}
                </tbody>
            </table>
            <br /><br />
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <TRow
                            key={row.id}
                            id={row.id}
                            name={row.name}
                            value={row.value}
                            onRemove={() => TRow_remove(row.id)}
                        />
                    ))}
                </tbody>
            </table>
            <br />
            <button onClick={() => console.log(rows)}>Print</button>
        </>
    );

};