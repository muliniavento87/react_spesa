import { useState } from 'react';

function Input() {
    const [text, setText] = useState("Scrivi qui...");

    const handleChange = (event) => {
        setText(event.target.value);
    };

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={handleChange}
            />
            <p>Hai scritto: {text}</p>
        </div>
    );
}

export default Input;
