import React from "react";
import { Stack } from "@mui/material";
import GenericList from "../forms/GenericList";

const Configuration = () => {

    return (
        <Stack spacing={2} direction={"row"} className="flex-wrap">
            <GenericList formType={'jobTypes'} />
            <GenericList formType={"employeeTypes"} />
            <GenericList formType={"dependentTypes"} />
            <GenericList formType={"visaTypes"} />
            <GenericList formType={"timesheetsPeriods"} />
            <GenericList formType={"invoicePeriods"} />
            <GenericList formType={"GOOGLEDRIVE_FOLDERS"} />
            <GenericList formType={"expenseCategories"} />
            <GenericList formType={"currencyTypes"} />
        </Stack>
    )
}
export default Configuration;