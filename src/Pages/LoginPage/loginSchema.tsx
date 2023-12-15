import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;


// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

export const loginSchema = yup.object().shape({
  login__email: yup.string().email("Please enter a valid email").required("email is required"),
  login__password: yup
    .string()
    .required()
    .min(5, "password must be atleast 5 characters")
    .matches(passwordRules, { message: "min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit" })
    .required("password is required")
});

