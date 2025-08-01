// import axios from "axios"

// export const axiosInstance=axios.create({});

// export const apiConnector=(method,url,bodyData,headers,params)=>{
//     return axiosInstance({
//         method:`${method}`,
//         url:`${url}`,
//         data:bodyData ? bodyData :null,
//         headers: headers ? headers:null,
//         params:params ? params:null,
//         withCredentials:true,
//         });
// }
import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = async (method, url, bodyData, headers, params) => {
  try {
    const response = await axiosInstance({
      method: `${method}`,
      url: `${url}`,
      data: bodyData || null,
      headers: headers || null,
      params: params || null,
      withCredentials: true,
    });

    return response;
  } catch (error) {
    // Log the error to understand what's going wrong
    console.log("❌ AXIOS ERROR in apiConnector:");
    console.log("Message:", error.message);
    console.log("Status:", error?.response?.status);
    console.log("Data:", error?.response?.data);

    // Forward the error so your calling function can catch it
    throw error;
  }
};
