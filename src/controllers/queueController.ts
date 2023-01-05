import { Request, Response } from "express";
import moment from "moment-timezone";
import dotenv from "dotenv";
import { ITask, IQueue } from "../models/whatsapp";
import DB from "./../config/generalDatabase"
import { SP, request } from "./../config/conf";
import cron from "node-cron";
dotenv.config()

class Queue {
    public taskList: Array<ITask> = [];

    /**
     * schedulerNotification
     */
    public validateQueue(req: Request, res: Response) {
        try {
            //var fecha = timezone().tz("America/Lima")
            //console.log('fecha', fecha)
            // const { identifier } = req.body;
            // if (!identifier) throw "Indentificador inválido"
            const d = moment().tz("America/Lima").add(process.env.QUEUE_SECONDS_NOTIFY || 90 , 'seconds')
            const date_cron = `${d.format('s')} ${d.get('minutes')} ${d.get('hours')} ${d.format('D')} ${d.format('M')} *`;
            const valid = cron.validate(date_cron);
            if (!valid) throw "Formato de fecha inválido"
            console.log('date_cron', date_cron)
            var task = cron.schedule(date_cron, (t) =>  {
                DB.exec([], SP.QUEUE.SP_WHATSAPP_NOTIFICATION_QUEUE_USERS)
                .then((res: any) => {
                    if (res.recordsets.length > 0) {
                        let response = res.recordsets[0][0]
                        let data = Object.keys(response).map(k => response[k])
                        data.map(d => {
                            let json: Array<IQueue> = JSON.parse(d)
                            json.map((msg: IQueue) => {
                                request({
                                    "messaging_product": "whatsapp",
                                    "to": `${msg.number}`,
                                    "type": "template",
                                    "template": {
                                        "name": "queue_notification",
                                        "language": {
                                            "code": "es_MX"
                                        },
                                        "components": [
                                            {
                                                "type": "BODY",
                                                "parameters": [
                                                    {
                                                        "type": "text",
                                                        "text": `${msg.name_user}`
                                                    },
                                                    {
                                                        "type": "text",
                                                        "text": `${msg.minute}`
                                                    },
                                                    {
                                                        "type": "text",
                                                        "text": `${msg.date}`
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "button",
                                                "sub_type": "url",
                                                "index": 0,
                                                "parameters": [
                                                    {
                                                        "type": "text",
                                                        "text": `${msg.url}`
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                })
                                console.log('mensaje', msg)
                            });
                        });
                    }
                })
            }, {
                scheduled: false,
                timezone: "America/Lima"
            });
            task.start();
            res.status(200).send({ status: true, message: "nice!" });
        } catch (error) {
            res.status(400).send({ status: false, message: error });
        }
    }
}

const queue = new Queue()
export default queue