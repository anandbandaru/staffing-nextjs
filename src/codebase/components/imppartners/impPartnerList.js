import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ImpPartnersListToolbar from './impPartnersListToolbar'
import ImpPartnerDetails from "./impPartnerDetails";
import ImpPartnerEdit from "./impPartnerEdit";

const ImpPartnerList = () => {
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
            getImpPartnersList();
        }, 1);
    }

    const getImpPartnersList = () => {
        setData({ data: [] });
        let apiUrl = APIPath + "/getimplementationpartners"
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
                        setDataAPIError(result.total == 0 ? "No Implementation Partners information present." : "ok");
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
                <ImpPartnerDetails ID={props.data.Id} operation="View" doLoading={false} />
            </>
        );
    };
    const CustomEditComponent = (props) => {
        return (
            <>
                <ImpPartnerEdit ID={props.data.Id} operation="Edit" manualLoadData={manualLoadData} setApiLoading={setApiLoading} />
            </>
        );
    };
    const CustomDisabledRenderer = ({ value }) => (
        <span>
            {(value === null || !value) ? "NO" : "YES"}
        </span>
    );
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        {
            field: "", cellRenderer: CustomDetailsComponent, maxWidth: 50, resizable: false
        },
        { field: "Id", maxWidth: 50 },
        { field: "Name", filter: true },
        { field: "Address" },
        { field: "Emails" },
        { field: "createdDate", filter: true },
        {
            field: "Disabled", filter: false,
            cellClassRules: {
                // apply green to electric cars
                'rag-green': params => params.value === null || params.value === false,
                'rag-red': params => params.value === true,
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
                <ImpPartnersListToolbar
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

export default ImpPartnerList;