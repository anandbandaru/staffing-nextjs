import React from "react";
import './employeesMain.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import EmployeesList from './employeeList';
import EmployeesReport from "./employeesReports";
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';

const EmployeesMain = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    return (
        <div className="employeeMainHolder">
            <div className="subTabsHolder">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Tabs selectedIndex={tabIndex}
                        onSelect={(index) => setTabIndex(index)}>
                        <TabList className="subTabsListHolder">
                            <Tab><ListOutlinedIcon className="mr-1" />List</Tab>
                            <Tab><BarChartOutlinedIcon className="mr-1" />Reports</Tab>
                        </TabList>

                        <TabPanel className="px-2">
                            <EmployeesList />
                        </TabPanel>
                        <TabPanel className="px-2">
                            <EmployeesReport />
                        </TabPanel>
                    </Tabs>
                </Box>
            </div>
        </div>
    )
}

export default EmployeesMain;