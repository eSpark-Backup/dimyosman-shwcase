import * as Yup from "yup";

export const registerSchema = Yup.object({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must contain at least 8 characters"),
  conPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  fName: Yup.string()
    .required("First name is required")
    .matches(/^[a-zA-Z]+$/, "First name must only contain letters")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),
  lName: Yup.string()
    .required("Last name is required")
    .matches(/^[a-zA-Z]+$/, "Last name must only contain letters")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("Email is required"),
  password: Yup.string()
    .required("  Password is required")
    .min(8, "Password must contain at least 8 characters"),
});

export const nameSchema = Yup.object({
  fName: Yup.reach(registerSchema, "fName"),
  lName: Yup.reach(registerSchema, "lName"),
});
export const emailSchema = Yup.object({
  email: Yup.reach(registerSchema, "email"),
});
export const passwordSchema = Yup.object({
  oldPassword: Yup.string()
    .required("Old password is required")
    .min(8, "Old password must contain at least 8 characters"),
  password: Yup.reach(registerSchema, "password"), 
  conPassword: Yup.reach(registerSchema, "conPassword"), 
});

export const resetPasswordSchema = Yup.object({
  password: Yup.reach(registerSchema, "password"), 
  conPassword: Yup.reach(registerSchema, "conPassword"), 
})

export const imageValidationSchema = Yup.object().shape({
  image: Yup.mixed()
    .required("Image is required")
    .test("fileFormat", "Unsupported file format", (value) => {
      return value && value.type.startsWith("image/");
    })
    .test("fileSize", "File size is too large. Max size is 5MB", (value) => {
      return value && value.size <= MAX_SIZE;
    }),
});