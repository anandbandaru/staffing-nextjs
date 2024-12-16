import React from "react";
import './fileTypes.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import FileTypeList from './fileTypeList';

const FileTypes = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    return (
        <div className="ownerMainHolder">
            <div className="subTabsHolder">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Tabs selectedIndex={tabIndex}
                        onSelect={(index) => setTabIndex(index)}>
                        <TabList className="subTabsListHolder">
                            <Tab>List</Tab>
                            <Tab>Reports</Tab>
                        </TabList>

                        <TabPanel className="px-2">
                            <FileTypeList />
                        </TabPanel>
                        <TabPanel className="px-2">
                            Reports
                        </TabPanel>
                    </Tabs>
                </Box>
            </div>
        </div>
    )
}

export default FileTypes;