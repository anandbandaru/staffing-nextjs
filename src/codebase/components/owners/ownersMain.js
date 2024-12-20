import React from "react";
import './ownersMain.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import OwnersList from './ownerList';
import OwnerDocumentsNew from "./ownerDocumentsNew";
import OwnersReport from "./ownersReports";
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import AttachmentSharpIcon from '@mui/icons-material/AttachmentSharp';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';

const OwnersMain = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    return (
        <div className="ownerMainHolder">
            <div className="subTabsHolder">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Tabs selectedIndex={tabIndex}
                        onSelect={(index) => setTabIndex(index)}>
                        <TabList className="subTabsListHolder">
                            <Tab><ListOutlinedIcon className="mr-1" />List</Tab>
                            <Tab><AttachmentSharpIcon className="mr-1" />Documents</Tab>
                            <Tab><BarChartOutlinedIcon className="mr-1" />Reports</Tab>
                        </TabList>

                        <TabPanel className="px-2">
                            <OwnersList />
                        </TabPanel>
                        <TabPanel className="px-2">
                            {/* <OwnerDocumentsNew /> */}
                        </TabPanel>
                        <TabPanel className="px-2">
                            <OwnersReport />
                        </TabPanel>
                    </Tabs>
                </Box>
            </div>
        </div>
    )
}

export default OwnersMain;