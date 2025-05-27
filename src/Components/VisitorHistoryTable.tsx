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
import { getVisitorHistory } from "../ApiServices/VisitorServices";
import BarLoaderWrapper from "../Loaders/TableLoader";
import { useSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";


const VisitoryHistoryTable = () => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(yesterday);
  const [endDate, setEndDate] = useState(today);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [error, setError] = useState("");
const [data, setData] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
        try {
          if (triggerSearch && startDate && endDate) {
          const response = await getVisitorHistory(startDate, endDate);
          console.log("History", response);
          setData(response || []);
          }
          else {
            setData([]);
          }
        } catch (error) {
          enqueueSnackbar("Failed to load devices", { variant: "error" });
          console.error("Failed to fetch commands:", error);
          setData([]);
        }
        finally{
          setIsFetching(false);
        }
    };

    fetchData();
  }, [triggerSearch, startDate, endDate]);

  useEffect(()=>{
    const ReloadData = async () => {
      setIsFetching(true);
        try {
          if ( startDate && endDate) {
          const response = await getVisitorHistory(startDate, endDate);
          console.log("History", response);
          setData(response || []);
          }
          else {
            setData([]);
          }
        } catch (error) {
          enqueueSnackbar("Failed to load devices", { variant: "error" });
          console.error("Failed to fetch commands:", error);
          setData([]);
        }
        finally{
          setIsFetching(false);
        }
    };
    ReloadData()

  },[])

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => [
    {
      header: "S.No",
      Cell: ({ row }) => row.index + 1,
      size: 20,
    },
    {
      accessorKey: "visitorsName",
      header: "Visitors Name",
      size: 100,
    },
    {
      accessorKey: "accessCardNo",
      header: "Access CardNo",
      size: 100,
    },
    {
      accessorKey: "visiotorsCompany",
      header: "Visitors Company",
      size: 100,
    },
    {
      accessorKey: "personToMeet",
      header: "Person To Meet",
      size: 50,
     
    },
    {
      accessorKey: "passValidity",
      header: "Pass Validity",
      size: 100,
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
      size: 100,
    },
    {
      accessorKey: "inTime",
      header: "In Time",
      size: 100,
    },
    {
      accessorKey: "outTime",
      header: "Out Time",
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
    initialState:{ pagination: { pageSize: 15 } },
    muiTableContainerProps: {
      sx: {
        width: "100%",
        maxHeight: "280px",
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

    muiTableBodyCellProps: {
      sx: {
        fontSize: "12px",
        border: "1px solid #e0e0e0",
        padding: "4px 8px",
        whiteSpace: "nowrap",
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
        <MRT_ToggleGlobalFilterButton table={table} />
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
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? 'rgb(226, 228, 231)' : '#ffffff', 
        '&:hover': {
          backgroundColor: 'rgb(168, 200, 247)', 
        },
      },
    }),
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
  
  });

  return <MaterialReactTable table={table} />;
};

export default VisitoryHistoryTable;
