import { Box, Button, Grid, styled, Typography } from "@mui/material";

export const ModalBox = styled(Box)({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "13px",
    borderRadius: "2px",
    gap: "1px",
    width: "70%",
  });
  
  export const DeviceModalBox = styled(ModalBox)({
    width: "40%",
  });
  
  export const UserModalBox = styled(ModalBox)({
    display:'flex',
    flexDirection:'column',
    gap:'10px',
   
  });
  
  
export const StyledSubmit = styled(Button)(
    {
        backgroundColor: "#284495",
        textTransform: "initial"
    }
)

export const StyledCancel = styled(Button)(
    {
        backgroundColor: "orange",
        textTransform: "initial"
    }
)

export const ModalTitle = styled(Typography)(
    {
        textTransform: "initial",
        color: "white",
        paddingInline: "10px",
    }
)

export const ModalButton = styled(Button)(
    {
        backgroundColor: 'green',
        padding: '1px 1px',
        textTransform: 'initial'
    }
)




export const PushBox = styled(Box)(
    {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: "65%",
        // backgroundColor: "rgb(68 10 89)",
        backgroundColor:'white',
        borderRadius: "8px",
        color: "black",
        position:'absolute',
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        justifyContent:'center',
        padding:'20px'
    }
)

export const ErrorMessageComponent = styled(Box)(() => ({
    color: 'red',
    marginTop: '4px',
    fontSize: '11px',
    fontWeight: 500
  }));

  export const LabelComponent = styled(Grid)(() => ({
    alignItems: 'start',
    gap: '1px'
  }));
  export const ImportantMark = styled('text')(() => ({
    color: 'red'
  }));
