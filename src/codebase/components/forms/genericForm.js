import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from "../../context/context";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import FormSlider from '../slider/formSlider';

function GenericForm({ entity, entityID, operation, fields, validationSchema, apiEndpoints }) {
    const { APIPath } = useContext(Context);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
    const [formSubmitionAPIError, setFormSubmitionAPIError] = useState(false);
    const [formSubmitionAPIErrorMessage, setFormSubmitionAPIErrorMessage] = useState("");
    const resetButtonRef = useRef(null);
    const [data, setData] = useState({});
    const [apiLoading, setApiLoading] = useState(true);
    const [apiLoadingError, setApiLoadingError] = useState(false);
    const [dataAPIError, setDataAPIError] = useState("");
    // Default width
    const [formWidth, setFormWidth] = useState(700);
    const handleSliderChange = (event, newValue) => {
        setFormWidth(newValue);
    };

    const getEntityDetails = () => {
        let apiUrl = `${APIPath}${apiEndpoints.getDetails}/${entityID}`;
        fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        })
            .then(response => response.json())
            .then(
                (result) => {
                    if (result.error) {
                        setDataAPIError(`${result.error.code} - ${result.error.message}`);
                        setData({});
                        setApiLoadingError(true);
                    } else {
                        setData(result);
                        setDataAPIError(result.total === 0 ? `No ${entity} information present.` : "ok");
                    }
                    setApiLoading(false);
                },
                (error) => {
                    setData({});
                    setDataAPIError("API call failed");
                    setApiLoading(false);
                    setApiLoadingError(true);
                }
            );
    };

    useEffect(() => {
        if (operation === "View" || operation === "Edit") {
            getEntityDetails();
        }
    }, [entityID]);

    return (
        <>
            {apiLoading && operation !== "New" ? (
                <div className="spinner"></div>
            ) : (
                <Formik
                    enableReinitialize
                    initialValues={fields.reduce((acc, field) => {
                        acc[field.name] = data.data ? data.data[0][field.name] : '';
                        return acc;
                    }, {})}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        const finalAPI = `${APIPath}${operation === "Edit" ? apiEndpoints.update : apiEndpoints.add}`;
                        setSubmitionCompleted(false);
                        setSubmitting(true);
                        axios.post(finalAPI, values, {
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json',
                                'ngrok-skip-browser-warning': 'true',
                            }
                        }).then((resp) => {
                            setSubmitionCompleted(true);
                            setFormSubmitionAPIError(false);
                            if (resetButtonRef.current) {
                                resetButtonRef.current.click();
                            }
                        }).catch((error) => {
                            setSubmitionCompleted(true);
                            setFormSubmitionAPIErrorMessage(error.message);
                            setFormSubmitionAPIError(true);
                        });
                    }}
                    validationSchema={Yup.object().shape(validationSchema)}
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
                            handleReset,
                        } = props;
                        return (
                            <form onSubmit={handleSubmit} style={{ maxWidth: `${formWidth}px`, margin: '0 auto' }}>
                                <FormSlider value={formWidth} onChange={handleSliderChange} />
                                {fields.map((field, index) => (
                                    <TextField
                                        key={index}
                                        size="small"
                                        margin="normal"
                                        fullWidth
                                        id={field.name}
                                        name={field.name}
                                        label={field.label}
                                        value={values[field.name]}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={(errors[field.name] && touched[field.name]) && errors[field.name]}
                                        select={field.type === 'select'}
                                        multiline={field.type === 'textarea'}
                                        rows={field.type === 'textarea' ? 4 : undefined}
                                    >
                                        {field.type === 'select' && field.options.map((option, idx) => (
                                            <MenuItem key={idx} value={option.value}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                ))}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="Disabled"
                                            name="Disabled"
                                            // value={values.Disabled.checked}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            // defaultChecked={(values.Disabled === undefined || values.Disabled === "") ? false : true}
                                            checked={values.checked}
                                        />
                                    }
                                    label="Disabled"
                                />
                                <Stack direction="row" spacing={2} className='float-right'>
                                    <div>
                                        {entityID}:{operation}
                                    </div>
                                    {operation === "Edit" ? (
                                        <Button color="primary" variant="contained" type="submit" disabled={isSubmitting && !isSubmitionCompleted}>
                                            <SaveOutlinedIcon className="mr-1" />
                                            Update
                                        </Button>
                                    ) : (
                                        <>
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
                                    )}
                                    {isSubmitionCompleted && !formSubmitionAPIError ? (
                                        <Chip label="Data saved" color="success" />
                                    ) : (
                                        formSubmitionAPIError && <Chip label={formSubmitionAPIErrorMessage} color="error" />
                                    )}
                                </Stack>
                            </form>
                        );
                    }}
                </Formik>
            )}
        </>
    );
}

export default GenericForm;