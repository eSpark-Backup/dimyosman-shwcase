import * as Yup from 'yup'


export const registerSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(8, "Password must contain at least 8 characters"),
    conPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    fName: Yup.string().required("First name is required"),
    lName: Yup.string().required("First name is required")
});

export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(8, "Password must contain at least 8 characters"),
});