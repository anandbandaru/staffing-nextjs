import React, { useContext, useState, useEffect } from "react";
// import preval from 'preval.macro';
import './ModulesTop.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Context } from "../../context/context";
import Box from '@mui/material/Box';
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
                    <Tabs>
                        <TabList className="topTabsListHolder">
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
                        {/* <TabList className="top2TabsListHolder">
                            {userType === 'ADMIN' && (
                                <Tab ><DoubleArrowOutlinedIcon className="mr-1" fontSize="small" />Owners</Tab>
                            )}
                            {userType === 'ADMIN' && (
                                <Tab ><DoubleArrowOutlinedIcon className="mr-1" fontSize="small" />Companies</Tab>
                            )}
                            {userType === 'ADMIN' && (
                                <Tab ><DoubleArrowOutlinedIcon className="mr-1" fontSize="small" />Ownerships</Tab>
                            )}
                            <Tab ><AdjustOutlinedIcon className="mr-1" fontSize="small" />Employees</Tab>
                            <Tab ><AdjustOutlinedIcon className="mr-1" fontSize="small" />Vendors</Tab>
                            <Tab ><AdjustOutlinedIcon className="mr-1" fontSize="small" />Clients</Tab>
                            <Tab ><AdjustOutlinedIcon className="mr-1" fontSize="small" />Implementation Partners</Tab>
                            <Tab ><AdjustOutlinedIcon className="mr-1" fontSize="small" />Job Types</Tab>
                            <Tab ><AdjustOutlinedIcon className="mr-1" fontSize="small" />Expense Types</Tab>
                            <Tab ><AdjustOutlinedIcon className="mr-1" fontSize="small" />File Types</Tab>
                        </TabList> */}
                        {/* {userType === 'ADMIN' && (
                            <TabPanel className="-mt-1">
                                <OwnersMain />
                            </TabPanel>
                        )}
                        {userType === 'ADMIN' && (
                            <TabPanel className="-mt-1">
                                <CompaniesMain />
                            </TabPanel>
                        )}
                        {userType === 'ADMIN' && (
                            <TabPanel className="-mt-1">
                                <OwnershipsMain />
                            </TabPanel>
                        )}
                        <TabPanel className="-mt-1">
                            <EmployeesMain />
                        </TabPanel>
                        <TabPanel className="-mt-1">
                            <VendorsMain />
                        </TabPanel>
                        <TabPanel className="-mt-1">
                            <ClientsMain />
                        </TabPanel>
                        <TabPanel className="-mt-1">
                            <ImpPartnersMain />
                        </TabPanel>
                        <TabPanel className="-mt-1">
                            <JobTypesMain />
                        </TabPanel>
                        <TabPanel className="-mt-1">
                            <ExpenseTypesMain />
                        </TabPanel>
                        <TabPanel className="-mt-1">
                            <FileTypesMain />
                        </TabPanel> */}
                    </Tabs>
                </Box>
            </div>
        </div>
    )
}
export default ModulesTop;