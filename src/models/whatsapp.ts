export interface IMessage{
    identifier: string,
    message: string;
    number: string;
    day: number;
    year: number;
    month: number;
    minute: number;
    second: number;
    hour: number;
    metadata: object;
}

export interface ITask {
    identifier: string,
    task: any,
    message: string;
    number: string;
    day: number;
    year: number;
    month: number;
    minute: number;
    hour: number;
    metadata: object;
}

export interface IResponseWhatsapp{
    body: string;
    ack: boolean;
    timestamp: number;
    from: string;
    to: string;
}

export interface IQueue{
    id_user: string;
    date: string;
    name_user: string;
    minute: string;
    number: string;
    url: string;
}