import { useState } from 'react';

function Incrementer({ count, onIncrement }) {
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={onIncrement}>Increment</button>
        </div>
    );
}

function Decrementer({ count, onDecrement }) {
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={onDecrement}>Decrement</button>
        </div>
    );
}

function Test() {
    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        setCount((prevCount) => prevCount + 1);
    };

    const handleDecrement = () => {
        setCount((prevCount) => prevCount - 1);
    };

    return (
        <div>
            <Incrementer count={count} onIncrement={handleIncrement} />
            <Decrementer count={count} onDecrement={handleDecrement} />
        </div>
    );
}

export default Test;