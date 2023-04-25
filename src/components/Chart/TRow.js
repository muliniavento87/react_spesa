import { useState } from 'react';


// ----------------------------------------------------
export default function TRow({ id, name, value, onRemove }) {
    const [r, setR] = useState({ id: id, name: name, value: value });

    // <input type="text" /*type="number" step='0.01'*/ value={r.value} onChange={(e) => setR({ id: id, name: name, value: e.target.value })}
    return (
        <tr>
            <td>{name}</td>
            <td>
                <input type="number" step='0.01' value={r.value} onChange={(e) => setR({ id: id, name: name, value: e.target.value })} />
            </td>
            <td>
                <button onClick={() => onRemove(r.id)}>Remove</button>
            </td>
        </tr>
    );
}