import { useMemo } from "react";
import { useState, useEffect } from "react";
import {
    MaterialReactTable,
    MRT_ShowHideColumnsButton,
    MRT_TablePagination,
    MRT_ToggleFiltersButton,
    MRT_ToggleFullScreenButton,
    MRT_ToggleGlobalFilterButton,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from "material-react-table";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    IconButton,
    Modal,
    Radio,
    Slide,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    StyleTableEdit,
    StyleTableDelete,
    ModalButtonBox,
    ModalHead,
    FormComponent,
    Formitem,
} from "../Styles/HomeStyle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { mdiSquareEditOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ModalBox, ModalTitle, StyledSubmit } from "../Styles/ModalStyle";
import { PopBox, PopButton } from "../Styles/MasterStyle";
import PushModal from "./PushModal";
import { renderForm, renderLabel } from "./renderForm";
import { deleteUser, postUser, pushFace, pushToDevice } from "../ApiServices/UserService";
import MultiSelect from "./MultiSelectv1";
import { generateSchema } from "./SchemaGenerator";
import CloseIcon from "@mui/icons-material/Close";
import BarLoaderWrapper from "../Loaders/TableLoader";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { getAllDevices } from "../ApiServices/DeviceServices";



const UserTable = ({ fields, refresh, setRefresh, devices }: any) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [viewOpen, setViewOpen] = useState(false); // For Master Devices modal
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
    const [MasterDevices, setMasterDevices] = useState([])

    const schema = generateSchema(fields);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
        reset
    } = useForm<any>({
        resolver: yupResolver(schema),
    });



    const onsubmit = async (data: any) => {
        // setLoading(true);
        setIsSubmitting(true);
        console.log("d", data)
        const payload = {
            employeeName: data.employeeName,
            employeeCode: data.employeeCode,
            employeeRFIDNumber: data.employeeRFIDNumber,
            employeeFingerId: data.employeeFingerId || " ",
            employeeFaceId: data.employeeFaceId || " ",
            employeeFacelength: Number(data.employeeFacelength) || 0,
            employeeFingerIndex: data.employeeFingerIndex || " ",
            contactNo: data.contactNo || " ",
            zoneIds: data.zoneNames.join(',') || "",
            isActive: data.isActive === true ? 1 : 0,
            gender: data.gender === "male" ? "male" : "female",
            departmentId: Number(data.departmentId) || 0
        };
        console.log("sub", payload)
        try {
            await saveUser(payload);
            handleClose();
            reset();
        } catch (error) {
            console.error("Failed to save device:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (userId: any) => {
        await deleteUser(userId)
        setRefresh(prev => !prev)
    }

    const saveUser = async (data: any) => {
        try {
            await postUser(data);
            setRefresh(prev => !prev)
        } catch (error) {
            console.error("Failed to save device:", error);
            throw error;
        }
    };

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const handleOpen = (row?: any) => {
        console.log("row: ", row)
        setOpen(true);
        const transformedRow = {
            ...row,
            zoneNames: row.zoneIds?.split(',').map(Number) || []
        };
        reset(transformedRow);
    };

    const handleDeleteClick = (userId: any) => {
        setSelectedUserId(userId.employeeCode);
        setOpenDialog(true);
    };

    const [selectedRowCount, setSelectedRowCount] = useState(0);
    const [rowSelection, setRowSelection] = useState({});
    const [selectedRowsData, setSelectedRowsData] = useState([]);
    const [openModal, setOpenModal] = useState(false);


    const handleViewOpen = async () => {
        try {
            setViewOpen(true);
            setIsFetching(true)
            const devicesFromApi = await getAllDevices();
            const devices = devicesFromApi.filter(item => item.deviceType === null)
            setMasterDevices(devices || []);
            console.log(devicesFromApi, "devicesFromApi")
        } catch (err) {
            // enqueueSnackbar("Failed to load devices", { variant: "error" });
            console.error(err);
        }
        finally {
            setIsFetching(false)
        }
    };
    const handleMasterSubmit = async () => {
        console.log(selectedDevices[0], "selectedDevices")
        console.log(selectedRowsData, "SelectedRowsData")
        try {
            const DeviceIp = MasterDevices.filter((item: any) => item.deviceId.toString() === selectedDevices[0])
            console.log(DeviceIp, "DeviceIp")
            const payload = {
                devieip: DeviceIp[0]?.deviceIP,
                userId: selectedRowsData[0]?.employeeCode.toString(),
            };

            console.log(payload, "payload")

            await pushFace(payload);
            setRefresh(prev => !prev)
            setViewOpen(false);
        } catch (err) {

            console.error(err);
        }
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const handleConfirm = async (payload: any) => {
        const cleanedData = payload.userMasters.map((item) => ({
            ...item,
            employeeFaceId: item.employeeFaceId ?? "",
            employeeFingerId: item.employeeFingerId ?? "",
            employeeFingerIndex: item.employeeFingerIndex ?? "",
        }));
        payload.userMasters = cleanedData
        await pushToDevice(payload);
        setOpenModal(false);
    };

    useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
        setSelectedRowCount(selectedRows.length);
        setSelectedRowsData(selectedRows);
    }, [rowSelection])

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: "actions",
                header: "Action",
                Cell: ({ row }) => {
                    const rowData=row.original
                    console.log(rowData,"rowData")
                    return(
                        <Box
                        sx={{
                            display: "flex",
                            gap: "5px",
                            color: "rgba(7, 159, 30, 0.76)",
                        }}
                    >
                        <StyleTableEdit onClick={() => handleOpen(row.original)}>
                            <Icon path={mdiSquareEditOutline} size={0.7} />
                        </StyleTableEdit>
                        {rowData.isActive===1 && (
                            <StyleTableDelete onClick={() => handleDeleteClick(row.original)}>
                            <DeleteOutlineIcon style={{ color: "red", fontSize: "medium" }} />
                        </StyleTableDelete>
                        )}
                    </Box>
                    )
                },
                maxSize: 10
            },
            {
                accessorKey: "employeeCode",
                header: "Employee Code",
                maxSize: 50
            },

            {
                accessorKey: "employeeName",
                header: "Employee Name",
                size: 100,
            },
            {
                accessorKey: "gender",
                header: "Gender",
                maxSize: 10
            },
            {
                accessorKey: "employeeRFIDNumber",
                header: "Employee RFIDNumber",
                maxSize: 30
            },
            {
                accessorKey: "contactNo",
                header: "Contact No",
                size: 50,
            },
            {
                accessorKey: "isActive",
                header: "Is Active",
                size: 50,
                Cell: ({ cell }) => (
                    <span style={{ color: cell.getValue() ? 'green' : 'red', fontWeight: 'bold' }}>
                        {cell.getValue() ? 'Active' : 'Inactive'}
                    </span>
                ),
            },
            {
                accessorKey: "zoneNames",
                header: "Zone Names",
                maxSize: 150
            },
            {
                header: "Authentication",
                size: 50,
                Cell: ({ row }: any) => {
                    const { iscard, isfinger, isface } = row.original;
                    return (
                        <Box
                            sx={{
                                display: "flex",
                                gap: "5px",
                            }}
                        >
                            <span>
                                {isfinger === 1 ? (
                                    <FingerprintIcon color="primary" style={
                                        {
                                            fontSize: 'medium'
                                        }
                                    } />
                                ) : (
                                     <FingerprintIcon color="error" style={
                                        {
                                            fontSize: 'medium'
                                        }
                                    } />
                                )}
                            </span>
                            <span>
                                {isface === 1 ? (
                                    <EmojiEmotionsIcon color="primary" style={
                                        {
                                            fontSize: 'medium'
                                        }
                                    } />
                                ) : (
                                    <EmojiEmotionsIcon color="error" style={
                                        {
                                            fontSize: 'medium'
                                        }
                                    } />
                                )}
                            </span>
                            <span>
                                {iscard === 1 ? (
                                    <CreditCardIcon color="primary" style={
                                        {
                                            fontSize: 'medium'
                                        }
                                    } />
                                ) : (
                                    <CreditCardIcon color="error" style={
                                        {
                                            fontSize: 'medium'
                                        }
                                    } />
                                )}
                            </span>
                        </Box>
                    )
                }
            },

        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: devices,
        enablePagination: true,
        paginationDisplayMode: "pages",
        enableStickyHeader: true,
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0
            }
        },
        muiTableHeadCellProps: {
            sx: {
                background: 'rgb(74, 104, 188)',
                color: "white",
                border: "1px solid white",
                fontSize: "13px",
                padding: "1px 10px",
                textAlign: "center",
                "& .MuiTableHeadCell-Content": {
                    justifyContent: "center",
                    fontSize: "12px",
                    position: "sticky",
                    top: 0,
                    zIndex: 5,
                },
                "& .MuiCheckbox-root": {
                    transform: "scale(0.8)",
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                },

            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                "& .MuiBox-root": {
                    boxShadow: "none",
                },
            },
        },
        muiTableContainerProps: {
            sx: {
                width: "100%",
                minHeight: '365.5px',
                maxHeight:'50vh',
                maxWidth: "100%",
                overflow: "auto",

                "&::-webkit-scrollbar": {
                    width: "5px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555",
                },
            },
        },

        muiTopToolbarProps: {
            sx: {
                minHeight: "40px",
            },
        },
        muiSelectCheckboxProps: {
            size: "small",
            sx: {
                transform: "scale(0.9)",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'green'
            },
        },

        renderToolbarInternalActions: () => (
            <>
                <MRT_ToggleGlobalFilterButton
                    table={table}
                    sx={{ ".MuiSvgIcon-root": { fontSize: "16px" } }} size="small"
                />
                <MRT_ToggleFiltersButton
                    table={table}
                    sx={{ ".MuiSvgIcon-root": { fontSize: "16px" } }}
                />
                <MRT_ShowHideColumnsButton
                    table={table}
                    sx={{ ".MuiSvgIcon-root": { fontSize: "16px" } }}
                />
                <MRT_ToggleFullScreenButton
                    table={table}
                    sx={{ ".MuiSvgIcon-root": { fontSize: "16px" } }}
                />

            </>
        ),
        renderBottomToolbar: ({ table }) => (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Box
                    className="pagination-container"
                    sx={{
                        "& .MuiBox-root": { padding: "0px !important" },
                        "& .MuiTypography-root": { fontSize: 11 },
                    }}
                >
                    <MRT_TablePagination table={table} rowsPerPageOptions={[50, 100, 150, 300, 400, 500]} />
                </Box>
            </Box>
        ),
        renderEmptyRowsFallback: () => (
            isFetching ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <BarLoaderWrapper></BarLoaderWrapper>
                </Box>
            ) : (
                <Typography sx={{ textAlign: 'center', padding: '20px' }}>
                    No records to display
                </Typography>
            )
        ),
        enableGlobalFilter: true,
        enableDensityToggle: false,
        //initialState: { density: "compact" },
        enableColumnActions: false,
        enableKeyboardShortcuts: false,
        enableColumnFilters: false,
        enableSorting: false,
        enableRowSelection: true,
        positionToolbarAlertBanner: 'none',
        state: { rowSelection },

        onRowSelectionChange: setRowSelection,
        muiTableBodyRowProps: ({ row }) => ({
            sx: {
                backgroundColor: row.index % 2 === 0 ? 'rgb(226, 228, 231)' : '#ffffff',
                '&:hover': {
                    backgroundColor: 'rgb(168, 200, 247)',
                },
            },
        }),

        muiTableBodyCellProps: ({ row }) => ({
            sx: {
                backgroundColor: row.getIsSelected() ? "rgb(147, 165, 227)" : "",
                fontSize: "12px",
                border: "1px solid #e0e0e0",
                borderRight: "1px solid #e0e0e0",
                paddingBlock: "1px",
                textAlign: 'justify'
            }
        })
    });

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <ModalBox>
                    <ModalHead>
                        <ModalTitle variant="h6">Edit</ModalTitle>
                        <Box onClick={handleClose} sx={{
                            position: 'absolute',
                            top: '-2%',
                            right: '-0.5%',
                            cursor: 'pointer'
                        }}  >
                            <CloseIcon sx={{
                                fontSize: 'larger', backgroundColor: 'white', borderRadius: '50%',
                                padding: '2px'
                            }} />
                        </Box>
                    </ModalHead>
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <Box p={1}>
                            <FormComponent container>
                                {fields.map((item: any) => {
                                    if (item.inputType === 'multiselect') {
                                        return (

                                            <Formitem container noOfColumn={3}>
                                                {renderLabel(item.label, item?.mandatory)}
                                                <MultiSelect
                                                    key={item.name}
                                                    name={item.name}
                                                    label={item.label}
                                                    control={control}
                                                    options={item.options}
                                                    errors={errors}
                                                />
                                            </Formitem>
                                        );
                                    }
                                    return <Formitem container noOfColumn={3}>
                                        {renderForm({
                                            item,
                                            register,
                                            errors,
                                            setValue,
                                            control,
                                        })}
                                    </Formitem>
                                })}
                            </FormComponent>

                            <ModalButtonBox>
                                <StyledSubmit type="submit" variant="contained" size="small" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        "Submit"
                                    )}
                                </StyledSubmit>
                            </ModalButtonBox>
                        </Box>
                    </form>
                </ModalBox>
            </Modal>
            <MaterialReactTable table={table} />
            <Slide direction="down" in={selectedRowCount > 0} mountOnEnter unmountOnExit>
                <Box sx={{
                    position: "absolute",
                    top: "6%",
                    left: "10%",
                    width: '90%',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                }}>
                    <PopBox
                    >
                        <Typography sx={{ color: "white" }}>
                            Selected Rows:{selectedRowCount}
                        </Typography>
                        <PopButton onClick={handleOpenModal}
                            variant="contained"
                            size="small"
                        >
                            Push To Device
                        </PopButton>

                        <PushModal
                            open={openModal}
                            onClose={handleCloseModal}
                            onConfirm={handleConfirm}
                            selectedRows={selectedRowsData}
                        />
                    </PopBox>
                    {selectedRowCount===1 && (
                        <Button onClick={handleViewOpen}
                        variant="contained"
                        size="small" sx={{
                            textTransform: 'initial',
                            backgroundColor: '#1c1c69'
                        }}
                    >
                        Enroll Face
                    </Button>
                    )}
                </Box>
            </Slide>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this device? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (selectedUserId !== null) {
                                handleDelete(selectedUserId);
                            }
                            setOpenDialog(false);
                        }}
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 500,
                        bgcolor: "#f9f9fb",
                        boxShadow: 24,
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: "#1976d2",
                            color: "#fff",
                            px: 3,
                            py: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h6" fontWeight={500}>
                            Master Devices
                        </Typography>
                        <IconButton onClick={() => setViewOpen(false)} sx={{ color: "#fff" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ px: 3, py: 2 }}>
                        <Box sx={{ px: 3, py: 2 }}>
                            {isFetching ? (
                                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search devices..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        sx={{ mb: 1 }}
                                    />
                                    <Box
                                        sx={{
                                            backgroundColor: "#eef1f5",
                                            borderRadius: 2,
                                            p: 2,
                                            maxHeight: 300,
                                            overflowY: "auto",
                                        }}
                                    >
                                        <Stack spacing={1}>
                                            {MasterDevices.filter(
                                                (device: any) =>
                                                    device.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    device.deviceIP?.includes(searchTerm)
                                            ).map((device: any) => (
                                                <FormControlLabel
                                                    key={device.deviceId}
                                                    control={
                                                        <Radio
                                                            checked={selectedDevices === device.deviceId?.toString()}
                                                            onChange={() => {
                                                                const id = device.deviceId?.toString();
                                                                setSelectedDevices(id);
                                                            }}
                                                            size="small"
                                                            color="primary"
                                                        />
                                                    }
                                                    label={device.deviceName}
                                                />
                                            ))}
                                        </Stack>
                                        {MasterDevices.length === 0 && (
                                            <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                                                No devices found
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box mt={3} display="flex" justifyContent="flex-end">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleMasterSubmit}
                                            sx={{ textTransform: "none", px: 4 }}
                                        >
                                            Assign Master
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Box>

                    </Box>

                </Box>
            </Modal>

        </>
    );
};

export default UserTable;
