import React, {useContext} from "react";
import { assets } from '../../assets/assets'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import { Context } from "../../context/context";

export default function Login() {
    const { results, isAPIError, refreshPage } = useContext(Context);
    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-400">
            <Card className="bg-gray-200 p-4 w-1/4">
                <CardContent>
                    <Stack spacing={2} direction="column" className="items-center justify-center">
                        <Stack spacing={2} direction="row" className="items-center justify-center">
                            <img className="icon" src={assets.logo_24} alt="" />
                            <PriceChangeOutlinedIcon fontSize='large' />
                        </Stack>
                        <div>Please Login to continue...</div>
                        <Button variant="contained" onClick={refreshPage}>Login</Button>
                    </Stack>
                </CardContent>
            </Card>
        </div>
    );
}