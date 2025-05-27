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
import {
    Autocomplete,
    Box,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import BarLoaderWrapper from "../Loaders/TableLoader";
import { DropdownBox, Dropdown } from "../Styles/DashboardStyle";
import { useLocation } from "react-router-dom";
import { getLiveData } from "../ApiServices/DashboardServices";
import SearchIcon from "@mui/icons-material/Search";

const LiveCountTable = () => {
    const handleSearch = async () => {
        try {
          const deptId = selectedDepartment?.departmentId ?? 0;
          const zoneId = selectedZone?.value ?? "0";
    
          const res = await getLiveData(deptId, zoneId);
          setEmployeeData(res.employeeTrackings || []);
        } catch (error) {
          console.error("Error fetching filtered data:", error);
        }
      };

      const location = useLocation();
  const { categoryID, locationId } = location.state || {};
  const [zoneOptionsAuto, setZoneOptionsAuto] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [employeeData, setEmployeeData] = useState<any[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsFetching(true)
        const res = await getLiveData(categoryID, locationId);
        const departments = [
          { departmentType: "All", departmentId: 0 },
          ...(res.departments || []),
        ];
        const zones = [
          { text: "All", value: "0" },
          ...(res.locations || []),
        ];

        setEmployeeData(res.employeeTrackings || []);
        setDepartmentOptions(departments);
        setZoneOptionsAuto(zones);

        const dept =
          categoryID === 0
            ? departments[0]
            : departments.find((d: any) => d.departmentId === categoryID);

        const zone =
          locationId === 0
            ? zones[0]
            : zones.find((z: any) => z.value === locationId.toString());

        setSelectedDepartment(dept || departments[0]);
        setSelectedZone(zone || zones[0]);
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setIsFetching(false);
      }
      finally{
        setIsFetching(false)
      }
    };

    fetchInitialData();
  }, [categoryID, locationId]);
    
  const [isFetching, setIsFetching] = useState(true);

  const loading =
  isFetching || !departmentOptions.length || !zoneOptionsAuto.length;
  
 
    const columns = useMemo<MRT_ColumnDef<any>[]>(() => [
        {
            header: "S.No",
            Cell: ({ row }) => row.index + 1,
            size: 20,
        },
        {
            accessorKey: "employeeCode",
            header: "employeeCode",
            size: 100,
        },
        {
            accessorKey: "userName",
            header: "userName",
            size: 50,
        },
        {
            accessorKey: "categoryName",
            header: "categoryName",
            size: 100,
        },
        {
            accessorKey: "checkedInTime",
            header: "checkedInTime",
            size: 100,
        },
        {
            accessorKey: "zoneName",
            header: "zoneName",
            size: 100,
        },
    ], []);

    const table = useMaterialReactTable({
        columns,
        data:employeeData || [],
        enableStickyHeader: true,
        enablePagination: true,
        paginationDisplayMode: "pages",
        initialState:{ pagination: { pageSize: 15 } },
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
                minHeight: "280px",
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
            <DropdownBox>
            <Autocomplete fullWidth size="small"
              options={departmentOptions}
              getOptionLabel={(option) => option.departmentType || ""}
              value={selectedDepartment}
              onChange={(e, newValue) => setSelectedDepartment(newValue)}
              isOptionEqualToValue={(option, value) =>
                option.departmentId === value?.departmentId
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Department"
                  variant="outlined"
                  size="small"
                />
              )}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 1,
                marginBottom: 2,
                "& .MuiAutocomplete-inputRoot": {
                  padding: "10px 12px",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              loading={loading}
              clearOnEscape
            />
         
            <Autocomplete fullWidth size="small"
              options={zoneOptionsAuto}
              getOptionLabel={(option) => option.text || ""}
              value={selectedZone}
              onChange={(e, newValue) => setSelectedZone(newValue)}
              isOptionEqualToValue={(option, value) =>
                option.value === value?.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Zone"
                  variant="outlined"
                  size="small"
                />
              )}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 1,
                marginBottom: 2,
                "& .MuiAutocomplete-inputRoot": {
                  padding: "10px 12px",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              loading={loading}
              clearOnEscape
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
            <SearchIcon />
          </IconButton>
        </DropdownBox>


          </Box>
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
            <MaterialReactTable table={table} />
    );
};

export default LiveCountTable;
