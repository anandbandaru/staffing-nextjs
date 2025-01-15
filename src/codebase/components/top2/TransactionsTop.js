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
    const allTabs = [
        { name: 'Jobs', icon: <WorkOutlineOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Invoices', icon: <PaidOutlinedIcon className="mr-1" fontSize="small" /> },
        { name: 'Expenses', icon: <AddShoppingCartIcon className="mr-1" fontSize="small" /> },
        { name: 'Payroll', icon: <PointOfSaleOutlinedIcon className="mr-1" fontSize="small" /> }
    ];
    const tabsToShow = userType === 'ADMIN' ? allTabs.map(tab => tab.name) : permissions;

    return (
        <div className="top2Holder px-0">
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <div className="top2Left px-1 mt-2">
                <span className="logo" >
                    {module}
                </span>
            </div>
            <div className="top2TabsHolder">

                <Box sx={{ width: '100%', typography: 'body1' }}>
                    {tabsToShow.length > 0
                        ?
                        <Tabs>
                            <TabList className="topTabsListHolder">
                                {allTabs.map(tab => (
                                    tabsToShow.includes(tab.name) && <Tab key={tab.name}>{tab.icon}{tab.name}</Tab>
                                ))}
                            </TabList>
                            {tabsToShow.includes('Jobs') && <TabPanel className="py-0"><JobsMain /></TabPanel>}
                            {tabsToShow.includes('Invoices') && <TabPanel className="py-0">Invoices</TabPanel>}
                            {tabsToShow.includes('Expenses') && <TabPanel className="py-0"><ExpensesMain /></TabPanel>}
                            {tabsToShow.includes('Payroll') && <TabPanel className="py-0">Payroll</TabPanel>}
                        </Tabs>
                        :
                        <>
                            <Alert severity="warning">Nothing is permissioned here for you. Check with your Administrator</Alert>
                        </>
                    }
                </Box>
            </div>
        </div>
    )
}
export default TransactionsTop;