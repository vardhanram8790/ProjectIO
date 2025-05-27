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
    Box,
    Modal,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { getMasterZones, MasterZones, postMaster } from "../ApiServices/ZoneServices";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";
import BarLoaderWrapper from "../Loaders/TableLoader";

const ZoneMasterTable = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [viewOpen, setViewOpen] = useState(false);
    const [viewZone, setViewZone] = useState<any>(null);
    const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
    const [devices, setDevices] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allDevices, setAllDevices] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");


    const fetchTableData = async () => {
        try {
            setIsFetching(true);
            const allUsersFromApi = await getMasterZones();
            setDevices(allUsersFromApi || []);
        } catch (error) {
            enqueueSnackbar("Failed to load devices", { variant: "error" });
            console.error("Failed to fetch zones:", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchTableData();
    }, []);

    const handleViewOpen = async (zone: any) => {
        try {
            const devicesFromApi = await MasterZones(zone.zoneId);
            setAllDevices(devicesFromApi || []);
            setViewZone(zone);
            setSelectedZoneId(zone.zoneId);
            const existing = zone?.deviceIds?.split(",") || [];
            setSelectedDevices(existing);
            setViewOpen(true);
        } catch (err) {
            enqueueSnackbar("Failed to load devices", { variant: "error" });
            console.error(err);
        }
    };

    const handleMasterSubmit = async () => {
        try {
            const deviceIds = allDevices.map((d) => d.deviceId?.toString() || "");
            const deviceTypes = allDevices.map((d) =>
                selectedDevices.includes(d.deviceId?.toString()) ? "1" : "0"
            );

            const payload = {
                zoneId: selectedZoneId,
                deviceIds: deviceIds.join(","),
                deviceTypes: deviceTypes.join(","),
            };

            await postMaster(payload);
            await fetchTableData();
            setViewOpen(false);
        } catch (err) {
            enqueueSnackbar("Failed to assign master devices", { variant: "error" });
            console.error(err);
        }
    };

    const columns = useMemo<MRT_ColumnDef<any>[]>(() => [
        {
            header: "S.No",
            Cell: ({ row }) => row.index + 1,
            size: 20,
        },
        {
            accessorKey: "zoneName",
            header: "Zone Name",
            size: 100,
            Cell: ({ row }) => (
                <Button
                    variant="text"
                    onClick={() => handleViewOpen(row.original)}
                    sx={{
                        textTransform: "none",
                        padding: 0,
                        minWidth: "unset",
                        color: "blue",
                        textDecoration: "underline",
                        "&:hover": {
                            backgroundColor: "transparent",
                            textDecoration: "underline",
                        },
                    }}
                >
                    {row.original.zoneName}
                </Button>
            ),
        },
        {
            accessorKey: "deviceNames",
            header: "Master Devices",
            Cell: ({ cell }) => {
                const value = cell.getValue();
                const isMissing = !value;

                return (
                    <span
                        style={{
                            fontWeight: isMissing ? "normal" : "bold",
                            color: isMissing ? "gray" : "#333",
                            fontStyle: isMissing ? "italic" : "normal",
                        }}
                    >
                        {value || "No Master Devices"}
                    </span>
                );
            },
        },
    ], []);

    const table = useMaterialReactTable({
        columns,
        data: devices,
        enableStickyHeader: true,
        enablePagination: true,
        paginationDisplayMode: "pages",
        muiTableContainerProps: {
            sx: {
                minHeight: "340px",
                overflow: "auto",
                "&::-webkit-scrollbar": { width: "5px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#888", borderRadius: "10px" },
                "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" },
            },
        },
        muiTableHeadCellProps: {
            sx: {
                background: 'rgb(74, 104, 188)',
                color: "white",
                fontSize: "13px",
                padding: "2px 4px",
                border: "1px solid white",
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
            },
        },
        renderToolbarInternalActions: () => (
            <>
                <MRT_ToggleGlobalFilterButton table={table} />
                <MRT_ToggleFiltersButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
            </>
        ),
        renderBottomToolbar: ({ table }) => (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Box className="pagination-container">
                    <MRT_TablePagination table={table} rowsPerPageOptions={[50, 100, 200]} />
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
        enableGlobalFilter: true,
        enableDensityToggle: false,
        enableColumnActions: false,
        enableKeyboardShortcuts: false,
        enableColumnFilters: false,
        enableSorting: false,
    });

    return (
        <>
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
                                {allDevices
                                    .filter(
                                        (device: any) =>
                                            device.DeviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            device.DeviceIP?.includes(searchTerm)
                                    )
                                    .map((device: any) => (
                                        <FormControlLabel
                                            key={device.deviceId}
                                            control={
                                                <Checkbox
                                                    checked={selectedDevices.includes(device.deviceId?.toString())}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const id = device.deviceId?.toString();
                                                        setSelectedDevices((prev) =>
                                                            checked ? [...prev, id] : prev.filter((d) => d !== id)
                                                        );
                                                    }}
                                                    size="small"
                                                    color="primary"
                                                />
                                            }
                                            label={device.DeviceName || device.deviceId}
                                        />
                                    ))}

                            </Stack>
                            {allDevices.length === 0 && (
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
                    </Box>
                </Box>
            </Modal>

            <MaterialReactTable table={table} />
        </>
    );
};

export default ZoneMasterTable;
