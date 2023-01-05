import { Request, Response } from "express";
import fs from 'fs';

class Main {

    public index(req: Request, res: Response) {
        //res.send('Server online')
        res.writeHead(200, { 'content-type': 'image/svg+xml' });
        fs.createReadStream(`${__dirname}/../../storage/whatsapp/qr-code.svg`).pipe(res);
    }

    // public storage(url: String, res: Response) {
    //     res.writeHead(200, { 'content-type': 'image/png' });
    //     fs.createReadStream(`${__dirname}/../../storage/whatsapp/qr-code.svg`).pipe(res);
    // }
}

const main = new Main()

export default main