import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { StyledContainer, StyledFooter, StyledHeaderBox } from "../Styles/HomeStyle";
import Header from "./Header";
import { Typography, Box } from "@mui/material";
import PageLoader from "../Loaders/PageLoader";
import { SnackbarProvider } from "notistack";  // Import SnackbarProvider

function Home() {
  const [isOutletReady, setIsOutletReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOutletReady(false);

    const timer = setTimeout(() => {
      setIsOutletReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  if (!isOutletReady) {
    return <PageLoader />;
  }

  return (
    <SnackbarProvider maxSnack={3}> {/* Wrap the content with SnackbarProvider */}
      <StyledContainer>
        <StyledHeaderBox>
          <Header />
        </StyledHeaderBox>

        <Box sx={{ p: 2, flex: 1, }}>
          <Outlet />
        </Box>
        <StyledFooter>
          <Typography> copyright &copy; 2025 </Typography>
          <Box component={"span"}>Biometric</Box>
        </StyledFooter>
      </StyledContainer>
    </SnackbarProvider>
  );
}

export default Home;
