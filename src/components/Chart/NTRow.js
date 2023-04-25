import { useState } from 'react';


// ----------------------------------------------------
export default function NTRow({ id, name, value, onAdd, onChange }) {
    const [r, setR] = useState({ id: id, name: name, value: value });

    function onChangeR(v) {
        setR({ id: r.id, name: r.name, value: v })
        onChange({ id: r.id, name: r.name, value: v });
    }

    function onAddR() {
        let rNow = { id: r.id, name: r.name, value: "" };
        setR(rNow)
        onChange(rNow);
        let rToAdd = { id: r.id, name: r.name, value: r.value };
        onAdd(rToAdd)
    }

    return (
        <tr>
            <td>{name}</td>
            <td>
                <input type="text" value={r.value} onChange={(e) => onChangeR(e.target.value)} />
            </td>
            <td>
                <button onClick={() => onAddR()}>Add</button>
            </td>
        </tr>
    );
}