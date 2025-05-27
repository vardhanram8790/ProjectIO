import { Box, Typography, Grid, Button, Skeleton, Divider, Alert, Snackbar } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDepartments } from "../ApiServices/DepartmentService";
import CountingTable from "../Components/CountingTable";
import {
  StyledPaper,
  PaperCount,
  TableBox,
} from "../Styles/DashboardStyle";
import { getdashboardData, getPunchInOut } from "../ApiServices/DashboardServices";
import CountUp from "react-countup";
import DashboardTable from "../Components/DashboardTable";
import FingerprintScanner from "../Dialog/Fingerprint";

// Dynamic HSL color generation function for table headers without repetition
let usedColors = new Set();

const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);  // Random hue across the full color spectrum (0-360)

  // Vary saturation and lightness dynamically to get a range of bright and dark colors
  const saturation = Math.floor(Math.random() * 21) + 40;  // 40% to 60% saturation
  const lightness = Math.random() < 0.5
    ? Math.floor(Math.random() * 21) + 40  // Light colors (40% to 60% lightness)
    : Math.floor(Math.random() * 21) + 20;  // Dark colors (20% to 40% lightness)

  let color;
  
  // Ensure no repeated colors
  do {
    color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  } while (usedColors.has(color));

  usedColors.add(color);  // Store the color to avoid future repetition

  return color;
};


const Dashboard = () => {
  const [dashTable, setDashTable] = useState<any[]>([]);
  const [dashHeader, setDashHeader] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundColors, setBackgroundColors] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showAlert, setShowAlert] = useState(false)
  const [punchData, setPunchData] = useState({})
  const [punchPayload, setPunchPayload] = useState('')
  const backgroundColorsRef = useRef<string[]>([]);

  const navigate = useNavigate();


  // Generate random colors only on the first load

  const generateColors = () => {
    const colors = dashHeader.map(() => getRandomColor()); // Generate a random color for each item in dashHeader
    setBackgroundColors(colors); // Store the colors in the state
  };

  useEffect(() => {
    if (dashHeader.length > 0 && backgroundColorsRef.current.length === 0) {
      // One extra for the Total block
      const colors = Array.from({ length: dashHeader.length + 1 }, () => getRandomColor());
      backgroundColorsRef.current = colors;
      setBackgroundColors(colors);
    }
  }, [dashHeader]);

  const fetchDashboardData = async () => {
    try {
      const response = await getdashboardData();
      setDashHeader(response.dashboardHeader || []);
      setDashTable(response.dashboardTable || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [dashboardResponse, departmentResponse] = await Promise.all([
        getdashboardData(),
        getAllDepartments(),
      ]);
      setDashHeader(dashboardResponse.dashboardHeader || []);
      setDashTable(dashboardResponse.dashboardTable || []);
      setDepartments(departmentResponse || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };



  const handlePunch = async () => {
    try {
      console.log("Current Punch Payload before API call: ", punchPayload);

      const res = await getPunchInOut(punchPayload);
      console.log("Punch-in Response: ", res);

      if (res) {
        console.log("Setting new Punch Payload: ", res?.employeeCode);

        setPunchData(res);
        setPunchPayload(res?.employeeCode);

        console.log("Current Punch Payload: ", punchPayload);

        setOpenSnackbar(true);
        setShowAlert(true);

        getPunchInOut(res.employeeCode);
      }
    } catch (error) {
      console.error("Error fetching punch-in data:", error);
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate eSSL punch-in event
      handlePunch();
    }, 5000); // Every 5 seconds (for testing purposes)

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setPunchPayload('0')
  }, [])


  useEffect(() => {
    fetchAll();
    generateColors();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleViewCount = (categoryID: number, locationId: number) => {
    navigate("/LiveCount", { state: { categoryID, locationId } });
  };


  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={120} />
              <Skeleton variant="rectangular" height={150} sx={{ mt: 2 }} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" width={150} height={40} />
          <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid
        container
        spacing={3}
        sx={{
          flexWrap: "nowrap",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {/* Total Table */}
        {dashHeader.length >= 0 && dashTable.length >= 0 ? (
          <Grid item xs={12} sm={6} md={3} display={"flex"} flexDirection={"column"} >
            <StyledPaper
              elevation={3}
              sx={{
                backgroundColor: backgroundColors[0], position: "relative",
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0'
              }}
            >
              <Button onClick={() => handleViewCount(0, 0)} sx={{
                justifyContent: 'flex-start'
              }}>
                <Typography
                  sx={{
                    fontSize: 26,
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease-in-out",
                    color: 'white'
                  }}
                >
                  <CountUp
                    end={dashHeader.reduce((sum, item) => sum + (item.count || 0), 0)}
                    duration={1.5}
                  />
                </Typography>
              </Button>
              <PaperCount sx={{
                color: 'white'
              }}>Total</PaperCount>

            </StyledPaper>

            <CountingTable
              tableData={dashTable}
              top="Total"
              departments={departments}
            />
          </Grid>) : (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: "center",
                padding: 4,
                border: "1px dashed #ccc",
                borderRadius: 2,
                color: "#999",
              }}
            >
              <Typography variant="h6">No dashboard data available</Typography>
            </Box>
          </Grid>
        )}

        {/* Zone-wise Cards */}
        {dashHeader.map((item: any, index: number) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={item.zoneId}
            display={"flex"}
            flexDirection={"column"}
          >
            <StyledPaper
              elevation={3}
              sx={{
                backgroundColor: backgroundColors[index + 1],
                position: "relative",
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0'
              }}
            >
              <Button onClick={() => handleViewCount(0, item.zoneId)} sx={{
                justifyContent: 'flex-start'
              }}>
                <Typography
                  sx={{
                    fontSize: 26,
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease-in-out",
                    color: 'white'
                  }}
                >
                  <CountUp end={item.count} duration={1.5} />
                </Typography>
              </Button>

              <PaperCount sx={{
                color: 'white'
              }}>{item.zoneName}</PaperCount>
            </StyledPaper>

            <CountingTable
              tableData={dashTable.filter((m) => m.zoneId === item.zoneId)}
              top={item.zoneName}
              departments={departments}
            />
          </Grid>
        ))}
      </Grid>


      <Box sx={{ width: '100%', my: 4, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Divider sx={{
          display: 'flex',
          alignItems: 'center',
          '&::before, &::after': {
            borderTop: '1px solid #ccc',
            flex: 1,
          },
          color: '#555',
          fontWeight: 500,
          fontSize: '1rem'
        }}>
          <Typography
            variant="body1"
            sx={{
              px: 2,
              color: '#333',
              fontWeight: 500,
              fontSize: '1rem',
            }}
          >
            Device Table
          </Typography>
        </Divider>

        <TableBox>
          <DashboardTable />
        </TableBox>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            '& .MuiPaper-root': {
              boxShadow: '0 8px 20px rgba(0, 255, 255, 0.4)', // strong cyan shadow
              borderRadius: '10px',
            },
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            icon={false}
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(to right, rgb(2, 10, 12), rgb(4, 22, 44))',
              color: 'white',
              borderRadius: '8px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '10px',
            }}
          >

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <FingerprintScanner />
              {punchData.employeeName} Punch-in detected at {punchData.deviceName} on {punchData.dateAndTime}
            </Box>

          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Dashboard;