import * as yup from "yup";
export const generateSchema = (fields: any[]) => {
  const shape: Record<string, any> = {};

  fields.forEach((field) => {
    let validator;

    switch (field.validationType) {
      case "string":
        validator = yup.string();
        if (field.min) validator = validator.min(field.min, field.errorMessage?.min);
        if (field.max) validator = validator.max(field.max, field.errorMessage?.max);
        if (field.matches) validator = validator.matches(field.matches.regex, field.matches.message);
        break;
      case "number":
        validator = yup.number().typeError("Must be a number");
        break;
      case "boolean":
        validator = yup.boolean();
        break;
      case 'array':
        validator = yup
          .array()
          .of(yup.string())
          .min(1, 'Please select at least one Zone')
          .required('Zone is required')
        break;
        case 'contactNo':
          validator = yup
            .string()
            .required('Contact number is required')
            .matches(/^[6-9]\d{9}$/, 'Contact number must start with 6-9 and be 10 digits long');
          break;
        

      default:
        validator = yup.string();
    }

    if (field.isRequired) {
      validator = validator.required(field.errorMessage?.required || `Please enter ${field.label}`);
    }

    shape[field.name] = validator;
  });

  return yup.object().shape(shape);
};