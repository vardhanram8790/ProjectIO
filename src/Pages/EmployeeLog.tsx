import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import EmployeeLogTable from "../Components/EmployeeLogTable";


const EmployeeLog = () => {
  return (
    <Box sx={{ padding: "5px 10px" }}>
      <Paper elevation={3} sx={{ padding: "5px 10px", borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
        Employee Log
        </Typography>
        <Box 
        sx={{
          minHeight:427,
          overflowY: "auto",
          scrollbarWidth:'none'
        }}>
          <EmployeeLogTable/>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeLog;
