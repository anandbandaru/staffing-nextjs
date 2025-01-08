import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import FilesListToolbar from './filesListToolbar'
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import { Button, Link } from '@mui/material';

const FileList = () => {
    const { APIPath } = useContext(Context);
    const [data, setData] = useState({ data: [] });
    const [apiLoading, setApiLoading] = useState(false);
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
        setTimeout(() => {
            getList();
        }, 1);
    }

    const getList = () => {
        setData({ data: [] });
        let apiUrl = APIPath + "/getfiles"
        fetch(apiUrl)
            .then(response => response.json())
            .then(
                (result) => {
                    //console.log(result);
                    if (result.error) {
                        console.log("RequestData:On error return: setting empty")
                        setData({});
                        setItemCount(0);
                    }
                    else {
                        setData(result);
                        setItemCount(result.total);
                        setDataAPIError("");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setDataAPIError(error.toString());
                    setData({});
                    setItemCount(0);
                    console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }
    const CustomLinkRenderer = ({ value }) => (
        <span>
            <Link className='float-right'
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
            >
                <Button
                    size='small'
                    variant="contained"
                    color="info"
                    startIcon={<InsertLinkOutlinedIcon />}
                >
                    Open
                </Button>
            </Link>
        </span>
    );
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState([
        { field: "Id", maxWidth: 50 },
        { field: "module", filter: true },
        { field: "moduleId", },
        { field: "title", filter: true },
        { field: "createdDate", filter: true },
        { field: "notes", },
        {
            field: "gDriveLink",
            cellRenderer: CustomLinkRenderer
        },
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
                <FilesListToolbar
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

export default FileList;