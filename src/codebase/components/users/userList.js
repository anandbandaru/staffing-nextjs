import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import UsersListToolbar from "./usersListToolbar";
import axios from "axios";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AttributionOutlinedIcon from '@mui/icons-material/AttributionOutlined';
import Stack from '@mui/material/Stack';

const UserList = () => {
    const { accessToken } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    const [itemCount, setItemCount] = useState(0);

    useEffect(() => {
        fetchUsers();
    }, []);

    function manualLoadData() {
        setApiLoading(true);
        delaydMockLoading();
    }

    function delaydMockLoading() {
        setApiLoading(true);
        setItemCount(0);
        setDataAPIError("");
        setTimeout(() => {
            fetchUsers();
        }, 1);
    }

    const fetchUsers = async () => {
        setApiLoading(true);
        await axios.get("https://graph.microsoft.com/v1.0/users", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then((resp) => {
            setItemCount(resp.data.value.length);
            setDataAPIError(resp.data.value.length === 0 ? "No Users information present." : "ok");
            setApiLoading(false);
            setData(resp.data);
        }).catch(function (error) {
            console.log(error);
            setDataAPIError(error);
            setItemCount(0);
            setApiLoading(false);
            setData([]);
        });
    };

    const iconMap = {
        ADMIN: <AdminPanelSettingsOutlinedIcon />,
        COHOST: <SupervisedUserCircleOutlinedIcon />,
        TIMESHEET: <PersonOutlinedIcon />,
        DEFAULT: <AttributionOutlinedIcon />,
    };

    const classMap = {
        ADMIN: 'rag-green-bg badgeSpan',
        COHOST: 'rag-red-bg badgeSpan',
        TIMESHEET: 'rag-blue-bg badgeSpan',
        DEFAULT: 'rag-gray-bg badgeSpan',
    };

    const CustomJobTitleRenderer = ({ value }) => (
        <Stack direction="row" spacing={1} className="place-items-center">
            {iconMap[value] || iconMap.DEFAULT}
            <span className={classMap[value] || classMap.DEFAULT}>
                {value}
            </span>
        </Stack>
    );
// Column Definitions: Defines the columns to be displayed.
const [colDefs, setColDefs] = useState([
    { field: "givenName", filter: true },
    { field: "surname", filter: true },
    {
        field: "jobTitle",
        cellRenderer: CustomJobTitleRenderer
    },
    { field: "userPrincipalName" },
    { field: "mail", filter: true },
    { field: "mobilePhone", filter: true },
]);
const rowClassRules = {
    // apply red to Ford cars
    //'rag-red': params => params.data.firstName === "anand",
};
const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [5, 10, 20, 50];
const autoSizeStrategy = {
    type: 'fitGridWidth',
    defaultMinWidth: 50
};

return (
    <>
        <div className="w-full flex bg-kmcBG dark:bg-gray-700 text-sm justify-between place-items-center space-x-2 py-2 px-2 ">

            {/* TOOLS */}
            <UsersListToolbar
                operation="Add"
                itemCount={itemCount}
                apiLoading={apiLoading}
                apiLoadingError={apiLoadingError}
                dataAPIError={dataAPIError}
                manualLoadData={manualLoadData} />
            {/* TOOLS */}

        </div>

        <div
            className="ag-theme-quartz" // applying the Data Grid theme
            style={{ height: 500 }} // the Data Grid will fill the size of the parent container
        >
            <AgGridReact
                rowData={data.value}
                columnDefs={colDefs}
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
                rowClassRules={rowClassRules}
                autoSizeStrategy={autoSizeStrategy}
                enableCellTextSelection={true}
            />
        </div>

    </>
)
}

export default UserList;