import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import TodosListToolbar from './todosListToolbar'
import GenericDetails from "../forms/GenericDetails";
import TodoEdit from "./todoEdit";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CustomSnackbar from "../snackbar/snackbar";

const TodoList = () => {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [apiLoadingError, setApiLoadingError] = useState(false);
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
        let apiUrl = APIPath + "/gettodos"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setDataAPIError(result.error.code + " - " + result.error.message);
                        setData({});
                        setApiLoadingError(true);
                        setItemCount(0);
                    }
                    else {
                        setData(result);
                        setItemCount(result.total);
                        setDataAPIError(result.total === 0 ? "No To Dos information present." : "ok");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    setItemCount(0);
                    console.log("RequestData:On JUST error: API call failed")
                    setDataAPIError("RequestData:On JUST error: API call failed");
                    setApiLoading(false);
                    setApiLoadingError(true);
                }
            )
    }

    const CustomDetailsComponent = (props) => {
        return (
            <>
                <GenericDetails ID={props.data.Id} operation="View" doLoading={false} moduleName="TODOS" />
            </>
        );
    };
    const CustomEditComponent = (props) => {
        return (
            <>
                <TodoEdit ID={props.data.Id} operation="Edit" manualLoadData={manualLoadData} setApiLoading={setApiLoading} showSnackbar={showSnackbar} />
            </>
        );
    };
    const CustomCompletedRenderer = ({ value }) => (
        <span className={(value === null || !value) ? 'rag-red-bg badgeSpan' : 'rag-green-bg badgeSpan'}>
            {(value === null || !value) ? "NO" : "YES"}
        </span>
    );
    const CustomImportantRenderer = ({ value }) => (
        <span>
            {(value === null || !value) ? "" : <ErrorOutlineOutlinedIcon />}
        </span>
    );
    //ErrorOutlineOutlinedIcon
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState([
        {
            field: "", cellRenderer: CustomDetailsComponent, maxWidth: 50, resizable: false
        },
        { field: "Id", maxWidth: 50 },
        { field: "title", filter: true },
        { field: "createdDate", filter: true },
        {
            field: "completed", filter: false,
            // cellClassRules: {
            //     // apply green to electric cars
            //     'rag-red': params => params.value === null || params.value === false,
            //     'rag-green': params => params.value === true,
            // },
            cellRenderer: CustomCompletedRenderer
        },
        { field: "completedBy", filter: true },
        { field: "completedDate", filter: true },
        {
            field: "important", filter: false,
            cellClassRules: {
                // apply green to electric cars
                'rag-green': params => params.value === null || params.value === false,
                'rag-red': params => params.value === true,
            },
            cellRenderer: CustomImportantRenderer
        },
        { field: "options", cellRenderer: CustomEditComponent, maxWidth: 100, resizable: false }
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
        <CustomSnackbar
            open={snackbarOpen}
            handleClose={handleSnackbarClose}
            severity={snackbarSeverity}
            message={snackbarMessage}
        />
            <div className="w-full flex bg-kmcBG dark:bg-gray-700 text-sm justify-between place-items-center space-x-2 py-2 px-2 ">

                {/* TOOLS */}
                <TodosListToolbar
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
                    rowData={data.data}
                    columnDefs={colDefs}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowClassRules={rowClassRules}
                    autoSizeStrategy={autoSizeStrategy}
                />
            </div>

        </>
    )
}

export default TodoList;