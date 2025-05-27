import axios from "axios";
const Base_URL = import.meta.env.VITE_BASE_URL;

export const getdashboardData = async () => {
    try {
        const response = await axios.get(`${Base_URL}api/get/getdashboard`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Dashboard data:", error);
        return [];
    }
};

export const getLiveData = async (categoryId,locationId) => {
    try {
        const response = await axios.get(`${Base_URL}api/get/livecount?locationId=${locationId}&categoryId=${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Dashboard data:", error);
        return [];
    }
};

export const getDashboardDevices = async () => {
    try {
        const response = await axios.get(`${Base_URL}api/device/get?deviceId=0`);
        return response.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};

export const getPunchInOut = async (payload:string) => {
    try {
        const response = await axios.get(`${Base_URL}api/get/userentry?EmployeeCode=${payload}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};

