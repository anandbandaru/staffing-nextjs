import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from "../../context/context";
import CustomSnackbar from "../snackbar/snackbar";
import FormSlider from '../slider/formSlider';
import { Button, Stack, TextField, CircularProgress } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import PayrollItem from './payrollItem';

function Payroll({ props, MMYYYY, operation }) {
    const { APIPath, userName } = useContext(Context);

    // State variables
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [name, setName] = useState('');
    const [apiLoading, setApiLoading] = useState(false);
    const [formWidth, setFormWidth] = useState(1400);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Get current month and year
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const currentYear = String(currentDate.getFullYear());

    const [months] = useState([
        { Id: "01", name: 'January' },
        { Id: "02", name: 'February' },
        { Id: "03", name: 'March' },
        { Id: "04", name: 'April' },
        { Id: "05", name: 'May' },
        { Id: "06", name: 'June' },
        { Id: "07", name: 'July' },
        { Id: "08", name: 'August' },
        { Id: "09", name: 'September' },
        { Id: "10", name: 'October' },
        { Id: "11", name: 'November' },
        { Id: "12", name: 'December' }
    ]);
    const [years] = useState([
        { Id: "2023", name: '2023' },
        { Id: "2024", name: '2024' },
        { Id: "2025", name: '2025' },
        { Id: "2026", name: '2026' },
        { Id: "2027", name: '2027' },
        { Id: "2028", name: '2028' },
        { Id: "2029", name: '2029' },
        { Id: "2030", name: '2030' },
        { Id: "2031", name: '2031' },
        { Id: "2032", name: '2032' },
        { Id: "2033", name: '2033' },
        { Id: "2034", name: '2034' },
        { Id: "2035", name: '2035' }
    ]);
    const [monthId, setMonthId] = useState(currentMonth); // Default to January
    const [yearId, setYearId] = useState(currentYear); // Default to 2023
    const [fetchedProperData, setFetchedProperData] = useState(false);
    const [fetchingData, setFetchingData] = useState(false); // For "Fetch" button loading state

    // Handlers
    const handleSnackbarClose = () => setSnackbarOpen(false);

    const showSnackbar = (severity, message) => {
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleSliderChange = (event, newValue) => {
        setFormWidth(newValue);
    };

    const handleMonthsIdChange = (event) => {
        setMonthId(event.target.value);
        setFetchedProperData(false);
    };

    const handleYearsTypeIdChange = (event) => {
        setYearId(event.target.value);
        setFetchedProperData(false);
    };

    const getDataForMMYYYY = async () => {
        if (!monthId || !yearId) {
            showSnackbar('error', 'Please select both Month and Year.');
            return;
        }

        setFetchingData(true);
        setApiLoading(true);
        setFetchedProperData(true);

        try {
            const apiUrl = `${APIPath}/getpayrollsbymmyyyy/${monthId}${yearId}`;
            const response = await fetch(apiUrl, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                }
            });
            const result = await response.json();

            if (result.error) {
                setData({ data: [] });
                showSnackbar('error', 'Failed to fetch data.');
            } else {
                setData(result);
                showSnackbar('success', 'Data fetched successfully.');
            }
        } catch (error) {
            setData({ data: [] });
            showSnackbar('error', 'An error occurred while fetching data.');
        } finally {
            setFetchingData(false);
            setApiLoading(false);
        }
    };

    const [employeesData, setEmployeesData] = useState({ data: [] });
    const getEmployeesList = async () => {
        setApiLoading(true);
        setEmployeesData({ data: [] });
        let apiUrl = APIPath + "/getemployees"
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                async (result) => {
                    if (result.error) {
                        // console.log("RequestData:On error return: setting empty")
                        setEmployeesData({ data: [] });
                    }
                    else {
                        setEmployeesData(result);
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setEmployeesData({ data: [] });
                    // console.log("RequestData:On JUST error: API call failed")
                    setApiLoading(false);
                }
            )
    }

    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getDataForMMYYYY();
        } else if (operation === "New") {
            setApiLoading(false);
            getEmployeesList();
        }
    }, []);

    return (
        <>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
            {apiLoading ? (
                <>
                    <div className="spinner"></div>Loading data from database....
                </>
            ) : (
                <div style={{ maxWidth: `${formWidth}px`, margin: '0 auto' }}>
                    {/* <FormSlider value={formWidth} onChange={handleSliderChange} /> */}

                    <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                        <Stack direction="row" spacing={2} sx={{ width: '300px' }}>
                            <TextField
                                size="small"
                                margin="normal"
                                fullWidth
                                id="MM"
                                name="MM"
                                select
                                label="MM"
                                value={monthId}
                                onChange={(event) => {
                                    handleMonthsIdChange(event);
                                }}
                            >
                                {months.map((item, index) => (
                                    <MenuItem key={index} value={item.Id}>
                                        {item.Id} - {item.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                size="small"
                                margin="normal"
                                fullWidth
                                id="YYYY"
                                name="YYYY"
                                select
                                label="YYYY"
                                value={yearId}
                                onChange={(event) => {
                                    handleYearsTypeIdChange(event);
                                }}
                            >
                                {years.map((item, index) => (
                                    <MenuItem key={index} value={item.Id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                color="primary"
                                variant="contained"
                                type="button"
                                size="small"
                                s onClick={getDataForMMYYYY}
                                disabled={fetchingData}
                            >
                                {fetchingData ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    <>
                                        <KeyboardDoubleArrowRightIcon className="mr-1" />
                                        Fetch
                                    </>
                                )}
                            </Button>
                        </Stack>
                        <div className='divBottomBorder'></div>
                        {fetchedProperData && employeesData.data.length > 0 && (
                            employeesData.data.map((employee, index) => (
                                <PayrollItem
                                    key={index}
                                    index={index}
                                    MM_YYYY={`${monthId}${yearId}`}
                                    operation={operation}
                                    empID={employee.Id}
                                    empName={employee.firstName + " " + employee.lastName}
                                    empDisabled={employee.disabled}
                                />
                            ))
                        )}
                    </Stack>
                </div>
            )}
        </>
    );
}

export default Payroll;