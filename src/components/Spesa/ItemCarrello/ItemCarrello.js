import { useState } from 'react';
import "./ItemCarrello.css";


//export default function Prodotto({ id, onAdd, onChange }) {
export default function ItemCarrello({ id, name, price, onRemove, onChange }) {
    const [r, setR] = useState({ price: price });

    function edit(val) {
        if (val === "") {
            val = 0;
        }
        setR({ price: val });
        onChange(id, val);
    }

    //, display: 'flex'
    return (
        <tr>
            <td className="tdClass">
                {name}
            </td>
            <td className="tdClass">
                <input
                    type="number"
                    className="select-input"
                    step='0.01'
                    value={r.price}
                    onChange={(e) => edit(e.target.value)}
                    style={{ minWidth: "80px", maxWidth: "100px" }}
                />
            </td>
            <td className="tdClass">
                <button className="btn" onClick={() => onRemove(id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-dash-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                    </svg>
                </button>
            </td>
        </tr>
    );

};