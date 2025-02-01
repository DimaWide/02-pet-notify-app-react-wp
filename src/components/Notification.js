// Notification.js
import React, { useState, useEffect } from 'react';
import { Message } from 'semantic-ui-react';

const Notification = ({ message, type }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message) return null;

    return (
        <div className={`notification ${show ? 'show' : ''} ${type}`}>
            <Message
                success={type === 'success'}
                error={type === 'error'}
                header={type === 'success' ? 'Success!' : 'Error!'}
                content={message}
            />
        </div>
    );
};

export default Notification;
