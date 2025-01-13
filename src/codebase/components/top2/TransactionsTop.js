import React, { useContext, useEffect } from "react";
// import preval from 'preval.macro';
import './TransactionsTop.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Context } from "../../context/context";
import Box from '@mui/material/Box';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import JobsMain from "../jobs/jobsMain";
import ExpensesMain from "../expenses/expensesMain";

const TransactionsTop = ({ module }) => {
    const { userType } = useContext(Context);
    return (
        <div className="top2Holder px-0">

            <div className="top2Left px-1 mt-2">
                <span className="logo" >
                    {module}
                </span>
            </div>
            <div className="top2TabsHolder">

                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Tabs>
                        <TabList className="top2TabsListHolder">
                            <Tab ><AssuredWorkloadOutlinedIcon className="mr-1" fontSize="small" />Jobs</Tab>
                            {userType === 'ADMIN' && (
                                <>
                                <Tab ><SellOutlinedIcon className="mr-1" fontSize="small" />Invoices</Tab>
                                <Tab ><AddShoppingCartIcon className="mr-1" fontSize="small" />Expenses</Tab>
                                <Tab ><PointOfSaleOutlinedIcon className="mr-1" fontSize="small" />Payroll</Tab>
                                </>
                            )}
                        </TabList>
                        <TabPanel className="py-0">
                            <JobsMain />
                        </TabPanel>
                        {userType === 'ADMIN' && (
                            <>
                                <TabPanel className="py-0">
                                    Invoices
                                </TabPanel>
                                <TabPanel className="py-0">
                                    <ExpensesMain />
                                </TabPanel>
                                <TabPanel className="py-0">
                                    Payroll
                                </TabPanel>
                            </>
                        )}
                    </Tabs>
                </Box>
            </div>
        </div>
    )
}
export default TransactionsTop;