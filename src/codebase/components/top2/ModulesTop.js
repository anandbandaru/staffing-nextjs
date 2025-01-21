import React, { useContext, useState, useEffect } from "react";
import './ModulesTop.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Context } from "../../context/context";
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import OwnersMain from "../owners/ownersMain";
import CompaniesMain from "../companies/companiesMain";
import FileTypesMain from "../filetypes/fileTypesMain";
import ExpenseTypesMain from "../expensetypes/expenseTypesMain";
import JobTypesMain from "../jobtypes/jobTypesMain";
import ClientsMain from "../clients/clientsMain";
import ImpPartnersMain from "../imppartners/impPartnersMain";
import OwnershipsMain from "../ownerships/ownershipsMain";
import EmployeesMain from "../employees/employeesMain";
import VendorsMain from "../vendors/vendorsMain";
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import axios from 'axios';
import CustomSnackbar from "../snackbar/snackbar";
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';

import { Select, MenuItem, ListItemIcon, ListItemText } from '@mui/material';


const ModulesTop = ({ module }) => {
    const { userType, APIPath, userName } = useContext(Context);
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
            axios.get(APIPath + `/getnewpermissions/${userName}`)
                .then(response => {
                    if (response.data.STATUS === "FAIL") {
                        showSnackbar('error', "New tabs Permissions failure");
                        setPermissions([]);
                    }
                    else {
                        showSnackbar('info', "New tabs Permissions success");
                        setPermissions(response.data.data)
                    }
                })
                .catch(error => {
                    showSnackbar('error', "New tabs Permissions failure");
                });
        }
    }, [userName, userType]);

    //MOBILE MENU
    const [selectedTab, setSelectedTab] = useState('Owners');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
    useEffect(() => {
        if (userType !== "ADMIN") {
            setSelectedTab("Vendors");
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
        { name: 'Owners', icon: <DoubleArrowOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Companies', icon: <DoubleArrowOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Ownerships', icon: <DoubleArrowOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Employees', icon: <AdjustOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Vendors', icon: <AdjustOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Clients', icon: <AdjustOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Implementation Partners', icon: <AdjustOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Job Types', icon: <AdjustOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Expense Types', icon: <AdjustOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'File Types', icon: <AdjustOutlinedIcon className="mr-1" fontSize="small" /> }
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
                                    {selectedTab === 'Owners' && <OwnersMain />}
                                    {selectedTab === 'Companies' && <CompaniesMain />}
                                    {selectedTab === 'Ownerships' && <OwnershipsMain />}
                                    {selectedTab === 'Employees' && <EmployeesMain />}
                                    {selectedTab === 'Vendors' && <VendorsMain />}
                                    {selectedTab === 'Clients' && <ClientsMain />}
                                    {selectedTab === 'Implementation Partners' && <ImpPartnersMain />}
                                    {selectedTab === 'Job Types' && <JobTypesMain />}
                                    {selectedTab === 'Expense Types' && <ExpenseTypesMain />}
                                    {selectedTab === 'File Types' && <FileTypesMain />}
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
                                    {tabsToShow.includes('Owners') && <TabPanel className="-mt-1"><OwnersMain /></TabPanel>}
                                    {tabsToShow.includes('Companies') && <TabPanel className="-mt-1"><CompaniesMain /></TabPanel>}
                                    {tabsToShow.includes('Ownerships') && <TabPanel className="-mt-1"><OwnershipsMain /></TabPanel>}
                                    {tabsToShow.includes('Employees') && <TabPanel className="-mt-1"><EmployeesMain /></TabPanel>}
                                    {tabsToShow.includes('Vendors') && <TabPanel className="-mt-1"><VendorsMain /></TabPanel>}
                                    {tabsToShow.includes('Clients') && <TabPanel className="-mt-1"><ClientsMain /></TabPanel>}
                                    {tabsToShow.includes('Implementation Partners') && <TabPanel className="-mt-1"><ImpPartnersMain /></TabPanel>}
                                    {tabsToShow.includes('Job Types') && <TabPanel className="-mt-1"><JobTypesMain /></TabPanel>}
                                    {tabsToShow.includes('Expense Types') && <TabPanel className="-mt-1"><ExpenseTypesMain /></TabPanel>}
                                    {tabsToShow.includes('File Types') && <TabPanel className="-mt-1"><FileTypesMain /></TabPanel>}
                                </Tabs>
                            )
                        ) : (
                            <Alert severity="warning">Nothing is permissioned here for you. Check with your Administrator</Alert>
                        )
                    }
                </Box>
            </div>
        </div>
    );
};

export default ModulesTop;