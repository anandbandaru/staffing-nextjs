import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import EmployeesListToolbar from './employeesListToolbar'
import GenericDetails from "../forms/GenericDetails";
import EmployeeEdit from "./employeeEdit";
import CustomSnackbar from "../snackbar/snackbar";

const EmployeesList = () => {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    const [itemCount, setItemCount] = useState(0);

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
        delaydMockLoading();
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
            getList();
        }, 1);
    }

    const getList = () => {
        setData({ data: [] });
        let apiUrl = APIPath + "/getemployees"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //// console.log(result);
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setData({});
                        setItemCount(0);
                    }
                    else {
                        setData(result);
                        setItemCount(result.total);
                        setDataAPIError(result.STATUS === "FAIL" ? "API Error" : "");
                        if (result.STATUS === "FAIL") {
                            showSnackbar('error', result.ERROR.MESSAGE);
                        }
                        else
                            showSnackbar('success', "Employees Data fetched");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setDataAPIError(error.toString());
                    setData({});
                    setItemCount(0);
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const CustomDetailsComponent = (props) => {
        return (
            <>
                <GenericDetails ID={props.data.Id} operation="View" doLoading={false} moduleName="EMPLOYEES" />
            </>
        );
    };
    const CustomEditComponent = (props) => {
        return (
            <>
                <EmployeeEdit ID={props.data.Id} operation="Edit" manualLoadData={manualLoadData} setApiLoading={setApiLoading} showSnackbar={showSnackbar} />
            </>
        );
    };
    const CustomEmailRenderer = ({ value }) => (
        <span>
            <MarkunreadOutlinedIcon fontSize="small" className="mr-2" />
            {value}
        </span>
    );
    const CustomDisabledRenderer = ({ value }) => (
        <span className={(value === null || !value) ? 'rag-green-bg badgeSpan' : 'rag-red-bg badgeSpan'}>
            {(value === null || !value) ? "NO" : "YES"}
        </span>
    );
    const CustomEmployeeTypeRenderer = ({ value }) => (
        <span className={(value === 'OFFSHORE') ? 'rag-gray-bg badgeSpan' : 'rag-blue-bg badgeSpan'}>
            {value}
        </span>
    );
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState([
        {
            field: "", cellRenderer: CustomDetailsComponent, maxWidth: 50, resizable: false
        },
        { field: "Id", maxWidth: 50 },
        {
            field: "disabled", filter: false, maxWidth: 100,
            // cellClassRules: {
            //     // apply green to electric cars
            //     'rag-green': params => params.value === null || params.value === false,
            //     'rag-red': params => params.value === true,
            // },
            cellRenderer: CustomDisabledRenderer
        },
        { field: "firstName", filter: true, maxWidth: 200 },
        { field: "lastName", filter: true, maxWidth: 200 },
        {
            field: "personalEmail", filter: true, editable: true,
            cellClassRules: {
                // apply green to electric cars
                'rag-green': params => params.value === "sa.ke@aol.com",
            },
            cellRenderer: CustomEmailRenderer
        },
        { field: "personalPhone", filter: true, maxWidth: 150 },
        { field: "personalUSPhone", filter: true, maxWidth: 150 },
        {
            field: "employeeType", filter: true, maxWidth: 150,
            cellRenderer: CustomEmployeeTypeRenderer
        },
        { field: "applicationEmail", filter: true, editable: true, },
        { field: "options", cellRenderer: CustomEditComponent, maxWidth: 170, resizable: true }
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
    const gridOptions = {
      enableCellTextSelection: true,
      ensureDomOrder: true,
    };

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            <div className="w-full flex bg-kmcBG dark:bg-gray-700 text-sm justify-between place-items-center space-x-2 py-2 px-2 ">

                {/* TOOLS */}
                <EmployeesListToolbar
                    operation="Add"
                    itemCount={itemCount}
                    apiLoading={apiLoading}
                    dataAPIError={dataAPIError}
                    manualLoadData={manualLoadData} />
                {/* TOOLS */}

            </div>

            <div
                className="ag-theme-quartz" // applying the Data Grid theme
                style={{ height: 500 }} // the Data Grid will fill the size of the parent container
            >
                <AgGridReact
                    rowData={data.data}
                    columnDefs={colDefs}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowClassRules={rowClassRules}
                    autoSizeStrategy={autoSizeStrategy}
                    gridOptions={gridOptions}
                />
            </div>

        </>
    )
}

export default EmployeesList;