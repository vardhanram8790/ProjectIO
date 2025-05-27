import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import VisitoryHistoryTable from "../Components/VisitorHistoryTable";

const VisitorHistory = () => {

  return (
    <Box sx={{ padding: "5px 10px" }}>
      <Paper elevation={3} sx={{ padding: "5px 10px", borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
         Visitor History
        </Typography>
        <Box 
        sx={{
          minHeight: 427,
          overflowY: "auto",
          scrollbarWidth:'none'
        }}>
          <VisitoryHistoryTable/>
        </Box>
      </Paper>
    </Box>
  );
};

export default VisitorHistory;
