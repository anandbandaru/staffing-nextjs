import React, { useContext, useEffect } from "react";
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
import ClientsMain from "../clients/clientsMain";
import ImpPartnersMain from "../imppartners/impPartnersMain";
import OwnershipsMain from "../ownerships/ownershipsMain";
import EmployeesMain from "../employees/employeesMain";
import VendorsMain from "../vendors/vendorsMain";
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';

const ModulesTop = ({ module }) => {

    const {
        topTabName,
        setTop2TabName } = useContext(Context);

    const [tab2Index, setTab2Index] = React.useState(0);

    const tab2Names_Modules = ['Owners', 'Companies', 'Ownerships', 'Employees', 'Vendors', 'Clients', 'Implementation Partners', 'Jobs Types', 'Expenses List', 'File Types List'];
    const handleTab2Select_Modules = (index) => {
        setTab2Index(index);
        console.log('Selected Tab2:', tab2Names_Modules[index]);
        setTop2TabName(tab2Names_Modules[index]);
    };


    //page title
    useEffect(() => {
        console.log("FRO TOP 2: Main TAB:" + topTabName)
    });

    return (
        <div className="top2Holder px-0 py-0">

            <div className="top2Left px-1 mt-2">
                <span className="logo" >
                    {module}
                </span>
            </div>
            <div className="top2TabsHolder">

            <Box sx={{ width: '100%', typography: 'body1' }}>
                        <Tabs selectedIndex={tab2Index}
                            onSelect={handleTab2Select_Modules}>
                            <TabList className="top2TabsListHolder">
                                {tab2Names_Modules.map((name, idx) => (
                                    <Tab key={idx}><AdjustOutlinedIcon className="mr-1" />{name}</Tab>
                                ))}
                            </TabList>
                            <TabPanel className="px-2">
                                <OwnersMain />
                            </TabPanel>
                            <TabPanel className="px-2">
                                <CompaniesMain />
                            </TabPanel>
                            <TabPanel className="px-2">
                                <OwnershipsMain />
                            </TabPanel>
                            <TabPanel className="px-2">
                                <EmployeesMain />
                            </TabPanel>
                            <TabPanel className="px-2">
                                <VendorsMain />
                            </TabPanel>
                            <TabPanel className="px-2">
                                <ClientsMain />
                            </TabPanel>
                            <TabPanel className="px-2">
                                <ImpPartnersMain />
                            </TabPanel>
                            <TabPanel className="px-2">
                                sdg
                            </TabPanel>
                            <TabPanel className="px-2">
                                sdg
                            </TabPanel>
                            <TabPanel className="px-2">
                                <FileTypesMain />
                            </TabPanel>
                        </Tabs>
                    </Box>




            </div>

        </div>
    )
}
export default ModulesTop;