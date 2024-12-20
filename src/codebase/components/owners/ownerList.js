import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import OwnersListToolbar from './ownersListToolbar'
import OwnerDetails from "./ownerDetails";
import OwnerEdit from "./ownerEdit";

const OwnersList = () => {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
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
            getList();
        }, 1);
    }

    const getList = () => {
        setData({ data: [] });
        let apiUrl = APIPath + "/getowners"
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
                        setDataAPIError(result.total == 0 ? "No Owners information present." : "ok");
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
                <OwnerDetails ID={props.data.Id} operation="View" doLoading={false} />
            </>
        );
    };
    const CustomEditComponent = (props) => {
        return (
            <>
                <OwnerEdit ID={props.data.Id} operation="Edit" manualLoadData={manualLoadData} />
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
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        {
            field: "", cellRenderer: CustomDetailsComponent, maxWidth: 50, resizable: false
        },
        { field: "Id", maxWidth: 50 },
        { field: "firstName", filter: true },
        { field: "lastName", filter: true },
        {
            field: "email", filter: true, editable: true,
            cellClassRules: {
                // apply green to electric cars
                'rag-green': params => params.value === "sa.ke@aol.com",
            },
            cellRenderer: CustomEmailRenderer
        },
        { field: "phone1", filter: true },
        {
            field: "Disabled", filter: false,
            // cellClassRules: {
            //     // apply green to electric cars
            //     'rag-green': params => params.value === null || params.value === false,
            //     'rag-red': params => params.value === true,
            // },
            cellRenderer: CustomDisabledRenderer
        },
        { field: "options", cellRenderer: CustomEditComponent, maxWidth: 150, resizable: false }
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
                <OwnersListToolbar
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

export default OwnersList;