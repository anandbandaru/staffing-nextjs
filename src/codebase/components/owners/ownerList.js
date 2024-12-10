import React, { useState, useEffect } from "react";
import { Table } from "../table/table";

const OwnersList = () => {

  const [pbiDatasetsData_FailedList, setPbiDatasetsData_FailedList] = useState({ name: "test", value: [] });
  const [pbiDatasetsData, setPbiDatasetsData] = useState({ name: "test", value: [] });
  const [pbiDatasetsData_Original, setPbiDatasetsData_Original] = useState({ name: "test", value: [] });
  const [apiLoading, setApiLoading] = useState(false);
  const [apiLoadingError, setApiLoadingError] = useState(false);
  const [pbiDatasetsDataAPIError, setPbiDatasetsDataAPIError] = useState("");
  const [itemCount, setItemCount] = useState(0);
  let erroredDS = 0;
  let normalDS = 0;


  useEffect(() => {
    delaydMockLoading();
  }, []);

  function delaydMockLoadingButton() {
    callSingleWS();
  }

  function delaydMockLoading(workspaceID, allWorkspaces) {
    setApiLoading(true);
    setItemCount(0);
    setPbiDatasetsDataAPIError("");
    setTimeout(() => {
        callSingleWS();
    }, 1);
  }

  const callSingleWS = () => {
    let apiUrl = "http://127.0.0.1:5000/getowners"
    fetch(apiUrl)
      .then(response => response.json())
      .then(
        (result) => {
          //console.log(result);
          if (result.error) {
            console.log("RequestPBIDatasetsData:On error return: setting empty")
            setPbiDatasetsDataAPIError(result.error.code + " - " + result.error.message);
            setPbiDatasetsData({});
            setApiLoadingError(true);
            setItemCount(0);
          }
          else {
            setPbiDatasetsData(result);
            setPbiDatasetsData_Original(result);
            setItemCount(result.data.length);
            setPbiDatasetsDataAPIError(result.data.length == 0 ? "No Owners information present." : "ok");
          }
          setApiLoading(false);
        },
        (error) => {
          setPbiDatasetsData({});
          setItemCount(0);
          console.log("RequestPBIDatasetsData:On JUST error: API call failed")
          setPbiDatasetsDataAPIError("RequestPBIDatasetsData:On JUST error: API call failed");
          setApiLoading(false);
        }
      )
  }

  const handleOptionsClick = () => {
    console.log('clicked');
  };

  function searchBoxTextChange(event) {
    const textValue = event.target.value;
    console.log(textValue);
    if (textValue == "") {
        setPbiDatasetsData(pbiDatasetsData_Original);
    }
    else {
      if (itemCount == 0)
        return;

      const filteredPbiDatasetsData = pbiDatasetsData_Original.data.filter(ds => ds.firstName.toLowerCase().includes(textValue.toLowerCase()));
        const newVal = {
          something: 1,
          value: filteredPbiDatasetsData
        };
        setPbiDatasetsData(newVal);
    }
  }

  const columns_regular = [
    {
      name: 'Owner ID',
      selector: row => row.Id,
      sortable: true,
      cell: (row) => {
        return (
          <a
            className="text-blue-600 flex justify-center place-items-center space-x-1"
            href={row.webUrl}
            target='_blank'
          >
            <span>{row.Id}</span>
            {/* <ExternalLinkIcon className="h-3" /> */}
          </a>
        );
      },
    },
    {
      name: 'First Name',
      selector: row => row.firstName,
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: row => row.lastName,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Phone 1',
      selector: row => row.phone1,
      sortable: true,
    },
    {
      name: 'Is Refreshable',
      selector: row => row.isRefreshable,
      sortable: true,
    //   maxWidth: '100px',
      cell: (row) => {
        return (
          <div className="text-gray-700" data-tag="allowRowEvents">
            <div className="">{row.isRefreshable ?
              <span className="bg-green-400 px-1 rounded-sm text-xs text-black">YES</span>
              :
              <span className="bg-gray-400 px-1 rounded-sm text-xs text-white">NO</span>
            }</div>
          </div>
        );
      },
    },
  ];


  return (
    <>

      <div className="w-full flex bg-kmcBG dark:bg-gray-700 text-sm justify-between place-items-center space-x-2 py-2 px-2 ">

        <div className="float-right flex flex-grow-0 bg-white text-black dark:bg-gray-500 dark:text-white text-sm py-1 px-3">
          <span className="hidden lg:inline-block">Total Owners:</span>
          <span className="font-bold text-sm ml-2">{itemCount}</span>
        </div>

        {/* REFRESH ICON */}
        <div className="float-right flex">
          {itemCount == 0 ? null :
            <button type="button"
              className="flex justify-center place-items-center hover:bg-kmcBGHover p-1 dark:text-white dark:hover:text-gray-200"
              onClick={delaydMockLoadingButton}>
              {/* <RefreshIcon className={`${apiLoading ? "animate-spin" : ""} h-4 w-4 mr-1`} /> */}
              <span className="hidden lg:inline-block">Refresh now</span>
            </button>
          }
        </div>
        {/* REFRESH ICON */}

        {/* SEARCH BOX */}
        <div className="float-right flex flex-grow">
          <div className="flex flex-grow items-center max-w-lg">
            <input className="appearance-none bg-white border-none max-w-sm w-full flex flex-grow text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text" placeholder="search by dataset name"
              aria-label="Dataset name"
              disabled={itemCount == 0 ? true : false}
              onChange={searchBoxTextChange} />
            {/* <SearchIcon className="h-4 -ml-10" /> */}
          </div>
        </div>
        {/* SEARCH BOX */}

        {/* API LOADER & MESSAGE */}
        {apiLoading ?
          <><button type="button" className="place-self-center " disabled>
            {/* <RefreshIcon className="animate-spin h-4 w-4 mr-1" /> */}
          </button>
          </> : <div className="text-xs hidden lg:inline-block dark:text-white">
            API Call Status:
            <span className="bg-white px-2 rounded-sm mx-2 dark:bg-gray-400 dark:text-white">{pbiDatasetsDataAPIError}</span>
          </div>}
        {/* API LOADER & MESSAGE */}

      </div>

      <main className="fourth-step ">
      <Table
              data={pbiDatasetsData.data}
              columns={columns_regular}
            //   ExpandedComponent={PBIDatasetInner}
              progressPending={apiLoading}
              isExpandableRowsEnabled={true}
              customStylesName={"MainStyle_dark"}
              isPaginationEnabled={true}
              // isPaginationEnabled={isdisplayAll ? false : true}
              isFixedHeader={false}
              noMessage=
              {!apiLoadingError ?
                <div className="text-sm bg-APICallError w-full p-1">
                  <div className="flex w-full justify-items-center place-items-center space-x-2 text-xs text-black">
                    <span>{pbiDatasetsDataAPIError}</span>
                  </div>
                </div>
                :
                <span className="bg-APICallError w-full p-1 text-xs">No Owners information present.</span>
              }
            />
      </main>
    </>
  )
}

export default OwnersList;