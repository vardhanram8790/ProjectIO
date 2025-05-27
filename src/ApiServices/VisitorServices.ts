import axios from "axios";
import { enqueueSnackbar } from "notistack";

const Base_URL = import.meta.env.VITE_BASE_URL;

export const generateVisitor = async (visitorData: any) => {
  try {
    const response = await axios.post(`${Base_URL}api/set/GenerateVisitorPass`, visitorData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { statusMessage,statusCode, data, error } = response.data;
    if (statusCode==1) {
      return {
        success: true,
        message: statusMessage || "Visitor pass generated successfully",
        data: data || null,
      };
    } else {
     
      return {
        success: false,
        message: statusMessage || "Failed to generate visitor pass",
        error: error || null,
      };
    }
  } catch (error) {
    enqueueSnackbar("Something went wrong while generating visitor pass", { variant: "error" });
    console.error("Error fetching visitorData:", error);
    return {
      success: false,
      message: "An error occurred while generating the visitor pass",
      error: error,
    };
  }
};


export const autoFilter = async (data:any) => {
    try {
        const response = await axios.get(`${Base_URL}api/get/visitor/autofilter?number=${data}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
        return [];
    }
};

export const getVisitorHistory = async (fromDate: string, toDate: string) => {
    try {
      const response = await axios.get(
        `${Base_URL}api/get/visitorlog?startDate=${fromDate}&endDate=${toDate}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching History Commands:", error);
      return [];
    }
  };

  export const getEmployeeLog = async (fromDate: string, toDate: string) => {
    try {
      const response = await axios.get(
        `${Base_URL}api/get/employeelog?startDate=${fromDate}&endDate=${toDate}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching History Commands:", error);
      return [];
    }
  };


   


  