import React, { useState } from "react";
import "./Menu.css";

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="menu-container">
                <button className={`menu-btn ${isOpen ? "open" : ""}`} onClick={toggleSidebar}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className={`menu ${isOpen ? "open" : ""}`}>
                    <div className="menu-item"><div className="item">Link 1</div></div>
                    <div className="menu-item"><div className="item">Link 2</div></div>
                    <div className="menu-item"><div className="item">Link 3</div></div>
                </div>
            </div>
        </>
    );
};

export default Menu;
