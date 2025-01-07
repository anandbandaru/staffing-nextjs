import React from "react";
import { Stack } from "@mui/material";
import GenericList from "../forms/GenericList";

const Configuration = () => {

    return (
        <Stack spacing={2} direction={"row"}>
            <GenericList formType={'jobTypes'} />
            <GenericList formType={"employeeTypes"} />
            <GenericList formType={"dependentTypes"} />
            <GenericList formType={"visaTypes"} />
            <GenericList formType={"timesheetPeriods"} />
            <GenericList formType={"invoicePeriods"} />
            <GenericList formType={"GOOGLEDRIVE_FOLDERS"} />
        </Stack>
    )
}
export default Configuration;