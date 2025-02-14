import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import './realtime.css';
import { Stack } from '@mui/material';
import Chip from '@mui/material/Chip';

const RealtimeCount = () => {
    const [dataCount, setDataCount] = useState(0);

    useEffect(() => {
        const dbRef = ref(getDatabase(), '/count');

        // Read the current count value
        onValue(dbRef, (snapshot) => {
            const newData = snapshot.val();
            setDataCount(newData);
        });
    }, []);

    return (
        <div className='realtimeHolderCount'>
            <Stack direction="row" spacing={2}>
                <div className=''>
                    <Chip label={dataCount ? dataCount : "0"} color="success" />
                </div>
            </Stack>
        </div>
    );
};

export default RealtimeCount;