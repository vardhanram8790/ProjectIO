import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import CommandTable from "../Components/CommandTable";

const DeviceCommandMaster = () => {
  return (
    <Box sx={{ padding: "5px 10px" }}>
      <Paper elevation={3} sx={{ padding: "5px 10px", borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Device Command
        </Typography>

        <Box 
        sx={{
          minHeight:427,
          overflowY: "auto",
          scrollbarWidth:'none'
        }}>
          <CommandTable/>
        </Box>
      </Paper>
    </Box>
  );
};

export default DeviceCommandMaster;
