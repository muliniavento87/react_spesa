import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./Prodotto.css";


//export default function Prodotto({ id, onAdd, onChange }) {
export default function Prodotto() {
    const [product, setProduct] = useState({ id: -1, name: "" });
    const [price, setPrice] = useState(0);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const wrapperRef = useRef(null);


    function onAddR() { }

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };

    const hIChange = (prodName) => {
        setProduct({ id: -1, name: prodName });
        setShowOptions(true);
        // NASCONDI risultati se stringa vuota:
        //  - per annullare il NASCONDI => rimuovere il blocco if sotto
        if (!prodName || prodName === '') {
            setShowOptions(false);
        }
    };

    const hIFocus = (prodName) => {
        setShowOptions(true);
        // NASCONDI risultati se stringa vuota:
        //  - per annullare il NASCONDI => rimuovere il blocco if sotto
        if (!prodName || prodName === '') {
            setShowOptions(false);
        }
    };

    const hOClick = (p) => {
        setProduct(p);
        setShowOptions(false);
    };


    async function getOnline(prodName) {
        const response = await axios.get(`http://localhost:8001/api/app_test_00/test/?name=${prodName.toLowerCase()}`);

        setFilteredOptions(
            response.data.filter((option) =>
                option.name.toLowerCase().includes(prodName.toLowerCase())
            ).map(function (o) { return { 'id': o.id, 'name': o.name } })
        );
    }

    useEffect(() => {
        // ricerca ONLINE (api REST) [http://localhost:8001/api/app_test_00/test?name=]
        getOnline(product.name);
    }, [product]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <tr>
            <td className="pe-3">{"ID: " + product.id}</td>
            <td className="pe-3">
                <div className="select-container" ref={wrapperRef}>
                    <input
                        type="text"
                        className="select-input"
                        placeholder="Inserisci prodotto"
                        value={product.name}
                        onChange={(e) => hIChange(e.target.value)}
                        onFocus={(e) => hIFocus(e.target.value)}
                    />
                    {showOptions && (
                        <div className="select-menu">
                            {filteredOptions.map((option, index) => (
                                <div key={option.id} className={`select-option ${option.id === product.id ? "selected" : ""}`} onClick={() => hOClick(option)} >
                                    {option.name}{" (" + option.id + ")"}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </td>
            <td className="pe-3">
                <input type="number" step='0.01' placeholder="Prezzo" className="input-price" value={price} onChange={(e) => setPrice(e.target.value)} />
            </td>
            <td>
                <button onClick={() => onAddR()}>Add</button>
            </td>
        </tr>
    );
}