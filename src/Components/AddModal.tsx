import {
  Modal,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  ModalHead,
  ModalButtonBox,
  FormComponent,
  Formitem,
} from "../Styles/HomeStyle";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  ModalBox,
  ModalButton,
  ModalTitle,
  StyledSubmit,
  DeviceModalBox,
  UserModalBox,
} from "../Styles/ModalStyle";
import { renderForm, renderLabel } from "./renderForm";
import MultiSelect from "./MultiSelectv1";
import { generateSchema } from "./SchemaGenerator";
import CloseIcon from "@mui/icons-material/Close";

const AddModal = ({
  fields,
  apiHandler,
  mapPayload,
  modalType = "default",
  onSuccess,
  onSubmitOverride
}: any) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = generateSchema(fields);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
  });

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const onSubmit = async (data: any) => {
    if (onSubmitOverride) {
      return onSubmitOverride(data, { reset, handleClose, setIsSubmitting });
    }

    setIsSubmitting(true);
    try {
      const payload = mapPayload(data);
      await apiHandler(payload);
      await onSuccess();
      handleClose();
      reset();
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTypeStyles = {
    device: DeviceModalBox,
    user: UserModalBox,
    default: ModalBox,
  };

  const ModalBoxComponent = modalTypeStyles[modalType] || ModalBox;

  return (
    <Box>
      <ModalButton variant="contained" onClick={handleOpen}>
        Add
      </ModalButton>

      <Modal open={open} onClose={handleClose}>
        <ModalBoxComponent>
          <ModalHead>
            <ModalTitle variant="h6">Add</ModalTitle>
            <Box
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: "-2%",
                right: "-0.5%",
                cursor: "pointer",
              }}
            >
              <CloseIcon
                sx={{
                  fontSize: "larger",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  padding: "2px",
                }}
              />
            </Box>
          </ModalHead>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box p={1}>
              <FormComponent container>
                {fields.map((item: any) => {
                  if (item.inputType === "multiselect") {
                    return (
                      <Formitem container noOfColumn={3} key={item.name}>
                        {renderLabel(item.label, item?.mandatory)}
                        <MultiSelect
                          name={item.name}
                          label={item.label}
                          control={control}
                          options={item.options}
                          errors={errors}
                        />
                      </Formitem>
                    );
                  }
                  return (
                    <Formitem container noOfColumn={3} key={item.name}>
                      {renderForm({
                        item,
                        register,
                        errors,
                        setValue,
                        control,
                      })}
                    </Formitem>
                  );
                })}
              </FormComponent>
              <ModalButtonBox>
                <StyledSubmit
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Submit"
                  )}
                </StyledSubmit>
              </ModalButtonBox>
            </Box>
          </form>
        </ModalBoxComponent>
      </Modal>
    </Box>
  );
};

export default AddModal;
