import React, { useContext } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import './greetings.css';
import { Context } from "../../context/context";
import Chip from '@mui/material/Chip';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import Suggestions from "../suggestions/suggestions";

import { Stack } from "@mui/material";
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import Switch from '@mui/material/Switch';

const Greetings = (props) => {
    const { showGreetings, pageTitle, isAPIError,
        setShowGreetings,
    } = useContext(Context);

    //Toggle
    //const label = { inputProps: { 'aria-label': 'Show greetings' } };
    const PinkSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: pink[900],
            '&:hover': {
                backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
            },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: pink[900],
        },
    }));

    return (
        <>
            <div className="greet">
                <div className="mainHeading">
                    <div>Hi,</div>
                    <div>Welcome to {pageTitle}</div>
                </div>
            </div>

            <Stack direction="row" spacing={2} className="SettingsPartGreet">

            <div className="ToggleTitle" component="div">
                        Show greetings
                    </div>
                    <div className="greetingsBoxesSwitchHolder">
                        
                        <PinkSwitch label="Required"
                            //{...label}
                            checked={showGreetings}
                            onClick={() => {
                                setShowGreetings(!showGreetings);
                            }}
                            onChange={() => {
                            }}
                        />
                    </div>
            </Stack>

            {showGreetings ?
                <>
                    <div className="cardsMainTitle">
                        Below is what I can do for you:
                    </div>
                    <div className="cards">
                        {configData.greetings.map((item, index) => (
                            <div key={index} className="card">
                                {item.icon === 'code' && <CodeRoundedIcon />}
                                {item.icon === 'storage' && <StorageRoundedIcon />}
                                {item.icon === 'query' && <QueryStatsRoundedIcon />}
                                {item.icon === 'compare' && <CompareArrowsIcon />}
                                {item.icon === 'question' && <QuestionAnswerRoundedIcon />}
                                <p className="">{item.message}</p>
                            </div>
                        ))}
                    </div>
                </>
                : <></>}
            {props.templateType ?
                <div className="templeteTypeHolder">
                    <Chip label="using new results template design" color="success" size="small" />
                </div>
                : null}

            {showGreetings && !isAPIError ?
                <>

                    <div className="greet">
                        <div>Here are few examples curated for {pageTitle}:</div>
                    </div>
                    <Suggestions isFromGreetings={true} />
                </>
                : <></>}
        </>
    )
}

export default Greetings;