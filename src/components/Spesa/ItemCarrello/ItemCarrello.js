import { useState } from 'react';
import "./ItemCarrello.css";


//export default function Prodotto({ id, onAdd, onChange }) {
export default function ItemCarrello({ id, name, price, onRemove, onChange }) {
    const [r, setR] = useState({ price: price });

    function edit(val) {
        setR({ price: val });
        onChange(id, val);
    }

    return (
        <tr>
            <td>{name}</td>
            <td>
                <input type="number" className="select-input" step='0.01' value={r.price} onChange={(e) => edit(e.target.value)} />
            </td>
            <td>
                <button className="btn btn-outline-dark" onClick={() => onRemove(id)}>Remove</button>
            </td>
        </tr>
    );

};