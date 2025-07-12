import React, { useState, useEffect } from 'react';
const Quotes = () => {

    const quotes = [
        "Suits any occasion from the boardroom to the beach and everything in between.",
        "Their ability to deliver technical yet fashionable shirts has heightened the standard of everyday attire",
    ];

    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);
    return (
        <h3 className='font-bold text-center font-sans w-[85%] mx-auto'>"{quotes[currentQuoteIndex]}"</h3>
    )
}

export default Quotes