import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { database } from '../../../firebase';
import './realtime.css';
import { Stack } from '@mui/material';

const Realtime = () => {
    const [dataCount, setDataCount] = useState(0);
    const [dataNote, setDataNote] = useState(0);
    const [updateOnce, setUpdateOnce] = useState(true);
    const [blink, setBlink] = useState(false);

    useEffect(() => {
        const dbRef = ref(getDatabase(), '/count');

        // Read the current count value
        onValue(dbRef, (snapshot) => {
            const newData = snapshot.val();
            if (newData !== dataCount) {
                setBlink(true);
                setTimeout(() => setBlink(false), 1000); // Remove blink class after 1 second
            }
            console.log("setDataCount: " + newData);
            setDataCount(newData);
        });

        // Update the count value only once
        const updateCount = async () => {
            const currentCount = (await get(dbRef)).val();
            set(dbRef, currentCount + 1);
            setUpdateOnce(false);
        };
        if (updateOnce) {
            updateCount();
            setUpdateOnce(false);
        }
    }, []);

    useEffect(() => {
        const dbRef = ref(getDatabase(), '/note');
        // Read the current count value
        onValue(dbRef, (snapshot) => {
            const newData = snapshot.val();
            if (newData !== dataNote) {
                setBlink(true);
                setTimeout(() => setBlink(false), 1000); // Remove blink class after 1 second
            }
            setDataNote(newData);
        });
    }, []);

    return (
        <div className='realtimeHolder'>
            <Stack direction="row" spacing={2}>
                {/* <div className=''>
                    <span className={`${blink ? 'blink changeColor' : ''}`}>COUNT: {dataCount ? dataCount : "0"}</span>
                </div> */}
                <div className=''>
                    <span className={`${blink ? 'blink changeColor' : ''}`}>Notification: {dataNote ? dataNote : "0"}</span>
                </div>
            </Stack>
        </div>
    );
};

export default Realtime;