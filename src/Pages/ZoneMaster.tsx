import { useEffect, useState } from "react";
import AddModal from "../Components/AddModal";
import { MasterBox, MasterModal, MasterTitle } from "../Styles/MasterStyle";
import { Device } from "../Types/Types";
import { getZones, postZone, zoneDevices } from "../ApiServices/ZoneServices";
import ZoneTable from "../Components/ZoneTable";
import { Box } from "@mui/material";

const ZoneMaster = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [allZoneDevices, setAllZoneDevices] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const fetchTableData = async () => {
    try {
        setIsFetching(true);
        const allUsersFromApi = await getZones();
        setDevices(allUsersFromApi || []);
    } catch (error) {
        console.error("Failed to fetch zones:", error);
    } finally {
        setIsFetching(false);
    }
};

  useEffect(()=>{
    fetchTableData()
  },[])
  

  const fetchZones = async () => {
    const response = await zoneDevices(false);
    const allDevices = await zoneDevices(true);

    const formattedZones = response.map((zone: any) => ({
      label: zone.deviceName,
      value: zone.deviceId,
      show: true,
    }));

    setAllZoneDevices(allDevices);
    setZoneOptions(formattedZones);
  };

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    fetchTableData()
  }, [refresh]);

  const mapDevicePayload = (data: any) => ({
    zoneId: 0,
    zoneName: data.zoneName,
    deviceIDs: data.deviceNames.join(","),
    isActive: true,
    createdBy: "string",
    modifiedBy: "string",
  });

  const handleZoneSubmit = async (data: any, { reset, handleClose, setIsSubmitting }: any) => {
    setIsSubmitting(true);
    try {
      const payload = mapDevicePayload(data);
      await postZone(payload);
      await fetchTableData();
      handleClose();
      reset();
    } catch (error) {
      console.error("Custom zone submit failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: "deviceNames",
      label: "device IDs",
      placeholder: "Select Zones",
      inputType: "multiselect",
      validationType: "array",
      isRequired: true,
      options: zoneOptions,
    },
    {
      name: "zoneName",
      label: "Zone Name",
      placeholder: "Zone Name",
      inputType: "text",
      validationType: "string",
      isRequired: true,
      min: 3,
      max: 30,
      errorMessage: {
        required: "Zone Name is required",
        min: "Zone Name should be at least 3 characters",
        max: "Zone Name should be less than 30 characters",
      },
    },
    {
      name: "isActive",
      label: "Is Active",
      inputType: "toggle",
      validationType: "boolean",
      isRequired: true,
    },
  ];

  return (
    <MasterBox>
      <MasterModal>
        <MasterTitle>Zone Device Mapping</MasterTitle>
        <AddModal
          fields={formFields}
          apiHandler={postZone}
          mapPayload={mapDevicePayload}
          onSuccess={fetchTableData}
          modalType="user"
          onSubmitOverride={handleZoneSubmit}
        />
      </MasterModal>
      <Box sx={{ paddingBlock: "5px" }}>
        <ZoneTable fields={formFields} zoneOptions={zoneOptions} allZoneDevices={allZoneDevices} refresh={refresh}
      setRefresh={setRefresh} devices={devices} />
      </Box>
    </MasterBox>
  );
};

export default ZoneMaster;
