import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';

export default function Login() {
    const refreshPage = () => {
        window.location.reload();
    };
    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-400">
            <Card className="bg-gray-200 p-4 w-1/4">
                <CardContent>
                    <Stack spacing={2} direction="column" className="items-center justify-center">
                        <PriceChangeOutlinedIcon fontSize='large' />
                        <div>Please Login to continue...</div>
                        <Button variant="contained" onClick={refreshPage}>Login</Button>
                    </Stack>
                </CardContent>

            </Card>
        </div>
    );
}