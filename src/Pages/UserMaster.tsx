import { useEffect, useState } from "react";
import AddModal from "../Components/AddModal";
import UserTable from "../Components/UserTable";
import { MasterBox, MasterModal, MasterTitle } from "../Styles/MasterStyle";
import { Device } from "../Types/Types";
import { getAllUser, postUser } from "../ApiServices/UserService";
import { getZones } from "../ApiServices/ZoneServices";
import { Box } from "@mui/material";
import { getAllDepartments } from "../ApiServices/DepartmentService";



const UserMaster = () => {
const [isFetching, setIsFetching] = useState(true);
const [refresh, setRefresh] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
 
  
      const fetchTableData = async () => {
          try {
              setIsFetching(true);
              const allUsersFromApi = await getAllUser();
              setDevices(allUsersFromApi || []);
          } catch (error) {
              console.error("Failed to fetch devices:", error);
          } finally {
              setIsFetching(false);
          }
  
      };
 

      useEffect(() => {
        fetchTableData()
      }, [refresh]);

  const mapDevicePayload = (data: any) => ({
    employeeName: data.employeeName,
    employeeCode: data.employeeCode,
    employeeRFIDNumber: data.employeeRFIDNumber,
    employeeFingerId:data.employeeFingerId || " ",
    employeeFaceId:data.employeeFaceId || " ",
    employeeFingerIndex: data.employeeFingerIndex || " ",
    employeeFacelength:Number(data.employeeFacelength) || 0,
    contactNo:data.contactNo || " ",
    zoneIds: data.zoneNames.join(',') || "",
    isActive:data.isActive===true?1:0,
   gender:data.gender==="male"?"male":"female",
   departmentId:Number(data.departmentId) || 0
  });

  const [zoneOptions, setZoneOptions] = useState([]);
  
  useEffect(() => {
    fetchZones();
    fetchDepartments();
  }, []);

  const fetchZones = async () => {
      const response = await getZones();
      console.log("allzones",response)
      const formattedZones = response.map((zone) => ({
        label: zone.zoneName, 
        value: zone.zoneId,    
      }));
      setZoneOptions(formattedZones);
  };
const [DepartmentOptions,setDepartmentOptions]=useState([]);
  const fetchDepartments=async ()=>{
    const response=await getAllDepartments();
    const formattedDepts=response.map((item)=>({
      label:item.departmentType,
      value:item.departmentId
    }))
    setDepartmentOptions(formattedDepts)
  }
  const formFields = [
    {
      name: "employeeName",
      label: "Employee Name",
      placeholder: "Employee Name",
      inputType: "text",
      validationType: "string",
      isRequired: true,
      min: 3,
      max: 30,
      errorMessage: {
        required: "Employee Name is required",
        min: "Employee Name should be at least 3 characters",
        max: "Employee Name should be less than 30 characters"
      }
    },
    {
      name: "employeeCode",
      label: "Employee Code",
      placeholder: "Employee Code",
      inputType: "text",
      validationType: "number",
      isRequired: true
    },
    {
      name: "employeeRFIDNumber",
      label: "Employee RFID Number",
      placeholder: "Employee RFID Number",
      inputType: "text",
      validationType: "string",
      isRequired: false,
    },
    {
      name: "contactNo",
      label: "Contact Number",
      placeholder: "Contact Number",
      inputType: "text", 
      validationType: "contactNo",
      isRequired: true,
    },
    {
      name: "zoneNames",
      label: "Zone Names",
      placeholder: "Select Zones",
      inputType: "multiselect",     
      validationType: "array",      
      isRequired: true,          
      options:zoneOptions
    }
  ,
  {
    name: "departmentId",
    label: "Department Names",
    inputType: "select",
    placeholder: "Select Department",
    validationType: "string",
    isRequired: true,
    options: DepartmentOptions
  },  
  {
    name: "gender",
    label: "Gender",
    inputType: "select",
    placeholder: "Select Status",
    validationType: "string",
    isRequired: false,
    options: [
      {
        label: "Male",
        value: "male"
      },
      {
        label: "Female",
        value: "female"
      }
    ]
  },
  {
    name: "isActive",
    label: "Is Active",
    inputType: "toggle",
    validationType: "boolean",
    isRequired: true,
    value:true
  },
    
  ];

  const handleZoneSubmit = async (data: any, { reset, handleClose, setIsSubmitting }: any) => {
      setIsSubmitting(true);
      try {
        const payload = mapDevicePayload(data);
        await postUser(payload);
        await fetchTableData();
        handleClose();
        reset();
      } catch (error) {
        console.error("Custom zone submit failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

 
  
  return (
    <MasterBox>
      <MasterModal>
        <MasterTitle>
          User Master
        </MasterTitle>
        <AddModal
          fields={formFields}
          apiHandler={postUser}
          mapPayload={mapDevicePayload}
          onSuccess={fetchTableData}
           modalType="user"
           onSubmitOverride={handleZoneSubmit}
        />
      </MasterModal>
     <Box sx={{
      paddingBlock:'5px'
     }}>
     <UserTable fields={formFields} devices={devices} refresh={refresh}
      setRefresh={setRefresh} />
     </Box>
    </MasterBox>

  )
}
export default UserMaster;