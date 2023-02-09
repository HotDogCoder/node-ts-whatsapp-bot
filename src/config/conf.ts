import axios, {AxiosRequestConfig} from "axios";
import dotenv from "dotenv";
dotenv.config()

export const config = {
  user: process.env.DB_USER || "user",
  password: process.env.DB_PWD || "123",
  server: process.env.DB_SERVER || "localhost",
  // server: 'localhost',
  database: process.env.DB_NAME || "",
  options: {
    trustedConnection: true,
    encrypt: true
  },
  pool: { max: 200, min: 0, idleTimeoutMillis: 10000 },
};

export const SP = {
  REPORT: {
    SP_GET_REPLY_BY_MESSAGE: "SP_GET_REPLY_BY_MESSAGE"
  },
  APPOINTMENT: {
    SP_WHATSAPP_NOTIFICATION_INSERT: "SP_WHATSAPP_NOTIFICATION_INSERT",
    SP_APPOINTMENT_NOTIFICATION_SCHEDULER: "SP_APPOINTMENT_NOTIFICATION_SCHEDULER",
    SP_APPOINTMENT_NOTIFICATION_SCHEDULER_UPDATE:  "SP_APPOINTMENT_NOTIFICATION_SCHEDULER_UPDATE"
  },
  QUEUE: {
    SP_WHATSAPP_NOTIFICATION_QUEUE_USERS: "SP_WHATSAPP_NOTIFICATION_QUEUE_USERS"
  },
  SCHEDULERS: {
    SP_WHATSAPP_NOTIFICATION_SCHEDULE_PROGRAMMING_DOCTOR: "SP_WHATSAPP_NOTIFICATION_SCHEDULE_PROGRAMMING_DOCTOR"
  },
  ERRORS: {
    SP_APPOINTMENT_NOTIFICATION_SCHEDULER_ERROR: "SP_APPOINTMENT_NOTIFICATION_SCHEDULER_ERROR"
  }
};

export const request = (data: any) => {
  const conf: AxiosRequestConfig<any> = {
    headers: {
      "Content-Type": 'application/json',
      "Authorization": `Bearer ${process.env.AUTH_API}`
    },
    method: 'post',
    url: `https://graph.facebook.com/v13.0/${process.env.FROM_PHONE}/messages`,
    data
  }
  return axios(conf).then(response => {
   console.log('response', response.data)
    // if(!response.data.status){   
    //   console.log(response.data.message ?? "Error en el servidor"); 
    //    // localStorage.clear();
    //     // window.location.assign("Error");      
    // }
    return response.data
  }).catch(error => {  console.log('error',error); return error });
}