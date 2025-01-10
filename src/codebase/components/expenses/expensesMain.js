import React from "react";
import './expensesMain.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import ExpenseList from './expenseList';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';

const ExpensesMain = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    return (
        <div className="expenseMainHolder">
            <div className="subTabsHolder">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Tabs selectedIndex={tabIndex}
                        onSelect={(index) => setTabIndex(index)}>
                        <TabList className="subTabsListHolder">
                            <Tab><ListOutlinedIcon className="mr-1" />List</Tab>
                            <Tab><BarChartOutlinedIcon className="mr-1" />Reports</Tab>
                        </TabList>

                        <TabPanel className="px-2">
                            <ExpenseList />
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

export default ExpensesMain;