import React, { useContext, useState } from "react";
import 'reactjs-popup/dist/index.css';
import Button from '@mui/material/Button';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Context } from "../../context/context";

const OwnerDocumentsNew = () => {

    const {
        APIPath,
        createOneDriveFolder } = useContext(Context);

    return (
        <>

            <Button size="small" variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={createOneDriveFolder}>
                Add
            </Button>
        </>
    )
}

export default OwnerDocumentsNew;