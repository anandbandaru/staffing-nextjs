import React, { useContext, useEffect } from "react";
// import preval from 'preval.macro';
import './TransactionsTop.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Context } from "../../context/context";
import Box from '@mui/material/Box';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';

const TransactionsTop = ({ module }) => {

    const {
        topTabName,
        setTop2TabName } = useContext(Context);

    const [tab2Index, setTab2Index] = React.useState(0);

    const tab2Names_Transactions = ['Jobs', 'Invoices', 'Expenses', 'Payroll'];
    const handleTab2Select_Transactions = (index) => {
        setTab2Index(index);
        console.log('Selected Tab2:', tab2Names_Transactions[index]);
        setTop2TabName(tab2Names_Transactions[index]);
    };

    //page title
    useEffect(() => {
        console.log("FRO TOP 2: Main TAB:" + topTabName)
    });

    return (
        <div className="top2Holder px-0">

            <div className="top2Left px-1 mt-2">
                <span className="logo" >
                    {module}
                </span>
            </div>
            <div className="top2TabsHolder">

            <Box sx={{ width: '100%', typography: 'body1' }}>
                        <Tabs selectedIndex={tab2Index}
                            onSelect={handleTab2Select_Transactions}>
                            <TabList className="top2TabsListHolder">
                                {tab2Names_Transactions.map((name, idx) => (
                                    <Tab key={idx}><AdjustOutlinedIcon className="mr-1" />{name}</Tab>
                                ))}
                            </TabList>
                            <TabPanel className="px-2">
                                Jobs
                            </TabPanel>
                            <TabPanel className="px-2">
                                Invoices
                            </TabPanel>
                            <TabPanel className="px-2">
                                Expenses
                            </TabPanel>
                            <TabPanel className="px-2">
                                Payroll
                            </TabPanel>
                        </Tabs>
                    </Box>




            </div>

        </div>
    )
}
export default TransactionsTop;