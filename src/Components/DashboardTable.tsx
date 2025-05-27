import { useEffect, useMemo, useState } from "react";
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
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { Device } from "../Types/Types";
import BarLoaderWrapper from "../Loaders/TableLoader";
import { enqueueSnackbar } from "notistack";
import { getDashboardDevices } from "../ApiServices/DashboardServices";

const DashboardTable = (  ) => {
   const [devices, setDevices] = useState([]);
   const [selectedvalue, setSelectedValue] = useState("Online Devices");
   const [isFetching, setIsFetching] = useState(true);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  };

   const fetchData = async (filterValue: string) => {
      try {
        setIsFetching(true)
        const allDevicesFromApi = await getDashboardDevices();
        console.log(allDevicesFromApi,"allDevicesFromApi")
        let filteredDevices = allDevicesFromApi || [];
  
        switch (filterValue) {
          case "Online Devices":
            filteredDevices = allDevicesFromApi.filter((item) => item.conStatus === true);
            break;
          case "Offline Devices":
            filteredDevices = allDevicesFromApi.filter((item) => item.conStatus === false);
            break;
          default:
            // All Devices, no filter
            break;
        }
        setDevices(filteredDevices);
      } catch (error) {
        enqueueSnackbar("Failed to load devices", { variant: "error" });
        console.error("Failed to fetch devices:", error);
      } finally {
        setIsFetching(false)
      }
    };

  useEffect(() => {
    fetchData(selectedvalue || "All Devices");

    // const interval = setInterval(() => {
    //   fetchData(selectedvalue || "All Devices");
    // }, 10000);

    // return () => clearInterval(interval);
  }, [selectedvalue]);

  const columns = useMemo<MRT_ColumnDef<Device>[]>(
    () => [
      // {
      //   header: "S.No",
      //   Cell: ({ row }) => row.index + 1,
      //   size: 20,
      // },
      {
        accessorKey: "deviceName",
        header: "Device Name",
        size: 100,
      },
      {
        accessorKey: "deviceDirection",
        header: "Device Direction",
        size: 10,
      },
      {
        accessorKey: "deviceIP",
        header: "Device IP",
        size: 100,
      },
      {
        accessorKey: "conStatus",
        header: "Status",
        size: 50,
        Cell: ({ cell }) => (
          <span style={{ color: cell.getValue()===true ? 'green' : 'red', fontWeight: 'bold' }}>
            {cell.getValue()===true ? 'Online' : 'Offline'}
          </span>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: devices,
    enablePagination: true,
    paginationDisplayMode: "pages",
    muiTableHeadCellProps: {
      sx: {
        background: 'rgb(74, 104, 188)',
        color: "white",
        border: "1px solid white",
        fontSize: "13px",
        padding: "2px 10px",
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
    renderTopToolbarCustomActions:() => (
      <Box sx={{ padding: '8px' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="device-filter-label">Device Filter</InputLabel>
          <Select
            labelId="device-filter-label"
            value={selectedvalue}
            label="Device Filter"
            onChange={handleChange}
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              fontWeight: 500,
              color: '#333',
              '.MuiSelect-icon': {
                color: '#1976d2',
              },
            }}
          >
            <MenuItem value="All Devices">All Devices</MenuItem>
            <MenuItem value="Online Devices">Online Devices</MenuItem>
            <MenuItem value="Offline Devices">Offline Devices</MenuItem>
          </Select>
        </FormControl>
      </Box>
    ),
    muiTableBodyCellProps: {
      sx: {
        fontSize: "12px",
        border: "1px solid #e0e0e0",
        whiteSpace: "nowrap",
        padding: "4px",
      },
    },
    muiTableContainerProps: {
      sx: {
        width: "100%",
       
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
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        "& .MuiBox-root": {
          boxShadow: "none",
        },
      },
    },
    renderToolbarInternalActions: () => (
      <>
        <MRT_ToggleGlobalFilterButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "20px" } }} />
        <MRT_ToggleFiltersButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "20px" } }} />
        <MRT_ShowHideColumnsButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "20px" } }} />
        <MRT_ToggleFullScreenButton table={table} sx={{ ".MuiSvgIcon-root": { fontSize: "20px" } }} />
      </>
    ),
    renderBottomToolbar: ({ table }) => (
      <Box sx={{ display: "flex", justifyContent: "flex-end",alignItems:'center',paddingBlock:'12px'}}>
        <Box sx={{ "& .MuiBox-root": { padding: "0px !important" }, "& .MuiTypography-root": { fontSize: 11 } }}>
          <MRT_TablePagination table={table} rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 50, 100]} />
        </Box>
      </Box>
    ),
    renderEmptyRowsFallback:()=>(
      isFetching  ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
             <BarLoaderWrapper></BarLoaderWrapper>
          </Box>
      ) : (
          <Typography sx={{ textAlign: 'center', padding: '20px' }}>
              No records to display
          </Typography>
      )
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
   
        <MaterialReactTable table={table} />
  );
};

export default DashboardTable;
