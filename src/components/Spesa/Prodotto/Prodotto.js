import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./Prodotto.css";
import { va } from "../../../settings/var_ambiente.js";


//export default function Prodotto({ id, onAdd, onChange }) {
export default function Prodotto({ onAdd }) {
    const [product, setProduct] = useState({ id: -1, name: "" });
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    // riferimento all'oggetto selezione multipla prodotto
    // (serve per capire quando ci clicchiamo sopra o no)
    const multiSelectProductRef = useRef(null);

    function productOk() {
        if (product.name.trim() !== "") {
            return true;
        }
        return false;
    }
    function priceOk() {
        if (price !== 0 && price !== "") {
            return true;
        }
        return false;
    }
    function quantityOk() {
        if (quantity !== 0 && quantity !== "") {
            return true;
        }
        return false;
    }

    function onAddR() {
        if (productOk() && priceOk() && quantityOk()) {
            onAdd(product, parseFloat(price), parseInt(quantity));
            // salvo sul db il prodotto
            (async () => {
                const params = `?name=${product.name.toLowerCase()}&id=${product.id}`;
                const url = `${va.URL}/api/app_spesa/prodotto/save_prodotto/${params}`;
                await axios.get(url);
            })();
            setProduct({ id: -1, name: "" });
            setPrice("");
            setQuantity(1);
        }
    }

    const handleClickOutside = (event) => {
        if (multiSelectProductRef.current && !multiSelectProductRef.current.contains(event.target)) {
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
        setProduct({ id: p.id, name: p.name });
        setShowOptions(false);
    };

    useEffect(() => {
        // ricerca ONLINE (api REST) [http://localhost:8001/api/app_test_00/test?name=]
        (async () => {
            const url = `${va.URL}/api/app_spesa/prodotto/get_prodotti/?name=${product.name.toLowerCase()}`;
            const response = await axios.get(url);

            setFilteredOptions(
                response.data.filter((option) =>
                    option.name.toLowerCase().includes(product.name.toLowerCase())
                ).map(function (o) { return { 'id': o.id, 'name': o.name } })
            );
        })();
    },
        // eslint-disable-next-line
        [product]);

    useEffect(() => {
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


    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <div className="interface-cnt cnt-prodotto" ref={multiSelectProductRef}>
                            <input
                                type="text"
                                className={`select-input ${productOk() ? "found" : "notfound"}`}
                                placeholder="Prodotto"
                                value={product.name}
                                onChange={(e) => hIChange(e.target.value)}
                                onFocus={(e) => hIFocus(e.target.value)}
                            />
                            {showOptions && (
                                <div className="select-menu">
                                    {filteredOptions.map((option, index) => (
                                        <div key={option.id}
                                            className={`select-option ${option.id === product.id ? "selected" : ""}`}
                                            onClick={(e) => { hOClick(option) }}
                                        >{option.name}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                        <div className="interface-cnt cnt-quantita">
                            <input type="number" step='0' placeholder="Q.tà"
                                className={`select-input ${quantityOk() ? "found" : "notfound"}`}
                                value={quantity} onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <div className="interface-cnt cnt-prezzo">
                            <input type="number" step='0.01' placeholder="Prezzo"
                                className={`select-input ${priceOk() ? "found" : "notfound"}`}
                                value={price} onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </td>
                    <td className='td-button-add'>
                        <div className="interface-cnt cnt-button-add">
                            <button className="btn" onClick={() => onAddR()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}