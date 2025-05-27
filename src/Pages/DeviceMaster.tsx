import { useEffect, useState } from "react";
import { getAllDevices, postDevice } from "../ApiServices/DeviceServices";
import AddModal from "../Components/AddModal";
import DeviceTable from "../Components/DeviceTable";
import { MasterBox, MasterModal, MasterTitle } from "../Styles/MasterStyle";
import { Device } from "../Types/Types";
import { Box } from "@mui/material";



const formFields = [
  {
    name: "deviceName",
    label: "Device Name",
    placeholder: "Device name",
    inputType: "text",
    validationType: "string",
    isRequired: true,
    min: 3,
    max: 30,
    errorMessage: {
      required: "Device Name is required",
      min: "Device Name should be at least 3 characters",
      max: "Device Name should be less than 30 characters"
    }
  },
  {
    name: "deviceIP",
    label: "Device IP",
    placeholder: "Device IP",
    inputType: "text",
    validationType: "string",
    isRequired: true,
    matches: {
      regex:
        /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
      message: "Invalid IP format",
    },
  },
  {
    name: "deviceDirection",
    label: "Device Direction",
    placeholderText: "Select direction",
    inputType: "select",
    validationType: "string",
    isRequired: true,
    options: [
      { label: "In", value: "in" },
      { label: "Out", value: "out" },
    ]
  },
  // {
  //   name: "serialNo",
  //   label: "Serial No",
  //   placeholder: "serial No",
  //   inputType: "text",
  //   validationType: "string",
  //   isRequired: true,
  //   errorMessage: {
  //     required: "serial No Name is required",
  //   }
  // },
  {
    name: "isActive",
    label: "Is Active",
    inputType: "toggle",
    validationType: "boolean",
    isRequired: true,
    value:true
  },
];


 const DeviceMaster=()=>{
   
    const [devices, setDevices] = useState<Device[]>([]);
    const [refresh, setRefresh] = useState(true);
    const [isFetching, setIsFetching] = useState(true);
    
       const fetchTableData = async () => {
          try {
              setIsFetching(true);
              const allUsersFromApi = await getAllDevices();
              setDevices(allUsersFromApi || []);
          } catch (error) {
              console.error("Failed to fetch zones:", error);
          } finally {
              setIsFetching(false);
          }
      };
      
  
    const mapDevicePayload = (data: any) => ({
      deviceId: 0,
      deviceName: data.deviceName,
      deviceIP: data.deviceIP,
      devicePort: "", 
      isActive: data.isActive === "true" || data.isActive === true,
      deviceDirection: data.deviceDirection,
      conStatus: "", 
      serialNo: data.serialNo || "1234",
      createdOn: "",
      modifiedOn: "",
    });
    
    const handleZoneSubmit = async (data: any, { reset, handleClose, setIsSubmitting }: any) => {
        setIsSubmitting(true);
        try {
          const payload = mapDevicePayload(data);
          await postDevice(payload);
          await fetchTableData();
          handleClose();
          reset();
        } catch (error) {
          console.error("Custom zone submit failed:", error);
        } finally {
          setIsSubmitting(false);
        }
      };

       useEffect(() => {
          fetchTableData()
        }, [refresh]);
  
  return(
    <MasterBox>
      <MasterModal>
       <MasterTitle>
          Device Master
        </MasterTitle>
        <AddModal
          fields={formFields}
          apiHandler={postDevice}
          mapPayload={mapDevicePayload}
          onSuccess={fetchTableData}
          onSubmitOverride={handleZoneSubmit}
        />
      </MasterModal>
      <Box sx={{
       
      }}>
      <DeviceTable fields={formFields} refresh={refresh} setRefresh={setRefresh} devices={devices} />
      </Box>
    </MasterBox>
    
  )
}
export default DeviceMaster;