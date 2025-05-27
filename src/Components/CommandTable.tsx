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
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { getCommands } from "../ApiServices/DeviceCommandServices";
import BarLoaderWrapper from "../Loaders/TableLoader";
import { useSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";

type Command = {
  deviceName: string;
  creationDate: string;
  deviceIp: string;
  command: string;
  eventStatus: string;
  employeeCode: string;
  executionDate: string;
};

const CommandTable = () => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(yesterday);
  const [endDate, setEndDate] = useState(today);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Command[]>([]);
  const [isFetching, setIsFetching] = useState(false);
   const { enqueueSnackbar } = useSnackbar();

   const handleSearch = () => {
    if (endDate && new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be earlier than start date");
      return;
    }
    setError("");
    setTriggerSearch((prev) => !prev); 
  };

   const fetchData = async () => {
    setIsFetching(true);
    try {
      if (triggerSearch && startDate && endDate) {
        const response = await getCommands(startDate, endDate);
        setData(response || []);
      } else {
        setData([]);
      }
    } catch (error) {
      enqueueSnackbar("Failed to load devices", { variant: "error" });
      console.error("Failed to fetch commands:", error);
      setData([]);
    } finally {
      setIsFetching(false); 
    }
  };

  useEffect(() => {

    fetchData();
  }, [triggerSearch, startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      const ReloadData = async () => {
        setIsFetching(true);
        try {
          if (startDate && endDate) {
            const response = await getCommands(startDate, endDate);
            setData(response || []);
          } else {
            setData([]);
          }
        } catch (error) {
          enqueueSnackbar("Failed to load devices", { variant: "error" });
          console.error("Failed to fetch commands:", error);
          setData([]);
        } finally {
          setIsFetching(false); 
        }
      };
      ReloadData()
      
    }
  }, []);
  

  const columns = useMemo<MRT_ColumnDef<Command>[]>(() => [
    {
      header: "S.No",
      Cell: ({ row }) => row.index + 1,
      size: 20,
    },
    {
      accessorKey: "deviceName",
      header: "Device Name",
      size: 100,
    },
    {
      accessorKey: "deviceIp",
      header: "Device IP",
      size: 100,
    },
    {
      accessorKey: "command",
      header: "Command",
      size: 100,
    },
    {
      accessorKey: "eventStatus",
      header: "Event Status",
      size: 50,
      Cell: ({ cell }) => (
        <span
          style={{
            color: cell.getValue() === "Pending" ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {cell.getValue() === "Pending" ? "Pending" : "Success"}
        </span>
      ),
    },
    {
      accessorKey: "employeeCode",
      header: "Employee Code",
      size: 100,
    },
    {
      accessorKey: "creationDate",
      header: "Creation Date",
      size: 100,
    },
    {
      accessorKey: "executionDate",
      header: "Execution Date",
      size: 100,
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: true,
    paginationDisplayMode: "pages",
    enableGlobalFilter: true,
    enableDensityToggle: false,
    enableColumnActions: true,
    enableColumnFilters: true,
    enableSorting: true,
    enableFullScreenToggle: true,
    enableHiding: true,
    enableStickyHeader:true,
    initialState:{ pagination: { pageSize: 15 } },
    muiTableContainerProps: {
      sx: {
        width: "100%",
        minHeight: "260px",
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
    renderTopToolbarCustomActions:() => (
      <Box
      display="flex"
      flexWrap="wrap"
      gap={2}
      alignItems="center"
      sx={{
        "& .MuiTextField-root": {
          minWidth: 200,
        },
        
      }}
    >
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        inputProps={{ max: today }}
        size="small"
        variant="outlined"
      />

      <TextField 
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        inputProps={{ max: today }}
        size="small"
        variant="outlined"
        error={!!error}
        helperText={error}
      />

      <IconButton size="small"
        onClick={handleSearch}
        color="primary"
        sx={{
          backgroundColor: "#1976d2",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#155fa0",
          },
          height: 40,
          width: 40,
          borderRadius: 1,
        }}
      >
        <SearchIcon fontSize="12px" />
      </IconButton>
    </Box>
    ),
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
          backgroundColor: row.getIsSelected() ? "rgb(147, 165, 227)" : "",
          fontSize: "12px",
          border: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
          paddingBlock: "1px",
          textAlign: 'justify'
      }
  }),

    muiTableBodyProps: {
      sx: {
        height: "230px",
      },
    },

    muiTablePaperProps: {
      elevation: 0,
    },

    muiTableHeadCellProps: {
      sx: {
        background: "rgb(74, 104, 188)",
        color: "white",
        border: "1px solid white",
        fontSize: "13px",
        padding: "2px 4px",
        textAlign: "center",
        "& .MuiTableHeadCell-Content": {
          justifyContent: "center",
          fontSize: "12px",
          position: "sticky",
          top: 0,
          zIndex: 5,
        },
      },
    },

    renderToolbarInternalActions: () => (
      <Box>
        <MRT_ToggleGlobalFilterButton table={table}  />
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
      </Box>
    ),

    renderBottomToolbar: ({ table }) => (
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box
          sx={{
            "& .MuiBox-root": { padding: "0px !important" },
            "& .MuiTypography-root": { fontSize: 11 },
          }}
        >
          <MRT_TablePagination
            table={table}
            rowsPerPageOptions={[50, 100, 200, 300, 500]}
            showRowsPerPage
          />
        </Box>
      </Box>
    ),

    renderEmptyRowsFallback: () =>
      isFetching ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <BarLoaderWrapper />
        </Box>
      ) : (
        <Typography sx={{ textAlign: "center", padding: "20px" }}>
          No command records found.
        </Typography>
      ),
      muiTableBodyRowProps: ({ row }) => ({
        sx: {
          backgroundColor: row.index % 2 === 0 ? 'rgb(226, 228, 231)' : '#ffffff', 
          '&:hover': {
            backgroundColor: 'rgb(168, 200, 247)', 
          },
        },
      }),
  });

  return <MaterialReactTable table={table} />;
};

export default CommandTable;
