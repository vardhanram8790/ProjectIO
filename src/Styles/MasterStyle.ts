import { Box, Button, styled, TableCell, Typography } from "@mui/material";

export const MasterBox = styled(Box)(
    {
        padding: '1px 10px',
        
    }
)

export const MasterTitle = styled(Typography)(
    {
        fontSize: "medium",
        fontWeight: "bold",
        color:'rgb(20, 51, 77)' 
    }
)

export const MasterModal = styled(Box)(
    {
        paddingBlock: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
)

export const PopBox = styled(Box)
    (
        {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 5px",
            backgroundColor: "rgb(60 10 89)",
            width: "22%",
            justifyContent: "center",
            borderRadius: "8px",
           
        }
    )

export const PopButton = styled(Button)(
    {
        padding: '1px 5px',
        textTransform: 'initial',
        fontSize:'14px',
        backgroundColor:'#c95a5a'
    }
)

export const PushButton = styled(Button)(
    {
        textTransform: 'initial',
        fontSize:'14px',
        backgroundColor:'#c95a5a'
    }
)

export const StyledTableCell=styled(TableCell)(
    {
        fontWeight: 'bold', 
        color: 'white',
        padding:'1px 10px'
    }
)