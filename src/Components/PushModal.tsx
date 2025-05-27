import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { PushBox } from "../Styles/ModalStyle";
import { PushButton } from "../Styles/MasterStyle";
import { getZones } from "../ApiServices/ZoneServices";
import { useEffect, useState } from "react";
import { getDevicesByMultipleZones } from "../ApiServices/UserService";
import CloseIcon from '@mui/icons-material/Close';

const PushModal = ({ open, onClose, onConfirm, selectedRows }: any) => {
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [accessTypes, setAccessTypes] = useState<string[]>([]);
  const [masterDevices, setMasterDevices] = useState([])

  const cleanedData = selectedRows.map((item) => ({
    ...item,
    employeeFaceId: item.employeeFaceId ?? "",
    employeeFingerId: item.employeeFingerId ?? "",
    employeeFingerIndex: item.employeeFingerIndex ?? "",
  }));

  console.log(cleanedData);


  const fetchData = async () => {
    try {
      const allZonesFromApi = await getZones();
      setZones(allZonesFromApi || []);
    } catch (error) {
      console.error("Failed to fetch zones", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchDevicesByZones = async (zoneIds:[]) => {
    if (zoneIds.length > 0) {
      const zoneString = zoneIds.join(',')
      const response = await getDevicesByMultipleZones(zoneString)
      console.log("r", response)
      setMasterDevices(response)
    }
    else {
      setMasterDevices(zoneIds)
    }
  }

  const handleZoneChange = (zoneId: number) => {
    console.log(zoneId, "zoneId")
    setSelectedZones((prev) => {
      const updated = prev.includes(zoneId)
        ? prev.filter((id) => id !== zoneId)
        : [...prev, zoneId];
      console.log("u", updated)
      fetchDevicesByZones(updated)
      console.log("zoneNumber", updated);
      return updated;
    });
    console.log("s", selectedZones)
  };

  const handleAccessTypeChange = (type: string) => {
    setAccessTypes((prev) => {
      const newAccessTypes = [...prev];

      if (type === "Finger") {
        if (prev.includes("Finger")) {
          return newAccessTypes.filter((t) => t !== "Finger");
        } else {
          return [...newAccessTypes.filter((t) => t !== "Face"), "Finger"];
        }
      }

      if (type === "Face") {
        if (prev.includes("Face")) {
          return newAccessTypes.filter((t) => t !== "Face");
        } else {
          return [...newAccessTypes.filter((t) => t !== "Finger"), "Face"];
        }
      }

      if (prev.includes(type)) {
        return newAccessTypes.filter((t) => t !== type);
      } else {
        return [...newAccessTypes, type];
      }
    });
  };

  const handleConfirmClick = () => {
    const payload = {
      userMasters: selectedRows,
      accessValidation: {
        selectedZonesids: selectedZones.join(","),
        isFace: accessTypes.includes("Face"),
        isCard: accessTypes.includes("Card"),
        isFinger: accessTypes.includes("Finger"),
        isUser: accessTypes.includes("User"),
      },
    };

    onConfirm(payload);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <PushBox>
        <Typography variant="h6">Confirm Action</Typography>
     <Box sx={{
      borderRadius:'50%',
      position:'absolute',
      top:'2%',
      right:'2%'
     }}>
      <IconButton onClick={onClose}>
        <CloseIcon  />
      </IconButton>
     </Box>
        <Typography sx={{ mt: 2 }}>Select Access Type</Typography>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                sx={{ color: "rgb(126 222 117)" }}
                checked={accessTypes.includes("Finger")}
                onChange={() => handleAccessTypeChange("Finger")}
                disabled={accessTypes.includes("Face")}
              />
            }
            label="Finger"
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                sx={{ color: "rgb(126 222 117)" }}
                checked={accessTypes.includes("Card")}
                onChange={() => handleAccessTypeChange("Card")}
              />
            }
            label="Card"
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                sx={{ color: "rgb(126 222 117)" }}
                checked={accessTypes.includes("Face")}
                onChange={() => handleAccessTypeChange("Face")}
                disabled={accessTypes.includes("Finger")}
              />
            }
            label="Face"
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                sx={{ color: "rgb(126 222 117)" }}
                checked={accessTypes.includes("User")}
                onChange={() => handleAccessTypeChange("User")}
              />
            }
            label="User"
          />
        </Box>

        <Typography sx={{ mt: 2 }}>Select Zones</Typography>
        <Box> 
          {zones.map((zone) => (
            <FormControlLabel
              key={zone.zoneId}
              control={
                <Checkbox
                  size="small"
                  sx={{ color: "rgb(126 222 117)" }}
                  checked={selectedZones.includes(zone.zoneId)}
                  onChange={() => handleZoneChange(zone.zoneId)}
                />
              }
              label={zone.zoneName}
            />
          ))}
        </Box>

        <Typography sx={{ mt: 2 }}>Select Devices</Typography>
        <Box>
          {masterDevices.length > 0 ? (
            masterDevices.map((item) => (
              <FormControlLabel
                key={item.DeviceId}
                control={
                  <Checkbox
                    size="small"
                    sx={{ color: "rgb(126 222 117)" }}
                    // checked={selectedZones.includes(item.DeviceId)}
                  // onChange={() => handleZoneChange(zone.zoneId)}
                  />
                }
                label={item.DeviceName}
              />
            ))
          ) : (
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: 500, color: "primary.main" }}
            >
              Please select the Zones
            </Typography>
          )}
        </Box>

        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ color: "white", borderColor: "white" }}
          >
            Cancel
          </Button>
          <PushButton variant="contained" onClick={handleConfirmClick}>
            Confirm
          </PushButton>
        </Box>

      </PushBox>
    </Modal>
  );
};

export default PushModal;
