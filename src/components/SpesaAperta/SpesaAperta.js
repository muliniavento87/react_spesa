import { useState, useEffect, useRef } from 'react';
import { Api } from '../../Api/Api';
import './SpesaAperta.css';


export default function SpesaAperta({ context }) {
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [search, setSearch] = useState('');
    const [vecchiaSpesa, setVecchiaSpesa] = useState(null);
    // riferimento all'oggetto selezione multipla prodotto
    // (serve per capire quando ci clicchiamo sopra o no)
    const multiSelectSpesaRef = useRef(null);


    const handleClickOutside = (event) => {
        if (multiSelectSpesaRef.current && !multiSelectSpesaRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };

    const hIChange = (value) => {
        (async () => {
            setSearch(value);
            context.reset();
            setVecchiaSpesa(null);
            setShowOptions(true);
        })();
    };

    const hIFocus = (value) => {
        setShowOptions(true);
    };

    const hOClick = (spesaSelected) => {
        (async () => {
            const response = await getSpesaFull(spesaSelected);
            let newSearch = response.data.name;
            if (!newSearch || newSearch === '') {
                newSearch = response.data.id.toString();
            }
            setVecchiaSpesa(response.data);
            setSearch(newSearch);
        })();
    };


    const getListaSpese = async (searchValue = '') => {
        const response = await Api.listaSpeseAperte(searchValue.toLowerCase());
        setFilteredOptions(
            response.data.filter((option) =>
                option.name.toLowerCase().includes(searchValue.toLowerCase())
            ).map(function (o) {
                const label = '(' + o.id + ') ' + o.name + ' [' + o.date_update + ']';
                return {
                    'id': o.id,
                    'name': label
                };
            })
        );
        return response;
    }

    const getSpesaFull = async (spesaVecchia) => {
        const response = await Api.getSpesaAperta(spesaVecchia.id);
        setShowOptions(false);
        context.load(response.data);
        return response;
    }

    const resetSpesa = () => {
        setSearch('');
        context.reset();
        setVecchiaSpesa(null);
    }


    useEffect(() => {
        // ricerca ONLINE (api REST)
        (async () => {
            await getListaSpese(search);
        })();
    },
        // eslint-disable-next-line
        [search]);

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
                                className={`select-input-spesa ${vecchiaSpesa ? "found" : "notfound"}`}
                                placeholder="Vecchia spesa"
                                value={search}
                                onChange={(e) => hIChange(e.target.value)}
                                onFocus={(e) => hIFocus(e.target.value)}
                            />
                            {showOptions && (
                                <div className="select-menu">
                                    {filteredOptions.map((option, index) => (
                                        <div key={option.id}
                                            className={`select-option ${(vecchiaSpesa && option.id === vecchiaSpesa.id) ? "selected" : ""}`}
                                            onClick={(e) => { hOClick(option) }}
                                        >{option.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </td>
                    <td className='ps-4 td-button-add'>
                        {vecchiaSpesa && <div className="interface-cnt cnt-button-add">
                            <button onClick={() => resetSpesa()}>
                                Reset spesa
                            </button>
                        </div>}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}