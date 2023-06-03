import { useState, useEffect, useRef } from 'react';
import { Api } from '../../../../Api/Api';
import './Prodotto.css';


export default function Prodotto({ context }) {
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
            (async () => {
                await context.add(product, parseFloat(price), parseInt(quantity));
                // eslint-disable-next-line
                const response = await Api.salvaProdotto(product);
                setProduct({ id: -1, name: "" });
                setPrice("");
                setQuantity(1);
            })();
            /*
            onAdd(product, parseFloat(price), parseInt(quantity));
            // salvo sul db il prodotto
            (async () => {
                // eslint-disable-next-line
                const response = await Api.salvaProdotto(product);
            })();
            setProduct({ id: -1, name: "" });
            setPrice("");
            setQuantity(1);
            */
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
        // ricerca ONLINE (api REST)
        (async () => {
            const response = await Api.ricercaProdotto(product);

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
                        <div className="interface-cnt cnt-prezzo">
                            <input type="number" step='0.01' placeholder="Prezzo"
                                className={`select-input ${priceOk() ? "found" : "notfound"}`}
                                value={price} onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="interface-cnt cnt-quantita">
                            <input type="number" step='0' placeholder="Q.tà"
                                className={`select-input ${quantityOk() ? "found" : "notfound"}`}
                                value={quantity} onChange={(e) => setQuantity(e.target.value)}
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