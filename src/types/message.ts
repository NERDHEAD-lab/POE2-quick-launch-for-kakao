export interface LogData {
    handlerName: string;
    url: string;
    referrer: string;
    message?: string;
    timestamp: string;
}

export interface MessageRequest {
    action: string;
    shouldCloseMainPage?: boolean;
    value?: boolean;
    port?: number;
    logData?: LogData;
}
