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
  CircularProgress,
  Modal,
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
import { Device } from "../Types/Types";
import { deleteDevice, postDevice } from "../ApiServices/DeviceServices";
import { renderForm } from "./renderForm";
import { generateSchema } from "./SchemaGenerator";
import CloseIcon from "@mui/icons-material/Close";
import BarLoaderWrapper from "../Loaders/TableLoader";
import DeleteDialog from "../Dialog/DeleteDialog";
import { data } from "react-router-dom";



const DeviceTable = ({ fields,refresh,setRefresh,devices }: any) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
 

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
    const payload = {
      deviceId: data.deviceId,
      deviceName: data.deviceName,
      deviceIP: data.deviceIP,
      devicePort: "",
      isActive: data.isActive === "true" || data.isActive === true,
      deviceDirection: data.deviceDirection,
      conStatus: "",
      serialNo: data.serialNo || "",
      createdOn: "",
      modifiedOn: "",
    };

    try {
      await saveDevice(payload);
      handleClose();
      reset();
    } catch (error) {
      console.error("Failed to save device:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (deviceId: any) => {
    console.log("delete", deviceId)
    await deleteDevice(deviceId)
    setRefresh(prev=>!prev)
  }



  const saveDevice = async (data: any) => {
    try {
      const response = await postDevice(data);
      console.log("Saved device response:", response);
      setRefresh(prev=>!prev)
      return response;
    } catch (error) {
      console.error("Failed to save device:", error);
      throw error;
    }
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);


  const handleOpen = (row: Device) => {
    setOpen(true);
    reset(row);
    console.log("row", row);
  };

  const handleDeleteClick = (deviceId: number) => {
    setSelectedDeviceId(deviceId);
    setOpenDialog(true);
  };

  const columns = useMemo<MRT_ColumnDef<Device>[]>(
    () => [
      {
        accessorKey: "actions",
        header: "Action",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: "5px", color: "rgba(7, 159, 30, 0.76)" }}>
            <StyleTableEdit onClick={() => handleOpen(row.original)}>
              <Icon path={mdiSquareEditOutline} size={0.7} />
            </StyleTableEdit>
            <StyleTableDelete onClick={() => handleDeleteClick(row.original.deviceId)}>
              <DeleteOutlineIcon style={{ color: "red", fontSize: "medium" }} />
            </StyleTableDelete>
          </Box>
        ),
        size: 10,
      },
      {
        accessorKey: "deviceId",
        header: "Device Id",
        size: 50,
      },
      {
        accessorKey: "deviceName",
        header: "Device Name",
        size: 100,
      },
      {
        accessorKey: "deviceDirection",
        header: "Device Direction",
        size: 50,
      },
      {
        accessorKey: "deviceIP",
        header: "Device IP",
        size: 50,
      },
      // {
      //   accessorKey: "devicePort",
      //   header: "Device Port",
      //   size: 50,
      // },
      {
        accessorKey: "conStatus",
        header: "Status",
        size: 50,
        Cell: ({ cell }) => (
          <span style={{ color: cell.getValue() == 'Online' ? 'green' : 'red', fontWeight: 'bold' }}>
            {cell.getValue() == 'Online' ? 'Online' : 'Offline'}
          </span>
        ),
      },
      // {
      //   accessorKey: "conStatus",
      //   header: "Connecton Status",
      //   size: 100,
      // },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: devices,
    enablePagination: false,
    // paginationDisplayMode: "pages",
    initialState:{ pagination: { pageSize: data.length } },
    enableStickyHeader: true,
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
        },
        position: "sticky",
        top: 0,
        zIndex: 5,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: "12px",
        border: "1px solid #e0e0e0",
        whiteSpace: "nowrap",
        paddingBlock: '1px',
        textAlign: 'inherit',
      },
    },
    muiTableContainerProps: {
      sx: {
        width: "100%",
        maxHeight: "361.7px",
        minHeight: "360px",
        overflow: "auto",
        overflowX: "hidden",
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
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? 'rgb(226, 228, 231)' : '#ffffff',
        '&:hover': {
          backgroundColor: 'rgb(168, 200, 247)',
        },
      },
    }),
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        "& .MuiBox-root": {
          boxShadow: "none",
        },
      },
    },
    muiBottomToolbarProps:{
      sx:{
        minHeight:'30px'
      }
    },
    renderToolbarInternalActions: () => (
      <>
        <MRT_ToggleGlobalFilterButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "16px" } }}  />
        <MRT_ToggleFiltersButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "16px" } }} />
        <MRT_ShowHideColumnsButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "16px" } }} />
        <MRT_ToggleFullScreenButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "16px" } }} />
      </>
    ),
    // renderBottomToolbar: ({ table }) => (
    //   <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
    //     <Box sx={{ "& .MuiBox-root": { padding: "0px !important" }, "& .MuiTypography-root": { fontSize: 11 } }}>
    //       <MRT_TablePagination table={table} rowsPerPageOptions={[30, 50, 100]} />
    //     </Box>
    //   </Box>
    // ),
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
    enableColumnActions: false,
    enableKeyboardShortcuts: false,
    enableColumnFilters: false,
    enableSorting: false,

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
                  // if (item.inputType === 'multiselect') {
                  //   return (

                  //     <Formitem container noOfColumn={3}>
                  //       {renderLabel(item.label, item?.mandatory)}
                  //       <MultiSelect
                  //         key={item.name}
                  //         name={item.name}
                  //         label={item.label}
                  //         control={control}
                  //         options={item.options}
                  //         errors={errors}
                  //       />
                  //     </Formitem>
                  //   );
                  // }
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

      <DeleteDialog
        open={openDialog}
        title="Confirm Delete"
        description="Are you sure you want to delete this device? This action cannot be undone."
        onCancel={() => setOpenDialog(false)}
        onConfirm={() => {
          if (selectedDeviceId !== null) {
            handleDelete(selectedDeviceId);
          }
          setOpenDialog(false);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />


    </>
  );
};

export default DeviceTable;