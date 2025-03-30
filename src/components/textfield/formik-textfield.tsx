import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";

interface FormikTextfieldProps extends Omit<TextFieldProps, "name"> {
  name: string;
}

const FormikTextfield: React.FC<FormikTextfieldProps> = ({ name, label, ...props }) => {
  const [field, meta] = useField(name);
  const error = meta.touched && meta.error;

  return (
    <TextField
      {...field}
      {...props}
      label={label}
      error={!!error}
      helperText={meta.touched && meta.error ? meta.error : ""}
    />
  );
};
export default FormikTextfield;
