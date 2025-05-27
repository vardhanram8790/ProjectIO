import { Box, Grid2, styled, TextField } from "@mui/material";
import { Link } from "react-router-dom";


export const StyledContainer = styled(Box)(
    {
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(115deg,rgb(154, 174, 235),rgb(174, 140, 186))',
        // height:'100vh'
    }
)

export const StyledMasterBox = styled(Box)(
    {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: '5px 10px',
    }
)

export const Master = styled(Box)(
    {
        display: 'flex',
        color: 'white',
        paddingInline: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: "5px",
        textDecoration: 'none',
        gap: '8px',
        '& .MuiTypography-root': {
            fontSize: '14px',
            fontWeight: '500'
        }
    }
)

export const MasterTitleBox = styled(Box)(
    {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingInline: '10px'
    }
)

export const ButtonBox = styled(Box)(
    {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingInline: '10px',
    }
)

export const ModalHead = styled(Box)(
    {
        backgroundColor: '#2ca32c',
        display: 'flex', 
        justifyContent: 'space-between',
         alignItems: 'center'
    }
)

export const ModalButtonBox = styled(Box)(
    {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '5px',
        padding: '10px',
    }
)

export const FormBox = styled(Box)(
    {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '5px 10px',
        flexWrap: 'wrap',
        gap: '10px'
    }
)

export const FormComponent = styled(Grid2)(({ theme }) => ({
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column'
    }
}));

export const Formitem = styled(Grid2, {
    shouldForwardProp: prop => prop !== 'isActive' && prop !== 'noOfColumn' && prop !== 'maxWidth'
})<any>(({ theme, noOfColumn, maxWidth }) => ({
    maxWidth: maxWidth ? maxWidth : 'none',
    width: `calc(100%/${noOfColumn})`,
    flexDirection: 'column',
    paddingLeft: '10px',
    paddingRight: '10px',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
        width: '100%'
    }
}));
export const StyledError = styled(Box)({
    color: 'red',
    fontSize: '12px',
    marginBlock: '2px',
})

export const StyledTable = styled(Box)(
    {
        paddingInline: '10px',
    }
)

export const StyledFooter = styled(Box)(
    {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        fontWeight: 'bolder',
        fontSize: '14px',
        // position: "fixed",
        bottom: 0,
        width: "100%",
        color: "white",
        paddingBlock: "10px",
         background: 'linear-gradient(115deg,rgb(154, 174, 235),rgb(174, 140, 186))',
    }
)

export const StyledMasterTitle = styled(Box)(
    {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        color: 'tomato',
        paddingInline: '10px',

    }
)


export const StyleTableEdit = styled(Box)({

    padding: '4px',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    color: 'green',
    cursor: 'pointer'
})

export const StyleTableDelete = styled(Box)({

    padding: '4px',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
})


export const StyledTextField = styled(TextField)(
    {
        "& .MuiInputBase-input": {
            fontSize: "14px",
            padding: "4px 8px",
            color: "text.secondary",
        },
    }
)


export const StyledHeaderBox = styled(Box)(
    {
        width: '100%',
    }
)

export const StyledLink = styled(Link)(
    {
        textDecoration: 'none',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        padding: '5px 10px'
    }
)