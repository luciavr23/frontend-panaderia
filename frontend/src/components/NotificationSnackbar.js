import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { webSocketService } from '../service/WebSocketService';

const NotificationSnackbar = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('info');

    useEffect(() => {
        const handleNewOrder = (order) => {
            setMessage(`¡Nuevo pedido recibido! #${order.orderNumber}`);
            setSeverity('success');
            setOpen(true);
        };

        webSocketService.addSubscriber('new-order', handleNewOrder);

        return () => {
            webSocketService.removeSubscriber('new-order', handleNewOrder);
        };
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default NotificationSnackbar; 