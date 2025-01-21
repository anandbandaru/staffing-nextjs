import React, { useContext, useState, useEffect } from "react";
// import preval from 'preval.macro';
import './TransactionsTop.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Context } from "../../context/context";
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import JobsMain from "../jobs/jobsMain";
import ExpensesMain from "../expenses/expensesMain";
import axios from 'axios';
import CustomSnackbar from "../snackbar/snackbar";

import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const TransactionsTop = ({ module }) => {
    const { userType, APIPath, userName, isAPILoading, setIsAPILoading } = useContext(Context);
    const [permissions, setPermissions] = useState([]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const showSnackbar = (severity, message) => {
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    // BURGER MENU
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTabDD, setSelectedTabDD] = useState(0);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (tabIndex) => {
        setAnchorEl(null);
        if (tabIndex !== undefined) {
            setSelectedTabDD(tabIndex);
        }
    };

    //PERMISSIONS
    useEffect(() => {
        if (userType !== 'ADMIN') {
            setIsAPILoading(true);
            axios.get(APIPath + `/gettransactionspermissions/${userName}`)
                .then(response => {
                    if (response.data.STATUS === "FAIL") {
                        showSnackbar('error', "Transactions tabs Permissions failure");
                        setPermissions([]);
                    }
                    else {
                        showSnackbar('info', "Transactions tabs Permissions success");
                        setPermissions(response.data.data)
                    }
                    setIsAPILoading(false);
                })
                .catch(error => {
                    showSnackbar('error', "Transactions tabs Permissions failure");
                    setIsAPILoading(false);
                });
        }
    }, [userName, userType]);

    //MOBILE MENU
    const [selectedTab, setSelectedTab] = useState('Jobs');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
    useEffect(() => {
        if (userType !== "ADMIN") {
            setSelectedTab("Jobs");
        }
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1200);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const allTabs = [
        { name: 'Jobs', icon: <WorkOutlineOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Invoices', icon: <PaidOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Expenses', icon: <AddShoppingCartIcon className="mr-1" fontSize="small" /> },
        { name: 'Payroll', icon: <PointOfSaleOutlinedIcon className="mr-1" fontSize="small" /> }
    ];
    const tabsToShow = userType === 'ADMIN' ? allTabs.map(tab => tab.name) : permissions;

    return (
        <div className="top2Holder px-0 py-0">
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <div className="top2TabsHolder">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    {tabsToShow.length > 0
                        ? (
                            isMobile ? (
                                <div className="">
                                    <div className="px-1">
                                        <select
                                            className="w-full p-2 border rounded my-0 mb-6 bg-top2Tab text-white"
                                            value={selectedTab}
                                            onChange={(e) => setSelectedTab(e.target.value)}
                                        >
                                            {allTabs.map(tab => (
                                                tabsToShow.includes(tab.name) &&
                                                <option key={tab.name} value={tab.name}>{tab.icon}{tab.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {selectedTab === 'Jobs' && <JobsMain />}
                                    {selectedTab === 'Invoices' && "Invoices"}
                                    {selectedTab === 'Expenses' && <ExpensesMain />}
                                    {selectedTab === 'Payroll' && "Payroll"}
                                </div>
                            ) : (
                                <Tabs selectedIndex={selectedTabDD} onSelect={index => setSelectedTabDD(index)}>
                                    <TabList className="top2TabsListHolder">
                                        <span className="top2TabsMenu bg-top2Tab pb-2 pt-1 text-white">
                                            <IconButton
                                                size="small"
                                                color="inherit"
                                                aria-label="menu"
                                                onClick={handleMenuClick}
                                            >
                                                <MenuIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={() => handleMenuClose()}
                                            >
                                                {allTabs.map((tab, index) => (
                                                    tabsToShow.includes(tab.name) && (
                                                        <MenuItem key={tab.name} onClick={() => handleMenuClose(index)}>
                                                            {tab.icon}{tab.name}
                                                        </MenuItem>
                                                    )
                                                ))}
                                            </Menu>
                                        </span>
                                        {allTabs.map(tab => (
                                            tabsToShow.includes(tab.name) && <Tab key={tab.name}>{tab.icon}{tab.name}</Tab>
                                        ))}
                                    </TabList>
                                    {tabsToShow.includes('Jobs') && <TabPanel className="py-0"><JobsMain /></TabPanel>}
                                    {tabsToShow.includes('Invoices') && <TabPanel className="py-0">Invoices</TabPanel>}
                                    {tabsToShow.includes('Expenses') && <TabPanel className="py-0"><ExpensesMain /></TabPanel>}
                                    {tabsToShow.includes('Payroll') && <TabPanel className="py-0">Payroll</TabPanel>}
                                </Tabs>
                            )
                        )
                        :
                        (
                            <Alert severity="warning">Nothing is permissioned here for you. Check with your Administrator</Alert>
                        )
                    }
                </Box>
            </div>
        </div >
    )
}
export default TransactionsTop;