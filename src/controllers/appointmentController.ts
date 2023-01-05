import { Request, Response } from "express";
import cron from "node-cron";
import DB from "./../config/generalDatabase"
import moment from 'moment';
import { SP, request } from "./../config/conf";
import { IMessage, ITask } from "../models/whatsapp";
moment().locale("es");

class Appointment {
    public taskList: Array<ITask> = [];

    public schedulerNotification = (req: Request, res: Response) => {
        try {
          const { identifier } = req.body;
          if (!identifier) throw "Indenticador inválido"
            let params = [{ 
                ID_APPOINTMENT: identifier
            }];

            DB.exec(params, SP.APPOINTMENT.SP_WHATSAPP_NOTIFICATION_INSERT)
            .then(
            (respo: any) => {    
                if (respo) {
                    
                    let response = respo.recordsets[0][0]
                    let data = Object.keys(response).map(k => response[k])
                    data.map(d => {
                        let json: Array<IMessage> = JSON.parse(d)
                        json.map((msg: IMessage) => {
                            const { minute, hour, day, month, second, metadata, identifier } = msg;
                            const date_cron = `${second} ${minute} ${hour} ${day} ${month} *`;
                            //console.log(date_cron)
                            const valid = cron.validate(date_cron);
                            if (!valid) throw "Formato de fecha inválido"
                            if (identifier) {
                                //console.log('metadata', metadata)
                                var task = cron.schedule(date_cron, (d) =>  {
                                    console.log('execute cron')
                                    request(metadata)
                                    .then(data => {
                                        let params = [{
                                            IDENTIFIER: identifier,
                                            METADATA: JSON.stringify({
                                                ...data
                                            })
                                        }];
                                        DB.exec(params, SP.APPOINTMENT.SP_APPOINTMENT_NOTIFICATION_SCHEDULER_UPDATE)
                                    })
                                }, {
                                scheduled: false,
                                timezone: "America/Lima"
                                });
                                /*Agregar tarea*/
                                this.taskList.push({
                                    ...msg,
                                    identifier,
                                    task
                                })
                                /* ============ */
                                task.start();

                               
                            }
                        })
                    })
                    res.status(200).send({ status: true, message: 'Nice!' });
                }
            },
            (err) => {
                console.log(err);
                
            })
            .catch(error => {
                res.status(400).send({ status: false, message: `Error de stored: ${error}` });
                console.log('error', error);
            })
        } catch (ex) {
          res.status(400).send({ status: false, message: ex });
        }
    }

    public deleteNotification = (req: Request, res: Response) => {
        try {
            const { identifier } = req.body;
            if (!identifier) throw "Ingrese un identificador"
            
            console.log('this.taskList', this.taskList)
            console.log('identificador', identifier)

            let tasking = this.taskList.find((x, index)=> x.identifier == identifier);
            console.log('tasking', tasking)

            tasking?.task.stop();
            // DB.exec(params, SP.APPOINTMENT.SP_WHATSAPP_NOTIFICATION_INSERT)
            res
              .status(200)
              .send({ status: true, message: "nice!" });
        } catch (error) {
            res.status(400).send({ status: false, message: error });
        }
    }
}

const appointment = new Appointment()

export default appointment