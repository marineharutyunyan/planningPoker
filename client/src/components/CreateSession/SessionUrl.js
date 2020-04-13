import React, { useRef, useState } from 'react';
import './CreateSession.css';

export default function ShowSessionUrl({ room }) {
    const urlRef = useRef();
    const [url, setUrl] = useState(`http://localhost:3000/join?id=${room}`);
    const onCopyUrl = () => {
        const copyText = urlRef.current;
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        alert('Copied text command was ' + msg);
    };

    return (
        <div className="urlContainer">
            <h2 className="heading" id ="heading" >{url}</h2>
            <input ref={urlRef}
                   className="url-input"
                   type="text"
                   value={url}
                   onChange={(event) => setUrl(event.target.value)}
            />
            <button onClick={onCopyUrl}
                    className={'button mt-20 copy-button'}
                    type="submit"
            >Copy</button>
        </div>
)};
