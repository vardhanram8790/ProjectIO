import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_TablePagination,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { getEmployeeLog } from "../ApiServices/VisitorServices";
import BarLoaderWrapper from "../Loaders/TableLoader";
import { useSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import excelImag from '../assets/excel-icon-transparent-2.png'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import pdfIcon from "../assets/pdf-file.webp";


const EmployeeLogTable = () => {
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

  const handleExportToExcel = () => {
    if (!data || data.length === 0) {
      enqueueSnackbar("No data to export", { variant: "warning" });
      return;
    }

    const exportableColumns = columns.filter((col) => !!col.accessorKey);

    const exportData = data.map((row) => {
      const formatted: Record<string, any> = {};
      exportableColumns.forEach((col) => {
        const header = col.header as string;
        const accessor = col.accessorKey as string;
        formatted[header] = row[accessor];
      });
      return formatted;
    });
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const columnWidths = Object.keys(exportData[0]).map((key) => {
      // Get the max length of the header and values in that column
      const maxLength = Math.max(
        key.length,
        ...exportData.map((row) => (row[key] ? row[key].toString().length : 0))
      );
    
      return { wch: maxLength + 2 }; // Add some padding
    });
    worksheet['!cols'] = columnWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EmployeeLog");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `employee_log_${startDate}_to_${endDate}.xlsx`);

  };


  const handleExportToPDF = () => {
    if (!data || data.length === 0) {
      enqueueSnackbar("No data to export", { variant: "warning" });
      return;
    }

    const doc = new jsPDF();

    const headers = columns
      .filter((col) => col.accessorKey) // skip S.No or Cell-only columns
      .map((col) => col.header);

    const tableData = data.map((row, index) =>
      columns
        .filter((col) => col.accessorKey)
        .map((col) => row[col.accessorKey])
    );

    // Add Title
    doc.setFontSize(14);
    doc.text(`Employee Log (${startDate} to ${endDate})`, 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [headers],
      body: tableData,
      styles: { fontSize: 8 },
      theme: "striped",
    });

    doc.save(`employee_log_${startDate}_to_${endDate}.pdf`);
  };




  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        if (triggerSearch && startDate && endDate) {
          const response = await getEmployeeLog(startDate, endDate);
          setData(response || []);
        } else {
          setData([])
        }
      } catch (error) {
        enqueueSnackbar("Failed to load devices", { variant: "error" });
        console.error("Failed to fetch commands:", error);
        setData([]);
      }
      finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [triggerSearch, startDate, endDate]);

  useEffect(() => {
    const ReloadData = async () => {
      setIsFetching(true);
      try {
        if (startDate && endDate) {
          const response = await getEmployeeLog(startDate, endDate);
          setData(response || []);
        } else {
          setData([])
        }
      } catch (error) {
        enqueueSnackbar("Failed to load devices", { variant: "error" });
        console.error("Failed to fetch commands:", error);
        setData([]);
      }
      finally {
        setIsFetching(false);
      }
    };
    ReloadData()
  }, [])

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => [
    {
      header: "S.No",
      Cell: ({ row }) => row.index + 1,
      size: 10,
    },
    {
      accessorKey: "employeeCode",
      header: "Employee Code",
      size: 50,
    },
    {
      accessorKey: "employeeName",
      header: "Employee Name",
      size: 50,
    },
    {
      accessorKey: "zoneName",
      header: "Zone Name",
      size: 50,
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 20,
    },
    {
      accessorKey: "inTime",
      header: "In Time",
      size: 20,
    },
    {
      accessorKey: "outTime",
      header: "Out Time",
      size: 20,
    },
    {
      accessorKey: "logTransaction",
      header: "Log Transaction",
      maxSize: 100,
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
    initialState: { pagination: { pageSize: 15 } },
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
        whiteSpace: "pretty",
      },
    },

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
    renderTopToolbar: ({ table }) => (
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2 }}
      >

        {/* Right: Date Filters & Export */}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
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

          <IconButton
            size="small"
            onClick={handleSearch}
            color="primary"
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": { backgroundColor: "#155fa0" },
              height: 40,
              width: 40,
              borderRadius: 1,
            }}
          >
            <SearchIcon fontSize="12px" />
          </IconButton>
        </Box>

        <Box sx={{
          display: 'flex',
          alignItems: "center"
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <MRT_GlobalFilterTextField table={table} />
          </Box>
          <Box>
            <MRT_ToggleGlobalFilterButton table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
          </Box>


          <Box
            onClick={handleExportToExcel}
            sx={{ cursor: 'pointer' }}
          >
            <img src={`${excelImag}`} alt="excel" width={'50px'} />
          </Box>
          <Box onClick={handleExportToPDF} sx={{ cursor: 'pointer' }}>
            <img src={`${pdfIcon}`} alt="pdf" width={'28px'} />
          </Box>
        </Box>
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
          No Employee Log found.
        </Typography>
      ),

  });

  return <MaterialReactTable table={table} />;
};

export default EmployeeLogTable;
