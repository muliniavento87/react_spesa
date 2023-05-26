import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./Prodotto.css";


//export default function Prodotto({ id, onAdd, onChange }) {
export default function Prodotto({ onAdd }) {
    const [product, setProduct] = useState({ id: -1, name: "" });
    const [price, setPrice] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const wrapperRef = useRef(null);

    function priceOk() {
        if (price !== 0 && price !== "") {
            return true;
        }
        return false;
    }

    function productOk() {
        if (product.name.trim() !== "") {
            return true;
        }
        return false;
    }

    function onAddR() {
        if (productOk() && priceOk()) {
            onAdd(product, parseFloat(price));
            setProduct({ id: -1, name: "" });
            setPrice("");
        }
    }

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
        //console.log(filteredOptions);
        if (filteredOptions.length === 1 && product.id === -1) {
            if (filteredOptions[0].name.toLowerCase() === product.name.toLowerCase()) {
                setProduct(filteredOptions[0]);
                setFilteredOptions([]);
                setShowOptions(false);
            }
        }
    }, [filteredOptions, product]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // <td className="pe-3">{"ID: " + product.id}</td>
    return (
        <tr>
            <td className="pe-3">
                <div className="select-container" ref={wrapperRef}>
                    <input
                        type="text"
                        className={`select-input ${product.id === -1 ? "notfound" : "found"}`} //"select-input"
                        placeholder="Inserisci prodotto"
                        value={product.name}
                        onChange={(e) => hIChange(e.target.value)}
                        onFocus={(e) => hIFocus(e.target.value)}
                        style={{ minWidth: "150px", maxWidth: "170px" }}
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
                <input type="number" step='0.01' placeholder="Prezzo"
                    className={`select-input ${priceOk() ? "found" : "notfound"}`} //className="input-price"
                    value={price} onChange={(e) => setPrice(e.target.value)}
                    style={{ minWidth: "80px", maxWidth: "100px" }}
                />
            </td>
            <td>
                <button className="btn" onClick={() => onAddR()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                </button>
            </td>
        </tr>
    );
}