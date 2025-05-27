import { Box, InputLabel, Paper, Select, styled } from "@mui/material";

// export const StyledPaper = styled(Paper)(
//     {
//         width: '18%',
//         height: '25vh',
//         display: 'flex',
//         alignItems: 'center',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         // background: 'linear-gradient(135deg,rgb(232, 236, 241),rgb(205, 178, 225))',
//         // color: '#2c3e50'
//     }
// )

export const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    // textAlign: 'center',
    maxHeight: 62,
    display: 'flex',
    justifyContent: 'center',
    // alignItems:'center',
    gap:'5px',
    flexDirection:'column',
    borderRadius: '6px'
    
}));

export const Dropdown = styled(Box)(
    {
        minWidth: 220,
        display:'flex'
    }
)

export const DropdownBox = styled(Box)(
    {
        display: 'flex',
        gap: '10px',
        padding: '5px 10px'
    }
)

export const Container = styled(Box)(
    {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        height: '100vh',
        background: 'linear-gradient(115deg,rgb(154, 174, 235),rgb(157, 116, 172))'
    }
)

export const PaperBox = styled(Box)(
    {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingInline: '10px'
    }
)

export const PaperCount = styled('div')(({ theme }) => ({
    fontSize: 'medium',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
}));


export const TableBox=styled(Box)(
    {
         paddingInline: '10px',
    }
)


  
export const StyledSelect = styled(Select)({
width:'100%',   
    "& .MuiInputBase-input": {
      fontSize: "12px", 
      padding: "10px 10px", 
     backgroundColor:'white'
    },
  });

  export const StyledLabel = styled(InputLabel)({
    fontWeight: 'bolder',
    fontSize: '14px',
})