import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExpensesListToolbar from './expensesListToolbar'
import GenericDetails from "../forms/GenericDetails";
import ExpenseEdit from "./expenseEdit";
import CustomSnackbar from "../snackbar/snackbar";

const ExpenseList = () => {
    const { APIPath, setRefreshBalance, refreshBalance } = useContext(Context);
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
        setRefreshBalance(!refreshBalance);
        delaydMockLoading();
    }

    function delaydMockLoading() {
        setApiLoading(true);
        setItemCount(0);
        setTimeout(() => {
            getList();
        }, 1);
    }

    const getList = () => {
        setData({ data: [] });
        let apiUrl = APIPath + "/getexpenses"
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
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
                            showSnackbar('success', "Expenses Data fetched");
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
                <GenericDetails ID={props.data.Id} operation="View" doLoading={false} moduleName="EXPENSES" />
            </>
        );
    };
    const CustomEditComponent = (props) => {
        return (
            <>
                <ExpenseEdit ID={props.data.Id} operation="Edit" manualLoadData={manualLoadData} setApiLoading={setApiLoading} showSnackbar={showSnackbar} />
            </>
        );
    };
    const CustomAmountComponent = (props) => {
        return (
            <>
                {props.data.currencyType === 'USD' ?
                    <span className="rag-blue-bg badgeSpan">$ </span> :
                    <span className="rag-gray-bg badgeSpan">₹ </span>
                }<span className="ml-4">{props.data.currencyType} {props.value}</span>
            </>
        );
    };
    const CustomCategoryComponent = (props) => {
        return (
            <>
                {props.data.category === 'Company' ?
                    <span className="rag-blue-bg badgeSpan">{props.value}</span> :
                    props.data.category === 'Employee' ?
                        <span className="rag-gray-bg badgeSpan">{props.value}</span> :
                        <span className="rag-red-bg badgeSpan">{props.value}</span>
                }
            </>
        );
    };
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState([
        {
            field: "", cellRenderer: CustomDetailsComponent, maxWidth: 50, resizable: false
        },
        { field: "Id", maxWidth: 50 },
        { field: "expenseDate", filter: true },
        { field: "expenseTypeName", filter: true },
        {
            field: "amount", filter: true, cellRenderer: CustomAmountComponent
        },
        { field: "category", filter: true, cellRenderer: CustomCategoryComponent, maxWidth: 100 },
        { field: "companyName", filter: true },
        { field: "employeeName", filter: true },
        { field: "createdDate", filter: true, maxWidth: 120 },
        { field: "jobId", filter: true, maxWidth: 80 },
        { field: "jobName", filter: true },
        { field: "jobTitle", filter: true },
        { field: "jobRate", filter: true, maxWidth: 100 },
        { field: "jobHoursDeducted", filter: true, maxWidth: 150 },
        { field: "options", cellRenderer: CustomEditComponent, maxWidth: 150, resizable: false, pinned: 'right', cellStyle: { backgroundColor: '#b7bfcf' } }
    ]);
    const rowClassRules = {
        // apply red to Ford cars
        //'rag-red': params => params.data.firstName === "anand",
    };
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [5, 10, 20, 50];
    const autoSizeStrategy = {
        //type: 'fitGridWidth',
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
                <ExpensesListToolbar
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
                />
            </div>
        </>
    )
}

export default ExpenseList;