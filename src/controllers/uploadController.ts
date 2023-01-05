import { Request, Response } from "express";
import fs from 'fs';
import { send } from "process";

class Upload {

    public upload_screenshot(req: Request, res: Response) {
        //res.send('Server online')
        //req.files
        var paths:any[] = [];
        if(req.files){
            (req.files as Array<Express.Multer.File>).map(
                x => {
                    paths.push(x.path)
                }
            )

            res.status(200).json({
                ok: true,
                paths: paths
            })
        } else {
            res.status(500).json({
                ok: false
            })
        }
    }
}

const main = new Upload()

export default main