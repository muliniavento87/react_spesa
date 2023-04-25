import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import "./SearchField.css";

function SearchField() {
    const [value, setValue] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showOptions, setShowOptions] = useState(false);
    const wrapperRef = useRef(null);


    async function getOnline() {
        const response = await axios.get(`http://localhost:8001/api/app_test_00/test/?name=${value.toLowerCase()}`);

        setFilteredOptions(
            response.data.filter((option) =>
                option.name.toLowerCase().includes(value.toLowerCase())
            ).map(function (o) { return { 'id': o.id, 'name': o.name } })
        );
    }

    useEffect(() => {
        // ricerca ONLINE (api REST) [http://localhost:8001/api/app_test_00/test?name=]
        getOnline();
    }, [value]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };

    const handleInputChange = (event) => {
        //console.log(event.target.value);
        setValue(event.target.value);
        setSelectedIndex(-1);
        setShowOptions(true);
        // NASCONDI risultati se stringa vuota:
        //  - per annullare il NASCONDI => rimuovere il blocco if sotto
        if (!event.target.value || event.target.value === '') {
            setShowOptions(false);
        }
    };

    const handleOptionClick = (index) => {
        setValue(filteredOptions[index].name);
        setSelectedIndex(-1);
        setShowOptions(false);
    };

    const handleKeyDown = (event) => {
        //console.log(filteredOptions);
        if (event.key === "ArrowUp") {
            setSelectedIndex((prev) =>
                prev <= 0 ? filteredOptions.length - 1 : prev - 1
            );
        }
        /*
        else if (event.key === "ArrowDown") {
            setSelectedIndex((prev) =>
                prev === filteredOptions.length - 1 ? 0 : prev + 1
            );
        } else if (event.key === "Enter") {
            setValue(filteredOptions[selectedIndex]);
            setSelectedIndex(-1);
            setShowOptions(false);
        }
        */
        else if (event.key === "Escape") {
            setShowOptions(false);
        }
    };

    /* BALLOON info risultati trovati
    {
        showOptions && (
            <div className="balloon">
                {filteredOptions.length} options available
            </div>
        )
    }
    */

    return (
        <div className="select-container" ref={wrapperRef}>
            <input
                type="text"
                className="select-input"
                placeholder="Select an option"
                value={value}
                onChange={handleInputChange}
                onFocus={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            {showOptions && (
                <div className="select-menu">
                    {filteredOptions.map((option, index) => (
                        <div
                            key={option.id}
                            className={`select-option ${index === selectedIndex ? "selected" : ""
                                }`}
                            onClick={() => handleOptionClick(index)}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchField;
