import cron from "node-cron";
import DB from "./../config/generalDatabase"
import moment from 'moment';
import dotenv from "dotenv";
import { SP, request } from "./../config/conf";
import { IMessage } from "../models/whatsapp";
moment().locale("es");
dotenv.config()

class Scheduller {
    public init():void {
        try {
            /* Ejecuto el cron todos los dias a las 8am */
            console.log('S', process.env.SCHEDULER_DOCTOR)
            var task = cron.schedule(process.env.SCHEDULER_DOCTOR || "0 8 * * *", (d) =>  { //POR DEFECTO SE EJECUTA A LAS 8 AM TODOS LOS DIAS
                DB.exec([], SP.SCHEDULERS.SP_WHATSAPP_NOTIFICATION_SCHEDULE_PROGRAMMING_DOCTOR)
                .then((respo: any) => {
                    if (respo) {
                        if(respo.recordsets.length == 0) return
                        let response = respo.recordsets[0][0]
                        let data = Object.keys(response).map(k => response[k])
                        data.map(d => {
                            let json: Array<IMessage> = JSON.parse(d)
                            json.map((msg: IMessage) => {
                                request(msg.metadata)
                                .then(data => {
                                    let params = [{
                                        IDENTIFIER: msg.identifier,
                                        METADATA: JSON.stringify({
                                            ...data
                                        })
                                    }];
                                    DB.exec(params, SP.APPOINTMENT.SP_APPOINTMENT_NOTIFICATION_SCHEDULER_UPDATE)
                                })
                            })
                        })
                    }
                })
                .catch(error => {
                    console.log('error', error);
                })
            }, {
            scheduled: false,
            timezone: "America/Lima"
            });
            task.start();


            
        } catch (ex) {
            console.log('error', ex);
        }
    }
}

export const scheduller = new Scheduller()