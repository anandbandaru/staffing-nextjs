import React, { useContext, useEffect } from "react";
import { assets } from '../../assets/assets'
import './main.css';
import './table.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Context } from "../../context/context";
import Top from "../top/top";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TopBanner from "../topBanner/topBanner";
import ToDo from "../todo/todo";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';

const Main = () => {

    const { results, isAPIError, refreshPage } = useContext(Context);
    useEffect(() => {
        if (results) {
            // setStateSnack(true);
            handleClick_snack({ vertical: 'top', horizontal: 'center' })
        }
    }, [results]);

    useEffect(() => {
        if (isAPIError) {
            handleClick_snackAPI({ vertical: 'top', horizontal: 'center' })
        }
    }, [isAPIError]);


    //FOR NOTIFICATION
    const [stateSnack, setStateSnack] = React.useState({
        openSnack: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const [stateSnackAPI, setStateSnackAPI] = React.useState({
        openSnackAPI: false,
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal, openSnack } = stateSnack;
    const { openSnackAPI } = stateSnackAPI;
    const handleClick_snack = (newState) => {
        setStateSnack({ ...newState, openSnack: true });
    };
    const handleClose_snack = (event, reason) => {
        setStateSnack({ ...stateSnack, openSnack: false });
    };
    const handleClick_snackAPI = (newState) => {
        setStateSnackAPI({ ...newState, openSnackAPI: true });
    };
    const handleClose_snackAPI = (event, reason) => {
        setStateSnackAPI({ ...stateSnack, openSnackAPI: false });
    };

    return (
        <div className="main flex">
            {isAPIError ? 
            <div className="flex items-center justify-center w-full h-screen bg-gray-400">
                <Card className="bg-gray-200 p-4 w-1/4">
                    <CardContent>
                        <Stack spacing={2} direction="column" className="items-center justify-center">
                            <Stack spacing={2} direction="row" className="items-center justify-center">
                                <img className="icon" src={assets.logo_24} alt="" />
                                <PriceChangeOutlinedIcon fontSize='large' />
                            </Stack>
                            <Button variant="contained" onClick={refreshPage}>Refresh</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </div> :
                <>
                    <div className="flex-grow mr-80">
                        <TopBanner />
                        <Top />
                    </div>
                    <div className="w-80 h-full fixed right-0  bg-slate-100 border-l-4 border-pink-500 toDoRightHolder">
                        <ToDo />
                    </div>
                </>
            }


            {results ?
                <Snackbar
                    open={openSnack}
                    autoHideDuration={4000}
                    onClose={handleClose_snack}
                    key={vertical + horizontal}
                    anchorOrigin={{ vertical, horizontal }}
                >
                    {results.isError === 0 ? (
                        <Alert
                            onClose={handleClose_snack}
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            Response in: {results.elapsedTime}
                        </Alert>
                    ) : (
                        <Alert
                            onClose={handleClose_snack}
                            severity="error"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            Response in: {results.elapsedTime}
                        </Alert>
                    )
                    }
                </Snackbar>
                : <></>}



            <Snackbar
                open={openSnackAPI}
                // autoHideDuration={8000}
                onClose={handleClose_snackAPI}
                key={vertical}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert
                    onClose={handleClose_snackAPI}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    API is not available. Check after some time.
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Main;