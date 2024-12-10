import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {
    Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
// import { DisplayFormikState } from './formikHelper';
import axios from 'axios';

const styles = {

};

const contactFormEndpoint = process.env.REACT_APP_CONTACT_ENDPOINT;


function Contact(props) {
    const { classes } = props;
    const [open, setOpen] = useState(false);
    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);

    function handleClose() {
        setOpen(false);
    }

    function handleClickOpen() {
        setSubmitionCompleted(false);
        setOpen(true);
    }

    return (
        <React.Fragment>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Contact us!
            </Button>

            <Formik
                initialValues={{ email: '', name: '', comment: '' }}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true);
                    axios.post("http://127.0.0.1:3000/submitOwner",
                        values,
                        {
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json',
                            }
                        },
                    ).then((resp) => {
                        setSubmitionCompleted(true);
                    }
                    );
                }}

                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email()
                        .required('Required'),
                    name: Yup.string()
                        .required('Required'),
                    comment: Yup.string()
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
                        handleReset,
                    } = props;
                    return (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="name"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.name && touched.name) && errors.name}
                                margin="normal"
                            />

                            <TextField
                                error={errors.email && touched.email}
                                label="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.email && touched.email) && errors.email}
                                margin="normal"
                            />

                            <TextField
                                label="comment"
                                name="comment"
                                value={values.comment}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.comment && touched.comment) && errors.comment}
                                margin="normal"
                            />
                            <Button
                                type="button"
                                className="outline"
                                onClick={handleReset}
                                disabled={!dirty || isSubmitting}
                            >
                                Reset
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                Submit
                            </Button>
                        </form>
                    );
                }}
            </Formik>


        </React.Fragment >
    );
}

export default Contact;