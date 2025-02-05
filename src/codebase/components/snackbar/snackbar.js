import React, { useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import toast, { Toaster } from 'react-hot-toast';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar = ({ open, handleClose, severity, message }) => {

    const toastConfig = {
        duration: 6000,
        position: 'top-right',
        removeDelay: 1000,
    };

    useEffect(() => {
        if (open) {
            // console.log(message);
            switch (severity) {
                case 'success':
                    toast.success(message, toastConfig);
                    break;
                case 'error':
                    toast.error(message, toastConfig);
                    break;
                case 'info':
                    toast.custom(<Alert severity={severity} sx={{ width: '50%' }}>
                        {message}
                    </Alert>);
                    break;
                case 'warning':
                    toast.custom(<Alert severity={severity} sx={{ width: '50%' }}>
                        {message}
                    </Alert>);
                    break;
                case 'admin':
                    toast.custom(
                        <Alert severity={severity} sx={{ width: '50%' }}>
                            <NotificationsActiveOutlinedIcon />
                            {message}
                        </Alert>);
                    break;
                default:
                    toast.success(message, toastConfig);
                    break;
            }
        }
    }, [open]);

    return (
        <>
            <Snackbar
                className="noDisplay"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}>
                {/* <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert> */}
            </Snackbar>
            <Toaster
                onClose={handleClose}
                toastOptions={{
                    className: '',
                    style: {
                        border: '2px solid #000',
                        padding: '10px',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: 'green',
                        },
                    },
                    error: {
                        style: {
                            background: 'red',
                        },
                    },
                    info: {
                        style: {
                            background: 'blue',
                        },
                    },
                    warning: {
                        style: {
                            background: 'yellow',
                        },
                    },
                    admin: {
                        style: {
                            background: 'yellow',
                        },
                    },
                }}
            />
        </>
    );
};

export default CustomSnackbar;