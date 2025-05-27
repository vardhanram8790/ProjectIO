
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const Base_URL = import.meta.env.VITE_BASE_URL;

export const getZoneDevices = async () => {
    try {
        const response = await axios.get(`${Base_URL}api/zone/get?ZoneId=1`);
        const locationDeviceMap: { [locationType: string]: string[] } = {};
        response.data.forEach((item: any) => {
            if (item.deviceIDs && item.locationType) {
                locationDeviceMap[item.locationType] = item.deviceIDs.split(',');
            }
        })
        return locationDeviceMap
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};

export const getZones = async () => {
    try {
        const response = await axios.get(`${Base_URL}api/zone/get?ZoneId=-1`);
        return response.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};

export const postZone = async (zoneData:any) => {
    try {
        const response = await axios.post(`${Base_URL}api/insert/update/zone?`,zoneData,{
            headers:{
                "Content-Type":"application/json"
            }
     } );
     const {statusCode,statusMessage}=response.data
     if (statusCode === 1 || statusCode === 0) {
                enqueueSnackbar(statusMessage || "zone saved successfully", { variant: "success" });
              } else {
                enqueueSnackbar(statusMessage || "Failed to save zone", { variant: "error" });
              }
        } catch(error){
            enqueueSnackbar("Something went wrong while saving zone", { variant: "error" });
        console.error("Error saving zones:", error);
        return [];
    }
};

export const deleteZone=async (zoneId:any)=>{
    try{
        const response=await axios.delete(`${Base_URL}api/zone/delete?ZoneId=${zoneId}`)
        const {statusCode,statusMessage}=response.data
     if (statusCode === 1) {
                enqueueSnackbar(statusMessage || "zone delete successfully", { variant: "success" });
              } else {
                enqueueSnackbar(statusMessage || "Failed to delete zone", { variant: "error" });
              }
        } catch(error){
            enqueueSnackbar("Something went wrong while deleting zone", { variant: "error" });
        console.error("Error",error)
        return [];
    }
}

export const zoneDevices = async (allAvailableDevices: boolean) => {
    try {
        const response = await axios.get(`${Base_URL}api/device/get?deviceId=${allAvailableDevices ? "-1" : "-2"}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};

export const getMasterZones = async () => {
    try {
        const response = await axios.get(`${Base_URL}api/masterdevice/get`);
        return response.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};

export const postMaster = async (masterId:any) => {
    try {
        const response = await axios.post(`${Base_URL}api/devicetype/set/master`,masterId,{
            headers:{
                "Content-Type":"application/json"
            }
     } );
        const {statusCode,statusMessage}=response.data
     if (statusCode === 1) {
                enqueueSnackbar(statusMessage || "zone master saved successfully", { variant: "success" });
              } else {
                enqueueSnackbar(statusMessage || "Failed to save master device", { variant: "error" });
              }
        } catch(error){
            enqueueSnackbar("Something went wrong while saving master", { variant: "error" });
        return [];
    }
};

export const MasterZones = async (zoneId:any) => {
    try {
        const response = await axios.get(`${Base_URL}api/alldevice/get/byzoneid?zoneId=${zoneId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};

