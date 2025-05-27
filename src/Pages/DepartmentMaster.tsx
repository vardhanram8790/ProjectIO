import { useEffect, useState } from "react";
import AddModal from "../Components/AddModal";
import { MasterBox, MasterModal, MasterTitle } from "../Styles/MasterStyle";
import { Box } from "@mui/material";
import DepartMentTable from "../Components/DepartmentTable";
import { getAllDepartments, postDepartment } from "../ApiServices/DepartmentService";

const DepartmentMaster = () => {
const [isFetching, setIsFetching] = useState(true);
const [refresh, setRefresh] = useState(true);
  const [devices, setDevices] = useState([]);

   const fetchTableData = async () => {
          try {
              setIsFetching(true);
              const allUsersFromApi = await getAllDepartments();
              setDevices(allUsersFromApi || []);
          } catch (error) {
              console.error("Failed to fetch zones:", error);
          } finally {
              setIsFetching(false);
          }
      };
  
  
  
  
   useEffect(() => {
      fetchTableData()
    }, [refresh]);

  const mapDevicePayload = (data: any) => ({
    departmentId: data.departmentId || 0,
    departmentType: data.departmentType || "",
    departmentDescription: data.departmentDescription || "",
    isActive:data.isActive===true?true:false,
  });

   const handleZoneSubmit = async (data: any, { reset, handleClose, setIsSubmitting }: any) => {
      setIsSubmitting(true);
      try {
        const payload = mapDevicePayload(data);
        await postDepartment(payload);
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
      name: "departmentType",
      label: "Department Type",
      placeholder: "Department Type",
      inputType: "text",
      validationType: "string",
      isRequired: true,
    },
    {
      name: "departmentDescription",
      label: "Department Description",
      placeholder: "Department Description",
      inputType: "text",
      validationType: "string",
      isRequired: false
    },
    
  ,  
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
        <MasterTitle>
          Department Master
        </MasterTitle>
        <AddModal
          fields={formFields}
          apiHandler={postDepartment}
          mapPayload={mapDevicePayload}
          onSuccess={fetchTableData}
           modalType="user"
           onSubmitOverride={handleZoneSubmit}
        />
      </MasterModal>
     <Box sx={{
      paddingBlock:'5px',
      minHeight:300
     }}>
     <DepartMentTable fields={formFields} devices={devices}  refresh={refresh}
      setRefresh={setRefresh}/>
     </Box>
    </MasterBox>

  )
}
export default DepartmentMaster;