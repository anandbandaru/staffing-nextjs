import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

function CompanyForm({ props, ID, operation }) {
    const { APIPath } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const [formSubmitionAPIError, setFormSubmitionAPIError] = useState(false);
    const [formSubmitionAPIErrorMessage, setFormSubmitionAPIErrorMessage] = useState("");
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({ data: [] });
    const [itemToCheck, setItemToCheck] = useState('');
    const [apiLoading, setApiLoading] = useState(true);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");

    const getDetails = () => {
        let apiUrl = APIPath + "/getcompanydetails/" + ID;
        console.log(apiUrl)
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
                    }
                    else {
                        setData(result);
                        setItemToCheck(result.data[0].Name);
                        //alert(firstName);
                        setDataAPIError(result.total === 0 ? "No Implementation Partners information present." : "ok");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    console.log("RequestData:On JUST error: API call failed")
                    setDataAPIError("RequestData:On JUST error: API call failed");
                    setApiLoading(false);
                    setApiLoadingError(true);
                }
            )
    }
    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getDetails();
        }
    }, []);

    const formatDate = (dateString) => {
        const apiDate = dateString;
        const date = new Date(apiDate);
        const formatted = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        console.log("FORMATTED DATE:" + formatted)
        return formatted;
    }

    return (
        <>
            {apiLoading && operation !== "New" ?
                <>
                    <div className="spinner"></div>
                </>
                :
                <Formik
                    enableReinitialize
                    initialValues={{
                        Id: itemToCheck ? ID : 'This will be auto-generated once you save',
                        Name: itemToCheck ? data.data[0].Name : '',
                        Description: itemToCheck ? data.data[0].Description : '',
                        Address: itemToCheck ? data.data[0].Address : '',
                        EIN: itemToCheck ? data.data[0].EIN : '',
                        Phone: itemToCheck ? data.data[0].Phone : '',
                        Email: itemToCheck ? data.data[0].Email : '',
                        EstablishedDate: itemToCheck ? formatDate(data.data[0].EstablishedDate) : '',
                        Notes: itemToCheck ? data.data[0].Notes : '',
                        Disabled: itemToCheck ? data.data[0].Disabled : false,
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        var finalAPI = APIPath + "/addcompany";
                        if (operation === "Edit") {
                            finalAPI = APIPath + "/updatecompany";
                        }
                        setSubmitionCompleted(false);
                        setSubmitting(true);
                        axios.post(finalAPI,
                            values,
                            {
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                    'Content-Type': 'application/json',
                                }
                            },
                        ).then((resp) => {
                            setSubmitionCompleted(true);
                            setFormSubmitionAPIError(false);
                        })
                            .catch(function (error) {
                                console.log(error);
                                setSubmitionCompleted(true);
                                setFormSubmitionAPIErrorMessage(error);
                                setFormSubmitionAPIError(true);
                            });
                    }}

                    validationSchema={Yup.object().shape({
                        Name: Yup.string()
                            .required('Required'),
                        Description: Yup.string()
                            .required('Required'),
                        Address: Yup.string()
                            .required('Required'),
                        EIN: Yup.string()
                            .required('Required'),
                        Phone: Yup.string()
                            .required('Required'),
                        Email: Yup.string()
                            .email()
                            .required('Required'),
                        EstablishedDate: Yup.string()
                            .required('Required'),
                        Notes: Yup.string()
                            .required('Required'),
                    })}
                >
                    {(props) => {
                        const {
                            values,
                            touched,
                            errors,
                            dirty,
                            isSubmitting,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            handleReset
                        } = props;
                        return (
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Id"
                                    name="Id"
                                    label="Id"
                                    disabled
                                    value={values.Id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Name"
                                    name="Name"
                                    label="Name"
                                    value={values.Name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Name && touched.Name) && errors.Name}
                                />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Description"
                                    name="Description"
                                    label="Description"
                                    multiline
                                    rows={4}
                                    value={values.Description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Description && touched.Description) && errors.Description}
                                />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Address"
                                    name="Address"
                                    label="Address"
                                    multiline
                                    rows={4}
                                    value={values.Address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Address && touched.Address) && errors.Address}
                                />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="EIN"
                                    name="EIN"
                                    label="EIN"
                                    value={values.EIN}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.EIN && touched.EIN) && errors.EIN}
                                />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Phone"
                                    name="Phone"
                                    label="Phone"
                                    value={values.Phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Phone && touched.Phone) && errors.Phone}
                                />
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Email"
                                    name="Email"
                                    label="Email"
                                    value={values.Email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Email && touched.Email) && errors.Email}
                                />
                                <Stack direction="row" spacing={2} className='flex items-center pl-2'>
                                    <div className='flex-1'>Established Date:
                                        <span className='px-2 bg-gray-500 mx-2 text-white'>{values.EstablishedDate}</span>
                                    </div>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        className='flex-1'
                                        id="EstablishedDate"
                                        name="EstablishedDate"
                                        type="date"
                                        value={values.EstablishedDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors.EstablishedDate && touched.EstablishedDate) && errors.EstablishedDate}
                                    />
                                </Stack>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    fullWidth
                                    id="Notes"
                                    name="Notes"
                                    label="Notes"
                                    multiline
                                    rows={4}
                                    value={values.Notes}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.Notes && touched.Notes) && errors.Notes}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="Disabled"
                                            name="Disabled"
                                            label="Disabled"
                                            // value={values.Disabled}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            // helperText={(errors.Disabled && touched.Disabled) && errors.Disabled}
                                            checked={values.Disabled} />
                                    }
                                    label="Disabled"
                                />
                                <Stack direction="row" spacing={2} className='float-right'>
                                    <div>
                                        {ID}:{operation}
                                    </div>
                                    {operation === "Edit" ?
                                        <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                            <SaveOutlinedIcon className="mr-1" />
                                            Update
                                        </Button>
                                        : <>
                                            <Button
                                                ref={resetButtonRef}
                                                variant="outlined"
                                                color="warning"
                                                onClick={handleReset}
                                                disabled={!dirty || isSubmitting && !isSubmitionCompleted}
                                            >
                                                Reset
                                            </Button>
                                            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                                <SaveOutlinedIcon className="mr-1" />
                                                Save
                                            </Button>
                                        </>
                                    }
                                    {isSubmitionCompleted && !formSubmitionAPIError ?
                                        <Chip label="Data saved" color="success" />
                                        :
                                        <>
                                            {formSubmitionAPIError ?
                                                <Chip label={formSubmitionAPIErrorMessage} color="error" />
                                                : <></>}
                                        </>
                                    }
                                </Stack>
                            </form>
                        );
                    }}
                </Formik>
            }

        </>
    );
}

export default CompanyForm;