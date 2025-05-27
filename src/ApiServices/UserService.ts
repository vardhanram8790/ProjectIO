import axios from "axios";
import { enqueueSnackbar } from 'notistack';

const Base_URL = import.meta.env.VITE_BASE_URL;

export const getAllUser = async () => {
    try {
        const response = await axios.get(`${Base_URL}api/Employee/get?EmployeeId=-2`);
        return response.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};


export const postUser = async (userData: any) => {
  try {
    const response = await axios.post(`${Base_URL}api/Employee/set`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { statusCode, statusMessage } = response.data;
    if (statusCode === 1 || statusCode === 0) {
      enqueueSnackbar(statusMessage || "User saved successfully", { variant: "success" });
    } else {
      enqueueSnackbar(statusMessage || "Failed to save user", { variant: "error" });
    }
  } catch (error: any) {
    console.error("Error saving user:", error);
    enqueueSnackbar("Something went wrong while saving user", { variant: "error" });
  }
};


export const deleteUser=async (userId:any)=>{
    try{
        const response=await axios.post(`${Base_URL}api/Employee/Delete?EmployeeId=${userId}`)
        const { statusCode, statusMessage } = response.data;
        if (statusCode === 1) {
            enqueueSnackbar(statusMessage || "User delete successfully", { variant: "success" });
          } else {
            enqueueSnackbar(statusMessage || "Failed to delete user", { variant: "error" });
          }
    } catch(error){
        enqueueSnackbar("Something went wrong while deleting user", { variant: "error" });
        console.error("Error",error)
        return [];
    }
}

export const pushToDevice= async (pushData:any)=>{
   try{
    const response=axios.post(`${Base_URL}api/AddUserToDevice`,pushData,{
        headers:{
            'Content-Type':'application/json'
        }
    });
    const { statusCode, statusMessage } = (await response).data;
    if (statusCode === 1) {
        enqueueSnackbar(statusMessage || "User Pushed to device successfully", { variant: "success" });
      } else {
        enqueueSnackbar(statusMessage || "Failed to push user", { variant: "error" });
      }
    
   }
   catch(error)
   {
    enqueueSnackbar("Something went wrong while pushing user", { variant: "error" });
    console.log("error pushing to devices",error)
   }
}

export const pushFace= async (faceData:any)=>{
  try{
   const response=axios.post(`${Base_URL}api/Zkem/enrollface?devieip=${faceData.devieip}&userId=${faceData.userId}`,{
       headers:{
           'Content-Type':'application/json'
       }
   });
   const { statusCode, statusMessage } = (await response).data;
   if (statusCode === 1) {
       enqueueSnackbar(statusMessage || "User Face added to device successfully", { variant: "success" });
     } else {
       enqueueSnackbar(statusMessage || "Failed to add face", { variant: "error" });
     }
   
  }
  catch(error)
  {
   enqueueSnackbar("Something went wrong while pushing user", { variant: "error" });
   console.log("error pushing to devices",error)
  }
}

export const getDevicesByMultipleZones= async (zoneIds:any)=>{
  try{
   const response=await axios.get(`${Base_URL}api/devices/get/byzoneids?zoneIds=${zoneIds}`,{
       headers:{
           'Content-Type':'application/json'
       }
   });
   return response.data;
  }
  catch(error)
  {
   console.log("error fetching to devices",error)
  }
}

  


