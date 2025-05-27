import { MasterBox } from "../Styles/MasterStyle";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import LiveCountTable from "../Components/LiveCountTable";

const LiveCount = () => {
  return (
    <MasterBox>
      <Paper elevation={3} sx={{ padding: "5px 10px", borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          User Details
        </Typography>
        <Box sx={{ minHeight:'74vh', }}>
          <LiveCountTable  />
        </Box>
      </Paper>
    </MasterBox>
  );
};

export default LiveCount;
