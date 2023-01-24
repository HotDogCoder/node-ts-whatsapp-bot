import express, {Application} from "express";
import path from "path";
import { mainRoute, appointmentRoute, whatsAppRoute, queueRoute, uploadRoute } from "./routes";
import { scheduller } from "./class/schedulers";
import { bot } from "./class/bot";
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config({
    path: path.resolve(__dirname, '../.env')
})

class Server {
    public app: Application;
    constructor() {
        this.app = express();
        this.config();
        this.routes();
        //scheduller.init();
        bot.start();
    }
    config(): void {
        //settings
        this.app.set("port", process.env.PORT || 8000)

        //cors
        this.app.use(cors({
            origin: "https://www.acidjelly.com",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders: "Content-Type,Authorization"
        }));

        //midlewares
        this.app.use(express.json({limit: '50mb'}));
        this.app.use(express.urlencoded({limit: '50mb',extended: false}));

        //static public
        this.app.use(express.static(path.join(__dirname, 'public')))
        //this.app.use(express.static(path.join(__dirname, '../storage')))
        this.app.use('/storage', express.static(process.cwd() + '/storage'))
    }

    routes(): void {
        this.app.use('/', mainRoute);
        this.app.use('/appointment', appointmentRoute)
        this.app.use('/queue', queueRoute)
        this.app.use('/bot', whatsAppRoute)
        this.app.use('/upload', uploadRoute)
    }
    
    start(): void {
        const port  = this.app.get('port');
        this.app.listen(port);
        console.log('sever', port);
    }
}

const server = new Server();
server.start();