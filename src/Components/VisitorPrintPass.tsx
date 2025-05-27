import { useLocation } from "react-router-dom";
import { Box, Typography, Grid, Avatar, Paper, Button } from "@mui/material";

const labelMap = {
  accessCardNo: "Access Card No",
  visitorsName: "Visitor Name",
  governmentIdType: "Government ID Type",
  aadharNo: "Aadhar No",
  visiotorsCompany: "Visitor’s Company",
  department: "Department",
  personToMeet: "Person to Meet",
  purposeOfVisit: "Purpose of Visit",
  visitorCategory: "Visitor Category",
  passValidity: "Pass Validity",
  gender: "Gender",
  visitorsCellNo: "Mobile No",
  governmentId: "Government ID",
  nationality: "Nationality",
  remarks: "Remarks",
  areaPermit: "Area Permit",
};

const VisitorPrintPass = () => {
  const { state } = useLocation();

  if (!state) return <Typography>No data available</Typography>;

  
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box p={4} sx={{ backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
        Visitor PrintPass
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6} sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          height: '350px'
        }}>
          {Object.entries(state).map(([key, value]) => {
            if (key === "visitorPhoto") return null;
            return (
              <Typography
                variant="body1"
                key={key}
                sx={{
                  fontSize: '14px',
                  marginBottom: 1,
                  fontWeight: 500,
                }}
              >
                <strong>{labelMap[key] || key}:</strong> {value}
              </Typography>
            );
          })}
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <Avatar
            src={state.visitorPhoto}
            alt="Visitor"
            variant="rounded"
            sx={{
              width: 150,
              height: 200,
              border: "5px solid #007bff",
              boxShadow: 3,
              marginBottom: 2,
            }}
          />
          <Typography mt={1} fontSize={12} fontWeight="medium" color="textSecondary">
            Visitor Photo
          </Typography>
        </Grid>

          {/* Print Button */}
      <Box mt={3} textAlign="center">
        <Button variant="contained" color="error" onClick={handlePrint}>
          Print
        </Button>
      </Box>
      </Grid>

      {/* Instructions Section */}
      <Box mt={1}>
        <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
          Visitor Instructions
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '14px', color: '#555' }}>
          1. Please keep your Visitor Pass visible at all times while on the premises.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '14px', color: '#555' }}>
          2. In case of an emergency, please follow the evacuation instructions from security personnel.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '14px', color: '#555' }}>
          3. You are required to sign out at the reception before leaving.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '14px', color: '#555' }}>
          4. The Visitor Pass is valid for the specified period only. Please ensure you exit before the pass expires.
        </Typography>
      </Box>

    
    </Box>
  );
};

export default VisitorPrintPass;
