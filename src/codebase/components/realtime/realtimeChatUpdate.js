import React, { useEffect, useState, useContext } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import './realtime.css';
import { Stack } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Context } from "../../context/context";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

const RealtimeChatUpdate = () => {
    const { userName } = useContext(Context);
    const [dataChat, setDataChat] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const dbRef = ref(getDatabase(), '/chat');
        // Read the current chat messages
        onValue(dbRef, (snapshot) => {
            const newData = snapshot.val();
            if (newData) {
                setChatMessages(prevMessages => [...prevMessages, newData]);
            }
        });
    }, []);

    const handleChange = (event) => {
        setDataChat(event.target.value);
    };

    const updateChat = async () => {
        setIsSubmitting(true);
        const dbRef = ref(getDatabase(), `/chat`);
        await set(dbRef, `$$${userName}$$${dataChat}`);
        setIsSubmitting(false);
        setDataChat('');
    };

    const parseMessage = (message) => {
        const parts = message.split('$$');
        return { user: parts[1].split('@')[0], text: parts[2] };
    };

    return (
        <div className='realtimeHolderChat'>
            <div className='realtimeChatMessages'>
                {chatMessages.map((message, index) => {
                    const { user, text } = parseMessage(message);
                    return (
                        <div key={index} className='chatMessageHolder'>
                            <Stack direction="column" spacing={1}>
                                {/* <Chip
                                    label={user}
                                    color={user === userName ? 'primary' : 'secondary'}
                                    variant={user === userName ? 'outlined' : 'filled'}
                                /> */}
                                <span className='chatUser inline'>
                                    <PersonOutlinedIcon size='small' />
                                    {user}
                                </span>
                                <div className={user === userName ? 'chatMessage' : 'chatMessageOther'}>{text}</div>
                            </Stack>
                        </div>
                    );
                })}
            </div>
            <div className='realtimeChatControls'>
                <Stack direction="column" spacing={1}>
                    <TextField
                        size="small"
                        margin="normal"
                        fullWidth
                        multiline
                        rows={2}
                        id="Chat"
                        name="Chat"
                        label="Real time Chat"
                        value={dataChat}
                        onChange={handleChange}
                    />
                    <div className=''>
                        {isSubmitting ? (
                            <div className="spinner"></div>
                        ) : (
                            <Button color="primary" variant="contained"
                                onClick={updateChat} disabled={isSubmitting}>
                                <SaveOutlinedIcon className="mr-1" />
                                Save
                            </Button>
                        )}
                    </div>
                </Stack>
            </div>
        </div>
    );
};

export default RealtimeChatUpdate;