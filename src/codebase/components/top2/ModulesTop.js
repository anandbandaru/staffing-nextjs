import React, { useContext } from "react";
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

const ModulesTop = ({ module }) => {

    const { userType } = useContext(Context);

    return (
        <div className="top2Holder px-0 py-0">
            <div className="top2TabsHolder">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Tabs>
                        <TabList className="top2TabsListHolder">
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
                        </TabList>
                        {userType === 'ADMIN' && (
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
                        </TabPanel>
                    </Tabs>
                </Box>
            </div>
        </div>
    )
}
export default ModulesTop;