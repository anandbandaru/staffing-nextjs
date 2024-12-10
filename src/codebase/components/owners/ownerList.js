import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import CachedIcon from '@mui/icons-material/Cached';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const OwnersList = () => {

    const [data, setData] = useState({ name: "test", value: [] });
    const [data_Original, setData_Original] = useState({ name: "test", value: [] });
    const [apiLoading, setApiLoading] = useState(false);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    const [itemCount, setItemCount] = useState(0);

    useEffect(() => {
        delaydMockLoading();
    }, []);

    function manualLoadData() {
        //delaydMockLoading();
        setApiLoading(true);
    }

    function delaydMockLoading() {
        setApiLoading(true);
        setItemCount(0);
        setDataAPIError("");
        setTimeout(() => {
            getOwnersList();
        }, 1);
    }

    const getOwnersList = () => {
        let apiUrl = "http://127.0.0.1:5000/getowners"
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
                        setItemCount(result.data.length);
                        setDataAPIError(result.data.length == 0 ? "No Owners information present." : "ok");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    setItemCount(0);
                    console.log("RequestData:On JUST error: API call failed")
                    setDataAPIError("RequestData:On JUST error: API call failed");
                    setApiLoading(false);
                }
            )
    }

    function searchBoxTextChange(event) {
        const textValue = event.target.value;
        console.log(textValue);
        if (textValue == "") {
            setData(data_Original);
        }
        else {
            if (itemCount == 0)
                return;

            const filteredData = data_Original.data.filter(ds => ds.firstName.toLowerCase().includes(textValue.toLowerCase()));
            const newVal = {
                filteredRows: filteredData.length,
                data: filteredData
            };
            setData(newVal);
        }
    }

    const CustomButtonComponent = (props) => {
        return <button onClick={() => window.alert('clicked')}>Push Me!</button>;
    };
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        { field: "Id" },
        { field: "firstName", filter: true },
        { field: "lastName", filter: true },
        {
            field: "email", filter: true, editable: true,
            cellClassRules: {
                // apply green to electric cars
                'rag-green': params => params.value === "sa.ke@aol.com",
            }
        },
        { field: "phone1", filter: true },
        { field: "button", cellRenderer: CustomButtonComponent }
    ]);
    const rowClassRules = {
        // apply red to Ford cars
        'rag-red': params => params.data.firstName === "anand",
    };
    const pagination = true;
    const paginationPageSize = 5;
    const paginationPageSizeSelector = [5, 10, 20, 50];

    return (
        <>

            <div className="w-full flex bg-kmcBG dark:bg-gray-700 text-sm justify-between place-items-center space-x-2 py-2 px-2 ">

                <div className="float-right flex flex-grow-0 bg-white text-black dark:bg-gray-500 dark:text-white text-sm py-1 px-3">
                    <span className="hidden lg:inline-block">Total Owners:</span>
                    <span className="font-bold text-sm ml-2">{itemCount}</span>
                </div>



                {/* TOOLS */}
                <div className="float-right flex flex-grow">
                    <div className="flex flex-grow items-center max-w-lg">
                        <Stack direction="row" spacing={2}>
                            <Button size="small" variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />}>
                                Add
                            </Button>
                        </Stack>
                    </div>
                </div>
                {/* TOOLS */}

                {/* API LOADER & MESSAGE */}
                {apiLoading ?
                    <>
                        <span className="text-white">loading...</span>
                    </> : <div className="text-s hidden lg:inline-block dark:text-white">
                        API Call Status:
                        <span className="bg-white px-2 rounded-sm mx-2 dark:bg-gray-400 dark:text-white">{dataAPIError}</span>
                    </div>}
                {/* API LOADER & MESSAGE */}

                {/* REFRESH ICON */}
                <div className="float-right ">
                    {itemCount == 0 ? null :
                        <>
                            <Button size="small" variant="contained"
                                onClick={manualLoadData}
                                disabled={apiLoading}
                            >
                                {apiLoading ? <div className="spinner"></div> :
                                    <>
                                        <CachedIcon className="mr-1" />
                                        Refresh now
                                    </>}

                            </Button>
                        </>
                    }
                </div>
                {/* REFRESH ICON */}

            </div>



            <div
                className="ag-theme-quartz" // applying the Data Grid theme
                style={{ height: 400 }} // the Data Grid will fill the size of the parent container
            >
                <AgGridReact
                    rowData={data.data}
                    columnDefs={colDefs}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowClassRules={rowClassRules}
                />
            </div>

        </>
    )
}

export default OwnersList;