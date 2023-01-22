import { Client, MessageMedia, ClientSession, ClientOptions, Chat, GroupChat, LocalAuth, Buttons, PrivateChat, List, NoAuth, LegacySessionAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import ora from "ora";
import chalk from "chalk";
import cron from "node-cron";
import DB from "../config/generalDatabase"
import { SP } from "../config/conf";
import { IMessage } from "../models/whatsapp";
import moment from 'moment';
import upload from './upload';
moment().locale("es");

class Bot {
    public client: Client
    //public taskList: Array<IMessage>;
    //public queueUsers: Array<any>;
    constructor() {
        /* FOR LINUX */
        console.log('Inicia la clase bot');
        this.client = new Client({
            authStrategy: new NoAuth(), 
            puppeteer: {
                headless: true,
                product: "chrome", 
                executablePath: "/usr/bin/chromium-browser",
                args: [
                    '--use-gl=egl', '--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions'
                ]
            }
        }); 
        
        /* FOR WINDOWS OR MACOS 
        
        this.client = new Client({
            authStrategy: new NoAuth(),
            puppeteer: {
                headless: true,
                product: "chrome",
                args: [
                  '--use-gl=egl',
                  '--no-sandbox',
                  '--disable-setuid-sandbox'
                ]
            }
        });*/
        
        //this.taskList = [];
        // this.queueUsers = [];
    }

    public sessionData: any;

    start(): void {

        console.log('bot start method')

        try {
            this.withOutSession()
        } catch (error:any) {
            console.log('error: ', error);
        }
    }

    // conect() {
    //     this.client.on('ready', () => {
    //         console.log('Connectado con credenciaels');
    //         return true
    //     });
    //     return false
    // }

    public withOutSession(): void {
        console.log('withOutSession')
        const spinner = ora(`Cargando ${chalk.yellow('Validando sesión con Whatsapp...')}`);
        spinner.start();
        this.client.on('qr', qr => upload.generateImage(qr , () => {
            console.log('qr', qr)
            qrcode.generate(qr, { small: true });
        }))

        this.client.on('ready', () => {
            
            spinner.info('Client is ready!');
            console.log('Client is ready!');
            spinner.stop();
            this.listenerMessage();
        });

        this.client.on('auth_failure', (ex) => {
            spinner.fail('** Error de autentificacion vuelve a generar el QRCODE **');
            console.log('** Error de autentificacion vuelve a generar el QRCODE **',ex);
            spinner.stop();
        })

        this.client.on('authenticated', (session) => {
            spinner.info('authenticated')
            console.log('authenticated')
            spinner.stop();
        });

        this.client.initialize()
        .then(res => {
            console.log('res', res)
        })
        .catch((err) => {
            console.log('Error en cliente : ',err)
        });
    }

    // schedulerMessage = (messages: Array<IMessage>) => {
    //     try {
    //         messages.forEach((msg: IMessage) => {
    //             const { minute, hour, day, month, year, number, message } = msg;
    //             if (!number) throw "Número inválido"
    //             if (number.trim().length == 0) throw "Número inválido"
    //             if (message.trim().length == 0) throw "Mensaje inválido"

    //             const date_cron = `${minute} ${hour} ${day} ${month} *`;
    //             const valid = cron.validate(date_cron);
    //             if (!valid) throw "Formato de fecha inválido"

                
    //             /* Guarda la tarea que intentamos programar */
    //             let params = [{ 
    //                 METADATA: JSON.stringify({
    //                     ...msg,
    //                     program_at: moment(new Date(year, month, day, hour, minute)).format('YYYY-MM-DD h:mm:ss'),
    //                 })
    //             }];
    //                 //console.log('params', params)
    //             DB.exec(params, SP.APPOINTMENT.SP_APPOINTMENT_NOTIFICATION_SCHEDULER)
    //             .then(
    //             (response: any) => {    
    //                 if (response) {
    //                     const crypt_id = response.recordsets[0][0].CRYPT_ID
    //                     if (crypt_id) {
    //                         if (this.taskList.findIndex(t => t.message == msg.message) == -1) {
    //                             this.taskList.push({
    //                                 ...msg,
    //                                 identifier: crypt_id
    //                             })
    //                             var task = cron.schedule(date_cron, (d) =>  {
    //                                 this.sendMessage(number, message)
    //                                 console.log('send message', crypt_id);
    //                             }, {
    //                             scheduled: false,
    //                             timezone: "America/Lima"
    //                             });

    //                             task.start();
    //                         }
    //                     }
    //                 }
    //             },
    //             (err) => {
    //                 console.log(err);
    //                 // res
    //                 // .status(200)
    //                 // .send({ status: false, message: err.originalError.info.message });
    //             }
    //             ).catch(error => {
    //                 console.log('error', error);
    //             });
    //             // } else {
    //             //     throw `Ya se tiene programada una tarea con el id ${identifier}`
    //             // }
    //         });
    //     } catch (error) {
    //         return { status: false, message: error };
    //     }
        

    //     // const task = cron.schedule('* * * * *', () => { // Run task every minute
    //     //     console.log('will execute every minute until stopped');
    //     //     // this.sendMessage(number, message)
    //     //     //     .then((res: any) => {
    //     //     //         const { ack, body, timestamp, from, to } = res;
    //     //     //         request('update/notification', {
    //     //     //             ack,
    //     //     //             body,
    //     //     //             timestamp,
    //     //     //             from,
    //     //     //             to,
    //     //     //             identifier
    //     //     //         }).then(x => {
    //     //     //             //console.log('update successfull',x)
    //     //     //         });
    //     //     //     });
    //     // }, {
    //     //     scheduled: false,
    //     //     timezone: "America/Lima"
    //     // });
    //     // task.stop()
    //     // let new_value = {
    //     //     identifier: identifier,
    //     //     task
    //     // }
    //     // this.taskList.push(new_value);
    //     // task.start(); // Manually run task now
    //     // return {
    //     //     status: valid,
    //     //     ...new_value
    //     // };

    // }

    // schedulerTaskStop = (identifier: any) => {
    //     let tasking = this.taskList.find((x, idx) => x.identifier == identifier);
    //     //this.taskList.splice(idx,1);
    //     tasking.task.stop();

    //     this.taskList.map((x, idx) => {
    //         if (x.identifier == identifier) {
    //             this.taskList.splice(idx, 1);
    //         }
    //     })
    //     return tasking;
    // }

    // getTasks = (identifier?: any) => {
    //     if (identifier) return this.taskList;

    //     let tasking = this.taskList.find(x => x.identifier == identifier);
    //     return tasking;
    // }

    newGroup = (title: string, numbers: Array<string>) => {
        this.client.createGroup(title, numbers)
        .then((data) => {
            console.log('data', data.gid)
        })
        .catch(error => {
            console.log('error')
        })
    }

    removeParticipants = (chatID: string, numbers: Array<string>) => {
        this.client.getChatById(chatID)
        .then((data: any) => {
            data.removeParticipants(numbers)
            .then((res: any) => {
                console.log('removido', JSON.stringify(res))
            })
            .catch((error: any) => {
                console.log('error', error)
            })
        })
        .catch(error => {
            console.log('error')
        })
    }

    addParticipants = (chatID: string, numbers: Array<string>) => {
        this.client.getChatById(chatID)
        .then((data: any) => {
            data.addParticipants(numbers)
            .then((res: any) => {
                console.log('Agregado', res)
            })
            .catch((error: any) => {
                console.log('error', error)
            })
        })
        .catch(error => {
            console.log('error')
        })
    }

    sendMessage = async (number: string, text: string, idMessage?: number, photo?: string) => {
        // let list = new List(text, "Instrucciones", [{
        //     title: "Cita con Nutricionista",
        //     rows: [{
        //         id:'button_tutorial', 
        //         title:'Ver tutorial ⏯️📹', 
        //         description: 'Te mostraremos un video con los pasos a seguir'
        //     },{
        //         id:'button_frecuently', 
        //         title:'Preguntas frecuentes ⁉️'
        //     }]
        // }]);

        //this.client.sendMessage(number, list)
        //var media = null;
        if(photo){

            const media = await MessageMedia.fromUrl(photo, {unsafeMime: true});
            this.client.sendMessage(number, text, {
                
                media: media
            })
            .then(res => {
                console.log('mensaje enviado', res.id)
                if (!idMessage) return
                /*Si tiene un ID de mensaje actualiza el estado en BD*/
                let params = [{ 
                    ID_MESSAGE: idMessage,
                    IDENTIFIER: res.id.id,
                    METADATA: JSON.stringify({
                        ...res
                    })
                }];
                // DB.exec(params, SP.APPOINTMENT.SP_APPOINTMENT_NOTIFICATION_SCHEDULER_UPDATE)
            })
            .catch(error=>{
                console.log('error de envio', error)
            })
        } else {
            this.client.sendMessage(number, text)
            .then(res => {
                console.log('mensaje enviado', res.id)
                if (!idMessage) return
                /*Si tiene un ID de mensaje actualiza el estado en BD*/
                let params = [{ 
                    ID_MESSAGE: idMessage,
                    IDENTIFIER: res.id.id,
                    METADATA: JSON.stringify({
                        ...res
                    })
                }];
                // DB.exec(params, SP.APPOINTMENT.SP_APPOINTMENT_NOTIFICATION_SCHEDULER_UPDATE)
            })
            .catch(error=>{
                console.log('error de envio', error)
            })
        }
        
    }
    

    // getChats = () => {
        
    //     const chats =  this.client.getChats().then((chat: Array<Chat>) =>{
    //         chat.map(x => {
    //             if (x.isGroup && x.id.user==='51987494869-1619196599') {
    //                 console.log(x)
    //                 this.client.sendMessage(x.id.user+'@g.us', "Mensaje de prueba desde el servidor, omitir por favor.");
    //             }
    //         })
    //     });
    //     return chats;
    // }


    listenerMessage = () => {

        this.client.on('message_create', (msg) => {
            //console.log('message_create', msg)
            // Fired on all message creations, including your own
            // if (msg.fromMe) {
            //     console.log('msg out', msg)
            // }
        });

        //confirma el estado de lectura del mensaje
        this.client.on('message_ack', (msg, ack) => {
            /*
                == ACK VALUES ==
                ACK_ERROR: -1
                ACK_PENDING: 0
                ACK_SERVER: 1
                ACK_DEVICE: 2
                ACK_READ: 3
                ACK_PLAYED: 4
            */

            if (ack == 3) {
                // The message was read
                console.log('Mensaje fue leido', msg.id);
            }
        });

        this.client.on('change_state', state => {
            console.log('CHANGE STATE', state);
        });

        this.client.on('change_battery', (batteryInfo) => {
            // Battery percentage for attached device has changed
            const { battery, plugged } = batteryInfo;
            console.log(`Battery: ${battery}% - Charging? ${plugged}`);
        });

        this.client.on('disconnected', (reason) => {
            console.log('Client was logged out', reason);
        });

        this.client.on('message', async msg => {
            const { from, to, body } = msg;
            console.log('message', msg)
            if (msg.body === '!buttons') {
                let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
                msg.reply(button)
                //this.client.sendMessage(msg.from, button);
            } else if (msg.body === '!list') {
                let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
                let list = new List('List body','btnText',sections,'Title','footer');
                this.client.sendMessage(msg.from, list);
            } else if (msg.body === '!leave') {
                // Leave the group
                let chat: any = await msg.getChat();
                if (chat.isGroup) {
                    chat.leave()
                } else {
                    msg.reply('This command can only be used in a group!');
                }
            }
            //34691015468@c.us
            // if (msg.body === '!ping reply') {
            //     // Send a new message as a reply to the current one
            //     msg.reply('pong');
            // }

            // console.log(msg);
            // if (msg.hasMedia) {
            //     const media = await msg.downloadMedia();
            //     saveMedia(media);
            //     // do something with the media data here
            // }

            //await greetCustomer(from);

            //console.log(body);

            //await replyAsk(from, body);

            // await readChat(from, body)
            // console.log(`${chalk.red('⚡⚡⚡ Enviando mensajes....')}`);
            // console.log('Guardar este número en tu Base de Datos:', from);

        });
    }

    // loadTasks = () => {
    //     request('list/tasks')
    //         .then(x => {
    //             if (!x.status) {
    //                 this.sendMessage(process.env.PHONE || '',
    //                     '🚨 ALERTA \nOcurrió un error en el request que inicializa las tareas programadas.\n🗒️ NOTA\nEl servicio se ejecutó correctamente pero no se programaron las tareas pendientes de base de datos.')
    //             } else {
    //                 const { data } = x.data || [];
    //                 data.map((task: IMessage) => {
    //                     this.schedulerMessage(task);
    //                 });
    //             }
    //             return x.data;
    //         })
    // }

    // queue = (data: any) => {
    //     //if (this.queueUsers.filter(e => e.ID == data.ID).length == 0) this.queueUsers.push(data);

    //     console.log(this.queueUsers);

    //     const task = cron.schedule('*/1 * * * *', () => {
    //         //this.queueUsers.map(user => {
    //         //if (user.ID == data.ID) {
    //         request('queue/users')
    //             .then(x => {
    //                 const { code, data, message, status } = x.data;
    //                 if (status && code === 200) {

    //                     data.map((x: any) => {
    //                         console.log("number", x.number, x.message)
    //                         this.sendMessage(x.number || process.env.PHONE, x.message)
    //                         task.stop();
    //                         this.queueUsers = [];
    //                     })
    //                 }
    //             })
    //         //}
    //         //})
    //     });
    //     this.queueUsers.push({
    //         task,
    //         id: data.ID
    //     })
    //     task.start();

    //     return data;
    // }

    // queue_delete = (identifier?: any) => {
    //     let queueUsers = this.queueUsers.find((x, idx) => x.id == identifier);
    //     if(queueUsers){
    //         try{
    //             queueUsers.task.stop();
    //         }catch(ex){}
    //     }

    //     this.queueUsers.map((x, idx) => {
    //         if (x.id == identifier) {
    //             this.queueUsers.splice(idx, 1);
    //         }
    //     })
    //     console.log(this.queueUsers);
    //     return queueUsers;
    // }

}

export const bot = new Bot();