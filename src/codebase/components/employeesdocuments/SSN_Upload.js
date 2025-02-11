import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../context/context";
import axios from 'axios';
import './eDocsMain.css';
import { TextField } from '@mui/material';

const SSN_Upload = ({ userEmployeeId }) => {
    const { APIPath } = useContext(Context);

    return (
        <div className="ownerMainHolder">
            SSN CO TROL: {userEmployeeId}
        </div>
    );
};

export default SSN_Upload;