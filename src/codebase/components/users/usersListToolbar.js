import React from "react";
import 'reactjs-popup/dist/index.css';
import Button from '@mui/material/Button';
import { Link } from "@mui/material";
import Stack from '@mui/material/Stack';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import CachedIcon from '@mui/icons-material/Cached';

const UsersListToolbar = ({ operation, itemCount, apiLoading, apiLoadingError, dataAPIError, manualLoadData }) => {
    return (
        <>
            <div className="flex flex-grow">
                <div className="flex flex-grow items-center place-items-center">
                    <Stack direction="row" spacing={1} className="place-items-center">
                        <div className="flex flex-grow-0 bg-gray-500 text-white text-sm py-2 px-3">
                            <span className="">Total:</span>
                            <span className="font-bold text-sm ml-2">{itemCount}</span>
                        </div>
                        <Link target="_blank" rel="noopener noreferrer"
                            href="https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers" underline="none">
                            <Button size="small" variant="contained" startIcon={<ManageAccountsOutlinedIcon />} >
                                Manage Users in Azure
                            </Button>
                        </Link>
                        {/* https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers */}

                        {/* REFRESH ICON */}
                        <div className="float-right ">
                            {itemCount === 0 ? null :
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
                        {/* API LOADER & MESSAGE */}
                        {apiLoading ?
                            <>
                                <span className="text-white">loading...</span>
                            </> : <div className="text-s hidden lg:inline-block dark:text-white">
                                API Call Status:
                                {apiLoadingError ?
                                    <span className="bg-red-600 px-2 rounded-sm mx-2">{dataAPIError}</span>
                                    :
                                    <span className="bg-green-500 text-black px-2 rounded-sm mx-2">{dataAPIError}</span>
                                }
                            </div>}
                        {/* API LOADER & MESSAGE */}
                    </Stack>
                </div>
            </div>
        </>
    )
}

export default UsersListToolbar;