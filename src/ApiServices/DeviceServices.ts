import axios from "axios"

const Base_URL = import.meta.env.VITE_BASE_URL;

export const getAllDevices = async () => {
    try {
        const response = await axios.get(`${Base_URL}api/device/get?deviceId=-1`);
        return response.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};

export const postDevice = async (deviceData:any) => {
    try {
        const response = await axios.post(`${Base_URL}api/device/set?`,deviceData,{
            headers:{
                "Content-Type":"application/json"
            }
     } );
        return deviceData;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};

export const deleteDevice=async (deviceId:any)=>{
    try{
        const response=await axios.delete(`${Base_URL}api/device/delete/?deviceId=${deviceId}`)
    } catch(error){
        console.error("Error",error)
        return [];
    }
}


  


