import React from "react";
import './companiesMain.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import CompaniesList from './companiesList';
// import OwnerDocumentsNew from "./ownerDocumentsNew";

const CompaniesMain = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    return (
        <div className="companyMainHolder">
            <div className="subTabsHolder">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Tabs selectedIndex={tabIndex}
                        onSelect={(index) => setTabIndex(index)}>
                        <TabList className="subTabsListHolder">
                            <Tab>List</Tab>
                            <Tab>Ownership</Tab>
                            <Tab>Documents</Tab>
                            <Tab>Reports</Tab>
                        </TabList>

                        <TabPanel className="px-2">
                            <CompaniesList />
                        </TabPanel>
                        <TabPanel className="px-2">
                        Ownership
                        </TabPanel>
                        <TabPanel className="px-2">
                            {/* <OwnerDocumentsNew /> */}
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

export default CompaniesMain;