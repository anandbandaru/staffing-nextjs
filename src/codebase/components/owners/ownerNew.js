import React, { useState } from "react";
import { useFormik, Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IDTypes from "../staticdata/idtypes";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Select, InputLabel, FormControl, FormHelperText } from '@mui/material';

const validationSchema = yup.object({
    firstName: yup
        .string('Enter first name')
        .min(2, 'Should be of minimum 2 characters length')
        .required('First Name is required'),
    lastName: yup
        .string('Enter last Name')
        .min(2, 'Should be of minimum 2 characters length')
        .required('Last Name is required'),
    email: yup
        .string('Enter email')
        .email('Enter a valid email')
        .required('Email is required'),
    phone1: yup
        .string('Enter phone 1')
        .min(10, 'Should be of minimum 10 characters length')
        .required('Password is required'),
    phone2: yup
        .string('Enter phone 2'),
    IDType: yup
        .string('Select ID Type')
        .required('ID Type is required'),
    IDNumber: yup
        .string('Enter ID Number')
        .min(4, 'Should be of minimum 4 characters length')
        .required('ID Number is required'),
    SSN: yup
        .string('Enter SSN')
        .min(8, 'Should be of minimum 8 characters length')
        .required('SSn is required'),
    Address: yup
        .string('Enter Address')
        .min(8, 'Should be of minimum 8 characters length')
        .required('Address is required'),
});

const OwnerNew = () => {
    return (
      <Formik
        initialValues={{ firstName: '' }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="firstName">
              {({ field }) => (
                <TextField {...field} label="firstName" variant="outlined" />
              )}
            </Field>
            <Button type="submit" disabled={isSubmitting} variant="contained">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    );
  };

const OwnerNew1 = () => {

    const [apiLoading, setApiLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    size="small"
                    margin="normal"
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                />
                <TextField
                    size="small"
                    margin="normal"
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                />
                <TextField
                    size="small"
                    margin="normal"
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    size="small"
                    margin="normal"
                    fullWidth
                    id="phone1"
                    name="phone1"
                    label="Phone 1"
                    value={formik.values.phone1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone1 && Boolean(formik.errors.phone1)}
                    helperText={formik.touched.phone1 && formik.errors.phone1}
                />
                <TextField
                    size="small"
                    margin="normal"
                    fullWidth
                    id="phone2"
                    name="phone2"
                    label="Phone 2"
                    value={formik.values.phone2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone2 && Boolean(formik.errors.phone2)}
                    helperText={formik.touched.phone2 && formik.errors.phone2}
                />
                <TextField
                    size="small"
                    margin="normal"
                    fullWidth
                    id="IDType"
                    name="IDType"
                    select
                    label="ID Type"
                    value={formik.values.IDType}
                    defaultValue="SSN"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.IDType && Boolean(formik.errors.IDType)}
                    helperText={formik.touched.IDType && formik.errors.IDType}
                >
                    {IDTypes.map((item, index) => (
                        <MenuItem key={index} value={item.name}>
                            {item.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    size="small"
                    margin="normal"
                    fullWidth
                    id="IDNumber"
                    name="IDNumber"
                    label="ID Number"
                    value={formik.values.IDNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.IDNumber && Boolean(formik.errors.IDNumber)}
                    helperText={formik.touched.IDNumber && formik.errors.IDNumber}
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
                    value={formik.values.Address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Address && Boolean(formik.errors.Address)}
                    helperText={formik.touched.Address && formik.errors.Address}
                />
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="secondary" disabled={apiLoading}>Cancel</Button>
                    <Button color="primary" variant="contained" fullWidth type="submit" disabled={apiLoading}>
                        {apiLoading ? <div className="spinner"></div> :
                            <>
                                <SaveOutlinedIcon className="mr-1" />
                                Save
                            </>}
                    </Button>
                </Stack>


            </form>
        </div>
    );

}

export default OwnerNew;