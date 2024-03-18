import React from 'react';

function MyComponent() {
    const launchHtml = () => {
        window.location.href = 'http://localhost:8080/FaceD.html'; // Use the full URL
    };
    
    return <button onClick={launchHtml}>Launch HTML</button>;
}

export default MyComponent;
