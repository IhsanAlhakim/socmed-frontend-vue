export class HttpError extends Error {
    statusCode: number | undefined
    constructor(message: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const statusInternalServerError = 500
export const statusUnauthorized = 401
export const statusNotFound = 404
export const statusBadRequest = 400