import React from "react";
import './help.css';
import configData from "../../../CONFIG_RELEASE.json";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Stack } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';

const Help = () => {
    //For dialog MUI
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));
    const [openHelp, setOpenHelp] = React.useState(false);
    const handleClickOpen_help = () => {
        setOpenHelp(true);
    };
    const handleClose_help = () => {
        setOpenHelp(false);
    };
    return (
        <>
            <div className="bottom-item bottom-entry bottom-entry-help" onClick={handleClickOpen_help}>
                {/* <img src={assets.help_icon} alt="" /> */}
                <HelpOutlineRoundedIcon fontSize="small" />
                <p>Help</p>
            </div>
            <BootstrapDialog
                onClose={handleClose_help}
                TransitionComponent={Transition}
                aria-labelledby="customized-dialog-title"
                open={openHelp}
            >
                <DialogTitle className="dialogTitle" sx={{ m: 0, p: 1 }} id="customized-dialog-title" >
                    Help
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose_help}
                    sx={{
                        position: 'absolute',
                        right: 3,
                        top: 3,
                        color: (theme) => theme.palette.grey[900],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div>
                        <span className="devTitleHolder">Get in touch with developers</span>
                        <Stack spacing={1}>
                        {
                            configData.developers.map((item, index) => (
                                <List key={index} className="devContainer" sx={{ width: '300px', maxWidth: 350 }}>
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar className="devContainerAvatar">
                                            <AssignmentIndSharpIcon color="#f0ad4e" />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={item.name} secondary={item.role} />
                                    </ListItem>
                                </List>
                            ))
                        }
                        </Stack>
                    </div>
                </DialogContent>
            </BootstrapDialog>

            {/* <Popup trigger={
                <div className="bottom-item bottom-entry"> 
                    <PrivacyTipOutlinedIcon  fontSize="small"/>
                    Info 
                </div>
                } 
                modal>
                {close => (
                    <div className="modal">
                            <button className="close" onClick={close}>
                                <HighlightOffOutlinedIcon />
                            </button>
                            <div className="header"> About SQL GenAI </div>
                        <div className="content">
                            Version: 1.1s
                        </div>
                    </div>
                    )}
            </Popup> */}
        </>
    )
}
export default Help;