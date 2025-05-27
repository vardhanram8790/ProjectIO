import { MasterBox, MasterModal, MasterTitle } from "../Styles/MasterStyle";
import { Box } from "@mui/material";
import ZoneMasterTable from "../Components/ZoneMasterTable";




const MasterMapping = () => {
  return (
    <MasterBox>
      <MasterModal>
        <MasterTitle>
          Zone Master Mapping
        </MasterTitle>
      </MasterModal>
     <Box sx={{
      paddingBlock:'5px'
     }}>
     <ZoneMasterTable  />
     </Box>
    </MasterBox>

  )
}
export default MasterMapping;