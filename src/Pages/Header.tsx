import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Menu, MenuItem } from "@mui/material";
import { StyledHeader, StyledHeadText } from "../Styles/HeaderStyle";
import { StyledMasterBox, Master } from "../Styles/HomeStyle";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import GroupIcon from "@mui/icons-material/Group";
import ComputerIcon from "@mui/icons-material/Computer";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import logoIcon from '../../src/assets/Logo_png-removebg-preview.png'
// import logoIcon from '../../../Biometric/public/Logo_png-removebg-preview.png'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NavigationIcon from '@mui/icons-material/Navigation';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BadgeIcon from '@mui/icons-material/Badge';
import EventNoteIcon from '@mui/icons-material/EventNote';


function Header() {
  const location = useLocation();

  // Menu States
  const [anchorElMasters, setAnchorElMasters] = useState<null | HTMLElement>(null);
  const [anchorElVisitorMgmt, setAnchorElVisitorMgmt] = useState<null | HTMLElement>(null);

  const handleMastersClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMasters(event.currentTarget);
  };

  const handleVisitorMgmtClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElVisitorMgmt(event.currentTarget);
  };


  const handleMastersClose = () => {
    setAnchorElMasters(null);
  };


  const handleVisitorMgmtClose = () => {
    setAnchorElVisitorMgmt(null);
  };

  const menuItems = [
    { name: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
  ];

  const masterItems = [
    { name: "DeviceMaster", icon: <ComputerIcon fontSize="small" /> },
    { name: "UserMaster", icon: <GroupIcon fontSize="small" /> },
    { name: "ZoneMaster", icon: <NavigationIcon fontSize="small"/> },
    { name: "MasterMapping", icon: <PersonIcon fontSize="small" /> },
    { name: "DepartmentMaster", icon: <BusinessCenterIcon fontSize="small" /> },
  ];

  const deviceMgmtItems = [
    { name: "DeviceCommand", icon: <ChatBubbleOutlineIcon fontSize="small"/> },
  ];

  const visitorItems = [
    { name: "VisitorPass", icon: <BadgeIcon fontSize="small" /> },
    { name: "VisitorHistory", icon: <EventNoteIcon fontSize="small" /> },
    { name: "EmployeeLog", icon: <ComputerIcon fontSize="small" /> },
  ];

  const navigate=useNavigate()

  

  return (
    <Box>
      <StyledHeader>
        <StyledHeadText onClick={()=>navigate('/Dashboard')}>
          <img src={logoIcon} alt="" height={'40px'}  width={'40px'} style={{
            borderRadius:'50%',
            backgroundColor:'transparent'
          }}/>
          <Typography variant="h6">Biometric</Typography>
        </StyledHeadText>

        <StyledMasterBox>
          {/* Static Menu */}
          {menuItems.map((item) => (
            <Master
              key={item.name}
              component={Link}
              to={`/${item.name}`}
              sx={{
                backgroundColor: location.pathname === `/${item.name}` ? "#6416ac" : "transparent",
              }}
            >
              {item.icon}
              <Typography>{item.name}</Typography>
            </Master>
          ))}

          {/* Masters Menu */}
          <Master
            onClick={handleMastersClick}
            sx={{
              cursor: "pointer",
              backgroundColor: masterItems.some(
                (item) => location.pathname === `/${item.name}`
              )
                ? "#6416ac"
                : "transparent",
            }}
          >
            <MenuIcon fontSize="small" />
            <Typography>Masters</Typography>
          </Master>
          <Menu
            anchorEl={anchorElMasters}
            open={Boolean(anchorElMasters)}
            onClose={handleMastersClose}
          >
            {masterItems.map((item) => (
              <MenuItem
                key={item.name}
                component={Link}
                to={`/${item.name}`}
                selected={location.pathname === `/${item.name}`}
                onClick={handleMastersClose}
              >
                {item.icon}
                <Typography sx={{ fontSize: "14px", paddingLeft: "5px" }}>
                  {item.name.replace("Master", " Master")}
                </Typography>
              </MenuItem>
            ))}
          </Menu>

          

          {/* Device Management Menu */}
          <Master
            onClick={()=>navigate('/DeviceCommand')}
            sx={{
              cursor: "pointer",
              backgroundColor: deviceMgmtItems.some(
                (item) => location.pathname === `/${item.name}`
              )
                ? "#6416ac"
                : "transparent",
            }}
          >
             <ChatBubbleOutlineIcon fontSize="small"/>
            <Typography sx={{ fontSize: "14px", paddingLeft: "5px" }}>Device Command
                </Typography>
          </Master>
         
          <Master
            onClick={handleVisitorMgmtClick}
            sx={{
              cursor: "pointer",
              backgroundColor: visitorItems.some(
                (item) => location.pathname === `/${item.name}`
              )
                ? "#6416ac"
                : "transparent",
            }}
          >
            <GroupIcon fontSize="small" />
            <Typography>Visitors</Typography>
          </Master>
          <Menu
            anchorEl={anchorElVisitorMgmt}
            open={Boolean(anchorElVisitorMgmt)}
            onClose={handleVisitorMgmtClose}
          >
            {visitorItems.map((item) => (
              <MenuItem
                key={item.name}
                component={Link}
                to={`/${item.name}`}
                selected={location.pathname === `/${item.name}`}
                onClick={handleVisitorMgmtClose}
              >
                {item.icon}
                <Typography sx={{ fontSize: "14px", paddingLeft: "5px" }}>
                  {item.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </StyledMasterBox>
      </StyledHeader>
    </Box>
  );
}

export default Header;
