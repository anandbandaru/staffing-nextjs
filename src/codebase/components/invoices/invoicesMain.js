import React from "react";
import './invoicesMain.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Box from '@mui/material/Box';
import InvoiceList from './invoiceList';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import InvoiceSavedList from "./invoiceSavedList";
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded';
import InvoiceClosedList from "./invoiceClosedList";

const InvoicesMain = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    return (
        <div className="invoiceMainHolder">
            <div className="subTabsHolder">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Tabs selectedIndex={tabIndex}
                        onSelect={(index) => setTabIndex(index)}>
                        <TabList className="subTabsListHolder">
                            <Tab><TimerOutlinedIcon className="mr-1" />Pending</Tab>
                            <Tab><SaveOutlinedIcon className="mr-1" />Saved</Tab>
                            <Tab><BookmarkAddedRoundedIcon className="mr-1" />Closed</Tab>
                            <Tab><BarChartOutlinedIcon className="mr-1" />Reports</Tab>
                        </TabList>

                        <TabPanel className="px-2">
                            <InvoiceList />
                        </TabPanel>
                        <TabPanel className="px-2">
                            <InvoiceSavedList />
                        </TabPanel>
                        <TabPanel className="px-2">
                            <InvoiceClosedList />
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

export default InvoicesMain;