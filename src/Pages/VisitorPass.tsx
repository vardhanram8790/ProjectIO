import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    Avatar,
    Stack,
    Container,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { generateSchema } from "../Components/SchemaGenerator";
import { autoFilter, generateVisitor } from "../ApiServices/VisitorServices";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

// Field config
const fields = [
    { name: "mobileNo", label: "Mobile number", validationType: "contactNo", isRequired: true },
    { name: "accessCardNumber", label: "Access card number", validationType: "string", isRequired: true },
    { name: "visitorName", label: "Visitor name", validationType: "string", isRequired: true },
    { name: "nationality", label: "Nationality", validationType: "string", isRequired: true, isDisabled: true, defaultValue: "Indian" },
    { name: "govtIdType", label: "Government ID", validationType: "string", isRequired: true },
    { name: "governmentId", label: "ID number", validationType: "string", isRequired: true },
    { name: "visiotorsCompany", label: "Company", validationType: "string", isRequired: true },
    { name: "department", label: "Department", validationType: "string", isRequired: true },
    { name: "personToMeet", label: "Person to meet", validationType: "string", isRequired: true },
    { name: "purposeOfVisit", label: "Purpose of visit", validationType: "string", isRequired: true },
    { name: "visitorCategory", label: "Visitor category", validationType: "string", isRequired: true },
    { name: "passValidity", label: "Pass validity", validationType: "string", isRequired: false },
];

const schema = generateSchema(fields);

