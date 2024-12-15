import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import CompaniesListToolbar from './companiesListToolbar'
// import OwnerDetails from "./ownerDetails";
// import OwnerEdit from "./ownerEdit";

const CompaniesList = () => {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [data_Original, setData_Original] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    const [itemCount, setItemCount] = useState(0);

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
            getCompaniesList();
        }, 1);
    }

    const getCompaniesList = () => {
        setData({ data: [] });
        let apiUrl = APIPath + "/getcompanies"
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
                        setData_Original(result);
                        setItemCount(result.total);
                        setDataAPIError(result.total == 0 ? "No Companies information present." : "ok");
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

    function searchBoxTextChange(event) {
        const textValue = event.target.value;
        console.log(textValue);
        if (textValue === "") {
            setData(data_Original);
        }
        else {
            if (itemCount === 0)
                return;

            const filteredData = data_Original.data.filter(ds => ds.Name.toLowerCase().includes(textValue.toLowerCase()));
            const newVal = {
                filteredRows: filteredData.length,
                data: filteredData
            };
            setData(newVal);
        }
    }

    const CustomDetailsComponent = (props) => {
        return (
            <>
                {/* <CompanyDetails ownerID={props.data.Id} operation="View" /> */}
            </>
        );
    };
    const CustomEditComponent = (props) => {
        return (
            <>
                {/* <CompanyEdit ownerID={props.data.Id} operation="Edit" /> */}
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
        <span>
            {value === null ? "NO" : "YES"}
        </span>
    );
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        {
            field: "", cellRenderer: CustomDetailsComponent, maxWidth: 50, resizable: false
        },
        { field: "Id", maxWidth: 50 },
        { field: "Name", filter: true },
        { field: "Phone", filter: true },
        {
            field: "email", filter: true, editable: true,
            cellClassRules: {
                // apply green to electric cars
                'rag-green': params => params.value === "sa.ke@aol.com",
            },
            cellRenderer: CustomEmailRenderer
        },
        { field: "EstablishedDate", filter: true },
        {
            field: "Disabled", filter: false,
            cellClassRules: {
                // apply green to electric cars
                'rag-green': params => params.value === null,
                'rag-red': params => params.value !== null,
            },
            cellRenderer: CustomDisabledRenderer
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
            <div className="w-full flex bg-kmcBG dark:bg-gray-700 text-sm justify-between place-items-center space-x-2 py-2 px-2 ">

                {/* TOOLS */}
                <CompaniesListToolbar
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

export default CompaniesList;