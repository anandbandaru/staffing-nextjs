import React, { useContext, useEffect, useState } from "react";
import configData from "../../../CONFIG_RELEASE.json";
import './ownersMain.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import OwnersList from './ownerList';
import OwnerNew from './ownerNew';

const OwnersMain = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    return (
        <div className="ownerMainHolder">
            <div className="subTabsHolder">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Tabs selectedIndex={tabIndex}
                        onSelect={(index) => setTabIndex(index)}>
                        <TabList className="subTabsListHolder">
                            <Tab>List</Tab>
                            <Tab>Add New</Tab>
                            <Tab>Documents</Tab>
                            <Tab>Reports</Tab>
                        </TabList>

                        <TabPanel>
                            <OwnersList />
                        </TabPanel>
                        <TabPanel>
                            <OwnerNew />
                        </TabPanel>
                        <TabPanel>
                            Documents
                        </TabPanel>
                        <TabPanel>
                            Reports
                        </TabPanel>
                    </Tabs>
                </Box>
            </div>
        </div>
    )
}

export default OwnersMain;