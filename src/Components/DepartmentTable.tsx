import { useMemo, useState } from "react";
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
    Modal,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
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
import MultiSelect from "./MultiSelectv1";
import { renderForm, renderLabel } from "./renderForm";
import { generateSchema } from "./SchemaGenerator";
import CloseIcon from "@mui/icons-material/Close";
import { deleteDepartment, postDepartment } from "../ApiServices/DepartmentService";
import BarLoaderWrapper from "../Loaders/TableLoader";

const DepartmentTable = ({ fields,devices,refresh,setRefresh }: any) => {
    const [open, setOpen] = useState(false);
   
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const schema = generateSchema(fields);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
        reset,
    } = useForm<any>({
        resolver: yupResolver(schema),
    });


    const saveUser = async (data: any) => {
        try {
            const response = await postDepartment(data);
            return response;
        } catch (error: any) {
            console.error("Error saving zone:", error.response?.data || error.message);
            throw error;
        }
    };

    const onsubmit = async (data: any) => {
        setIsSubmitting(true);
        const payload = {
          departmentId: data.departmentId || 0,
          departmentType: data.departmentType,
          departmentDescription: data.departmentDescription,
            isActive: data.isActive ?? true,
        };

        try {
            await saveUser(payload);
          setRefresh(prev=>!prev)
            setOpen(false);
            reset();
        } catch (error) {
            alert("Failed to create/update zone. Check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (zoneId: any) => {
        await deleteDepartment(zoneId);
        setRefresh(prev=>!prev)
    };

    const handleDeleteClick = (zone: any) => {
        setSelectedUserId(zone.departmentId);
        setOpenDialog(true);
    };

    const handleOpen = (row?: any) => {
        setOpen(true);
        reset(row);
    };

    const columns = useMemo<MRT_ColumnDef<any>[]>(() => [
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
                        {rowData.isActive===false && (
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
            header: "S.No",
            Cell: ({ row }) => row.index + 1,
            size: 20,
        },
        {
            accessorKey: "departmentId",
            header: "departmentId",
            size: 100,
        },
        {
          accessorKey: "departmentType",
          header: "departmentType",
          size: 100,
      },
      {
        accessorKey: "departmentDescription",
        header: "departmentDescription",
        size: 100,
    },
        {
            accessorKey: "isActive",
            header: "Is Active",
            size: 50,
            Cell: ({ cell }) => (
                <span style={{ color: cell.getValue() ? "green" : "red", fontWeight: "bold" }}>
                    {cell.getValue() ? "Active" : "Inactive"}
                </span>
            ),
        },
    ], []);

    const table = useMaterialReactTable({
        columns,
        data: devices,
        enableStickyHeader: true,
        enablePagination: true,
        paginationDisplayMode: "pages",

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
                minHeight: "58.1vh",
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
        muiTableHeadCellProps: {
            sx: {
                background: 'rgb(74, 104, 188)',
                color: "white",
                border: "1px solid white",
                fontSize: "13px",
                padding: "2px 4px",
                textAlign: "center",
                "& .MuiTableHeadCell-Content": {
                    justifyContent: "center",
                    fontSize: "12px",
                },
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontSize: "12px",
                border: "1px solid #e0e0e0",
                padding: "4px",
                // textAlign: "center",
                // verticalAlign: "middle",
                //           "& .MuiSvgIcon-root": {
                //   verticalAlign: "middle",
                // },
            },
        },
        // muiTopToolbarProps: {
        //     sx: {
        //         height: "10px",
        //         minHeight: "40px",
        //     },
        // },
        renderToolbarInternalActions: () => (
            <>
                <MRT_ToggleGlobalFilterButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "20px" } }} />
                <MRT_ToggleFiltersButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "20px" } }} />
                <MRT_ShowHideColumnsButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "20px" } }} />
                <MRT_ToggleFullScreenButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "20px" } }} />
            </>
        ),
        renderEmptyRowsFallback:()=>(
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
        muiTableBodyRowProps: ({ row }) => ({
            sx: {
              backgroundColor: row.index % 2 === 0 ? 'rgb(226, 228, 231)' : '#ffffff', 
              '&:hover': {
                backgroundColor: 'rgb(168, 200, 247)', 
              },
            },
          }),
        enableGlobalFilter: true,
        enableDensityToggle: false,
        enableColumnActions: false,
        enableKeyboardShortcuts: false,
        enableColumnFilters: false,
        enableSorting: false,
    });

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalBox>
                <ModalHead>
                        <ModalTitle variant="h6">Edit</ModalTitle>
                        <Box onClick={()=>setOpen(false)} sx={{
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
        </>
    );
};

export default DepartmentTable;
