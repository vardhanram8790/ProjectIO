import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface CountingTableProps {
  tableData?: any[];
  top?: string;
  departments?: any[];
}

const CountingTable = ({ tableData = [], top, departments = [] }: CountingTableProps) => {
  const navigate = useNavigate();

  const viewLiveCountOfEmp = (categoryID: number, locationId: number) => {
    const idlocation = top === "Total" ? 0 : locationId;
    navigate('/LiveCount',{ state: { categoryID, locationId: idlocation } });
  };

  const getTotalDepartmentCount = (departmentId: number) => {
    return tableData
      .filter(item => item.departmentId === departmentId)
      .reduce((sum, item) => sum + (item.count || 0), 0);
  };

  return (
    <Box component={Paper} 
    sx={{ boxShadow: '0px -8px 15px -1px rgba(190, 174, 174, 0.3)',
     overflow: "hidden",borderRadius:'0',
     borderTop:'1px solid #ccc',borderBottomLeftRadius:'4px',
     borderBottomRightRadius:'4px' }}>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {departments.map((department: any, index: number) => {
              const departmentItem = tableData.find(item => item.departmentId === department.departmentId);
              const zoneId = departmentItem?departmentItem.zoneId : 0;
              const departmentCount = departmentItem ? departmentItem.count : 0;

              const countToDisplay = top === "Total"
                ? getTotalDepartmentCount(department.departmentId)
                : departmentCount;

              return (
                <TableRow key={index}>
                  <TableCell>
                    {department.categoryName === "Default" ? "Others" : department.departmentType}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      sx={{
                        fontWeight: "bold",
                        borderWidth: 2,
                        minWidth: 40
                      }}
                      onClick={() => viewLiveCountOfEmp(department.departmentId, zoneId)}
                    >
                      {countToDisplay}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CountingTable;
