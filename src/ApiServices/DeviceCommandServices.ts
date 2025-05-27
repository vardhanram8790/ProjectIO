import axios from "axios";

const Base_URL = import.meta.env.VITE_BASE_URL;

export const getCommands = async (fromDate: string, toDate: string) => {
    try {
      const response = await axios.get(
        `${Base_URL}Api/DeviceCommand/get?FromDate=${fromDate}&ToDate=${toDate}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching device commands:", error);
      return [];
    }
  };
  