const VisitorPass = () => {
    const [isMobileLoading, setIsMobileLoading] = useState(false);
    const [image, setImage] = useState("");
    const [openCamera, setOpenCamera] = useState(false);
    const [mobileSearchResults, setMobileSearchResults] = useState([]);
    const webcamRef = useRef(null);
    const [mobileNumber, setMobileNumber] = useState("");
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toISOString();
    console.log(now);
    const [endDate, setEndDate] = useState(today);

    const { handleSubmit, control, register, formState: { errors }, setValue, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            mobileNo: "",
            accessCardNumber: "",
            visitorName: "",
            nationality: "Indian",
            govtIdType: "Aadhar Card",
            governmentId: "",
            visiotorsCompany: "",
            department: "",
            personToMeet: "",
            purposeOfVisit: "",
            visitorCategory: "Regular Visitor",
            passValidity: today,
        },
    });

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        setOpenCamera(false);
    };

    const handleClear = () => {
        setImage("");
    };

    const navigate = useNavigate()

    const onSubmit = async (data) => {
        const payload = {
            accessCardNo: data.accessCardNumber || "",
            visitorsName: data.visitorName || "",
            governmentIdType: data.govtIdType || "",
            aadharNo: data.aadharNo || "",
            visiotorsCompany: data.visiotorsCompany || "",
            department: data.department || "",
            personToMeet: data.personToMeet || "",
            purposeOfVisit: data.purposeOfVisit || "",
            visitorCategory: data.visitorCategory || "",
            passValidity: data.passValidity || endDate,
            gender: data.gender || "",
            visitorsCellNo: data.mobileNo || "",
            governmentId: data.governmentId || "",
            nationality: data.nationality || "",
            remarks: data.remarks || "",
            areaPermit: data.areaPermit || "",
            deleteFromDevice: true,
            createdDate: data.createdDate || "",
            jsonData: data.jsonData || "",
            inTime: data.InTime || "",
            outTime: data.outTime || "",
            visitorPhoto: image,
        };

        try {
            const response = await generateVisitor(payload);

            if (response.success) {
                enqueueSnackbar(response.message || "Visitor pass generated successfully", { variant: "success" });
                setTimeout(() => {
                    navigate("/VisitorPrintPass", { state: payload });
                  }, 300);
               
              }
              else{
                enqueueSnackbar(response.message ||"Failed to generate visitor pass", { variant: "error" });
              }
            reset();
            setImage("");
            setMobileNumber("");
            setMobileSearchResults([]);
        } catch (error) {
            console.error("Error uploading data", error);
        }
    };

    const handleMobileInputChange = async (event) => {
        const value = event.target.value;
        setMobileNumber(value);
    
        if (value.length <=10) {
            setIsMobileLoading(true);
            const data = await autoFilter(value);
            setMobileSearchResults(data || []);
            setIsMobileLoading(false);
        } else {
            setMobileSearchResults([]);
        }
    };
    

    const handleDateChange = (e) => {
        const localDateTime = e.target.value; // "2025-04-25T17:27"
        const isoDateTime = new Date(localDateTime).toISOString(); // "2025-04-25T17:27:00.000Z"
        console.log("ISO DateTime:", isoDateTime);
        setEndDate(localDateTime); // You can also store the ISO if needed
    };


    const handleMobileSelect = (event, selectedOption) => {
        if (selectedOption) {
            const matched = {
                mobileNo: selectedOption.visitorsCellNo || "",
                accessCardNumber: selectedOption.accessCardNo || "",
                visitorName: selectedOption.visitorsName || "",
                nationality: "Indian",
                govtIdType: "Aadhar Card",
                governmentId: selectedOption.governmentId || "",
                visiotorsCompany: selectedOption.visiotorsCompany || "",
                department: selectedOption.department || "",
                personToMeet: selectedOption.personToMeet || "",
                purposeOfVisit: selectedOption.purposeOfVisit || "",
                visitorCategory: selectedOption.visitorCategory || "Regular Visitor",
                passValidity: selectedOption.passValidity || endDate,
                visitorPhoto: selectedOption.visitorPhoto || ""
            };
            reset(matched);
            setImage(selectedOption.visitorPhoto || "");
            setMobileNumber(selectedOption.visitorsCellNo || "");
        }
    };

    return (
        <Container sx={{
            height:'486px'
        }}>
            <Paper elevation={3} sx={{ p: 1 }}>
                <Typography variant="h6" mb={2} fontWeight="bold" textAlign="center">
                    Generate Visitor Pass
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                {fields.map((field, index) => {
                                    if (field.name === "mobileNo") {
                                        return (
                                            <Grid item xs={6} key={index}>
                                                <Box sx={{ "& .MuiInputBase-input": { padding: "5px", fontSize: "0.875rem" } }}>
                                                    <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>{field.label}</Typography>
                                                    <Controller
                                                        name="mobileNo"
                                                        control={control}
                                                        render={({ field: controllerField }) => (
                                                            <Autocomplete
                                                                size="small"
                                                                freeSolo
                                                                options={mobileSearchResults}
                                                                loading={isMobileLoading}
                                                                getOptionLabel={(option) =>
                                                                    typeof option === "string" ? option : option.visitorsCellNo || ""
                                                                }
                                                                onChange={(e, value) => {
                                                                    handleMobileSelect(e, value);
                                                                    controllerField.onChange(value?.visitorsCellNo || value || "");
                                                                }}
                                                                inputValue={mobileNumber}
                                                                onInputChange={(e, newInputValue) => {
                                                                    setMobileNumber(newInputValue);
                                                                    controllerField.onChange(newInputValue);
                                                                    handleMobileInputChange({ target: { value: newInputValue } });
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        error={!!errors[field.name]}
                                                                        helperText={errors[field.name]?.message}
                                                                        InputProps={{
                                                                            ...params.InputProps,
                                                                            endAdornment: (
                                                                                <>
                                                                                    {isMobileLoading ? <CircularProgress color="inherit" size={18} /> : null}
                                                                                    {params.InputProps.endAdornment}
                                                                                </>
                                                                            ),
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                </Box>
                                            </Grid>
                                        );
                                    }

                                    if (field.name === "passValidity") {
                                        return (
                                            <Grid item xs={6} key={index}>
                                                <Box sx={{ "& .MuiInputBase-input": { padding: "5px", fontSize: "0.875rem" } }}>
                                                    <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>{field.label}</Typography>
                                                    <TextField
                                                        fullWidth
                                                        type="date"
                                                        value={endDate}
                                                        onChange={handleDateChange}
                                                        InputLabelProps={{ shrink: true }}

                                                        size="small"
                                                        variant="outlined"
                                                        error={!!errors[field.name]}
                                                    />
                                                </Box>
                                            </Grid>
                                        );
                                    }

                                    if (field.name === "nationality") {
                                        return (
                                            <Grid item xs={6} key={index}>
                                                <Box sx={{ "& .MuiInputBase-input": { padding: "5px", fontSize: "0.875rem" } }}>
                                                    <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>{field.label}</Typography>
                                                    <TextField
                                                        fullWidth
                                                        {...register(field.name)}
                                                        value={field.defaultValue}
                                                        disabled={field.isDisabled}
                                                    />
                                                </Box>
                                            </Grid>
                                        );
                                    }

                                    return (
                                        <Grid item xs={6} key={index}>
                                            <Box sx={{ "& .MuiInputBase-input": { padding: "5px", fontSize: "0.875rem" } }}>
                                                <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>{field.label}</Typography>
                                                <TextField
                                                    fullWidth
                                                    {...register(field.name)}
                                                    error={!!errors[field.name]}
                                                    helperText={errors[field.name]?.message}
                                                />
                                            </Box>
                                        </Grid>
                                    );
                                })}

                                <Grid item xs={12}>
                                    <Button variant="contained" color="error" type="submit" fullWidth>
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Visitor Photo
                            </Typography>
                            <Avatar
                                variant="square"
                                src={image || ""}
                                alt="Visitor"
                                sx={{ width: 180, height: 220, border: "1px solid #ccc" }}
                            />
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" color="error" size="small" onClick={handleClear}>
                                    Clear
                                </Button>
                                <Button variant="contained" color="success" size="small" onClick={() => setOpenCamera(true)}>
                                    Upload Photo
                                </Button>
                            </Stack>
                        </Box>

                        <Dialog open={openCamera} onClose={() => setOpenCamera(false)} maxWidth="sm" fullWidth>
                            <DialogTitle>Take a Picture</DialogTitle>
                            <DialogContent sx={{ textAlign: "center" }}>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: "user" }}
                                    style={{ width: "100%", borderRadius: 8 }}
                                />
                                <Button variant="contained" onClick={handleCapture} sx={{ mt: 2 }}>
                                    Capture Photo
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default VisitorPass;
