import { useState, useEffect, useRef } from 'react';
import { Api } from '../../Api/Api';
import './SpesaAperta.css';


export default function SpesaAperta({ context }) {
    const [product, setProduct] = useState({ id: -1, name: "" });
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    // riferimento all'oggetto selezione multipla prodotto
    // (serve per capire quando ci clicchiamo sopra o no)
    const multiSelectSpesaRef = useRef(null);

    function productOk() {
        if (product.name.trim() !== "") {
            return true;
        }
        return false;
    }

    function onAddR() {
        if (productOk()) {
            (async () => {
                await context.add(product, parseFloat(price), parseInt(quantity));
                // eslint-disable-next-line
                //const response = await Api.salvaProdotto(product);
                setProduct({ id: -1, name: "" });
                setPrice("");
                setQuantity(1);
            })();
        }
    }

    const handleClickOutside = (event) => {
        if (multiSelectSpesaRef.current && !multiSelectSpesaRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };

    const hIChange = (value) => {
        /*
        // NASCONDI risultati se stringa vuota:
        //  - per annullare il NASCONDI => rimuovere il blocco if sotto
        if (!prodName || prodName === '') {
            setShowOptions(false);
        }
        */
        (async () => {
            await Api.listaSpeseAperte(value);
            setProduct({ id: -1, name: value });
            setShowOptions(true);
        })();
    };

    const hIFocus = (value) => {
        /*
        // NASCONDI risultati se stringa vuota:
        //  - per annullare il NASCONDI => rimuovere il blocco if sotto
        if (!prodName || prodName === '') {
            setShowOptions(false);
        }
        */
        (async () => {
            await Api.listaSpeseAperte(value);
            setShowOptions(true);
        })();
    };

    const hOClick = (spesaVecchia) => {
        //setProduct({ id: p.id, name: p.name });
        setShowOptions(false);
        console.log(spesaVecchia);
        (async () => {
            const response = await Api.getSpesaAperta(spesaVecchia.id);
            console.log(response);
            setShowOptions(true);
        })();
    };


    const getListSpeseAperte = async (searchValue = '') => {
        const response = await Api.listaSpeseAperte(searchValue.toLowerCase());
        console.log(response);

        setFilteredOptions(
            response.data.filter((option) =>
                option.name.toLowerCase().includes(searchValue.toLowerCase())
            ).map(function (o) {
                const label = '(' + o.id + ') ' + o.name + ' [' + o.date_update + ']';
                return {
                    'id': o.id,
                    //'name': o.name
                    'name': label
                };
            })
        );
    }


    useEffect(() => {
        // ricerca ONLINE (api REST)
        getListSpeseAperte(product.name);
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
                        <div className="interface-cnt cnt-spesa" ref={multiSelectSpesaRef}>
                            <input
                                type="text"
                                className={`select-input-spesa ${productOk() ? "found" : "notfound"}`}
                                placeholder="Vecchia spesa"
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
                    </td>
                    <td className='ps-4 td-button-add'>
                        <div className="interface-cnt cnt-button-add">
                            <button onClick={() => onAddR()}>
                                Reset spesa
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}