export class HttpError extends Error {
    statusCode: number | undefined
    constructor(message: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const statusInternalServerError = 500
export const statusUnauthorized = 401