import { Request, Response } from "express";
import { bot } from "../class/bot";

class WhatsappController {
  public sendMessage(req: Request, res: Response) {
    const {message, number, photo} = req.body;
    const dta = bot.sendMessage(number, message, undefined, photo)
    res.send(dta);
  }
  public getReport(req: Request, res: Response) {
    const {message, number, photo} = req.body;
    const dta = bot.sendMessage(number, message, undefined, photo)
    res.send(dta);
  }
  public contact(req: Request, res: Response) {
    const {name, lastname, number, email} = req.body;
    let message = `Hola ${name} ${lastname} bienvenido a Acid Jelly, somos una empresa dirigida a crecer a tu lado podemos apoyarte tanto en el diseño de tu marca como en tus retos tecnologicos.
    \nSi deseas puedes adelantarnos tus preguntas, nos comunicaremos contigo via este chat lo más Antes posible.
    \nTendremos como referencia el correo electronico que nos proporsionaste:
    \n${email}
    `
    const dta = bot.contact(number, message, undefined, '')
    res.send(dta);
  }
  public newGroup(req: Request, res: Response) {
      try {
        const { message, participants } = req.body
        if(!participants) res.status(400).send("Debe agregar una lista de participantes para el grupo");
        if(participants.length == 0) res.status(400).send("Debe agregar una lista de participantes para el grupo");
        
        const payload = bot.newGroup(message, participants)
        res.status(200).send(payload);
      } catch (ex) {
        res.status(400).send({ status: false, message: ex });
      }
  }
  public removeParticipants(req: Request, res: Response) {
    try {
      const { chatID, participants } = req.body
      if(!participants) res.status(400).send("Debe agregar una lista de participantes para el grupo");
      if(participants.length == 0) res.status(400).send("Debe agregar una lista de participantes para el grupo");
      
      const payload = bot.removeParticipants(chatID, participants)
      res.status(200).send(payload);
    } catch (ex) {
      res.status(400).send({ status: false, message: ex });
    }
  }
  public addParticipants(req: Request, res: Response) {
    try {
      const { chatID, participants } = req.body
      if(!participants) res.status(400).send("Debe agregar una lista de participantes");
      if(participants.length == 0) res.status(400).send("Debe agregar una lista de participantes");
      
      const payload = bot.addParticipants(chatID, participants)
      res.status(200).send(payload);
    } catch (ex) {
      res.status(400).send({ status: false, message: ex });
    }
  }
}

const whatsappController = new WhatsappController()

export default whatsappController