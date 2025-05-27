import axios from "axios";

const Base_URL = import.meta.env.VITE_BASE_URL;

export const getAllDepartments = async () => {
    try {
        const response = await axios.get(`${Base_URL}api/get/department?deptId=-1`);
        return response.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};

export const deleteDepartment=async (userId:any)=>{
    try{
        const response=await axios.delete(`${Base_URL}api/department/delete?departmentId=${userId}`)
    } catch(error){
        console.error("Error",error)
        return [];
    }
}

export const postDepartment = async (data:any) => {
    try {
        const response = await axios.post(`${Base_URL}api/department/set`,data,{
            headers:{
                "Content-Type":"application/json"
            }
     } );
        return data;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};
