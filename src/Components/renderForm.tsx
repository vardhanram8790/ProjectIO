import {
  Typography,
  TextField,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  MenuItem,
  Select,
  Switch,
  Stack,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

export const renderLabel = (label: string, isRequired?: boolean) => (
  <Typography variant="subtitle2" mb={0.5}>
    {label}
    {isRequired && <span style={{ color: "#d32f2f" }}> *</span>} {/* MUI error color */}
  </Typography>
);



export const renderForm = (props: any) => {
  const { item, control, errors, register, setValue, handleSelectedOption } = props;

  const renderError = (name: string) => (
    <Typography variant="caption" color="error">
      <ErrorMessage errors={errors} name={name} />
    </Typography>
  );

  switch (item.inputType) {
    case "text":
    case "number":
    case "textarea":
    case "alpha-numerical":
    case "contactNo":
    case "number-double":
    case "single-number":
      return (
        <Box mb={2}>
          {renderLabel(item.label, item?.isRequired)}
          <Controller
            name={item.name}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                fullWidth
                type="text"
                placeholder={item.placeholder}
                multiline={item.inputType === "textarea"}
                minRows={item.inputType === "textarea" ? 2 : undefined}
                inputProps={{
                  maxLength: item.maxLength || 100,
                  pattern:
                    item.inputType === "number" || item.inputType === "contactNo"
                      ? "[0-9]*"
                      : item.inputType === "alpha-numerical"
                      ? "[a-zA-Z0-9]*"
                      : undefined,
                }}
                onInput={(e: any) => {
                  let value = e.target.value;
                  if (item.inputType === "number" || item.inputType === "contactNo") {
                    value = value.replace(/[^0-9]/g, "");
                    e.target.value = value;
                  }
                  if (item.inputType === "alpha-numerical")
                    value = value.replace(/[^a-zA-Z0-9]/g, "");
                  if (item.inputType === "number-double") {
                    value = value.replace(/[^0-9.]/g, "");
                    const [intPart, decimalPart] = value.split(".");
                    if (decimalPart?.length > 2) value = `${intPart}.${decimalPart.slice(0, 2)}`;
                  }
                  if (item.inputType === "single-number") {
                    value = value.replace(/[^1-9]/g, "").slice(0, 1);
                  }
                  e.target.value = value;
                  setValue?.(item.name, value);
                }}
                disabled={item.disable || item.readOnly}
              />
            )}
          />
          {renderError(item.name)}
        </Box>
      );

    case "select":
      return (
        <Box mb={2}>
          {renderLabel(item.label, item?.isRequired)}
          <Controller
            name={item.name}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                size="small"
                displayEmpty
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  handleSelectedOption?.(e.target.value);
                }}
                disabled={item.disable || item.readOnly}
              >
                <MenuItem value="" disabled>
                  {item.placeholderText || "Select an option"}
                </MenuItem>
                {item.options?.map((option: any, index: number) => (
                  <MenuItem
                    key={index}
                    value={option.value}
                    disabled={item.disabledOptions?.includes(option.value)}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {renderError(item.name)}
        </Box>
      );

    case "toggle":
      return (
        <Box mb={2}>
          {renderLabel(item.label, item?.isRequired)}
          <Controller
            name={item.name}
            control={control}
            defaultValue={item.value ?? false}
            render={({ field }) => (
              <Switch
                {...field}
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={item.disable || item.readOnly}
              />
            )}
          />
          {renderError(item.name)}
        </Box>
      );

    case "checkbox":
      return (
        <Box mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {renderLabel(item.label, item?.isRequired)}
            <Controller
              name={item.name}
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={field.value} />
              )}
            />
          </Stack>
        </Box>
      );

    case "checkbox-group":
      return (
        <Box mb={2}>
          {renderLabel(item.label, item?.isRequired)}
          <FormGroup row>
            {item.settingsField.map((settings: any, index: number) => (
              <Controller
                key={index}
                name={settings.name}
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label={settings.label}
                  />
                )}
              />
            ))}
          </FormGroup>
        </Box>
      );

    case "radio":
      return (
        <Box mb={2}>
          {renderLabel(item.label, item?.isRequired)}
          <Controller
            name={item.name}
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
                {item.options.map((option: any) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio size="small" />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
          {renderError(item.name)}
        </Box>
      );

    default:
      return null;
  }
};
