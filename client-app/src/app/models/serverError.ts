export enum HttpStatusCode {
    OK = 200,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    UnprocessableEntity = 422,
    InternalServerError = 500,
    ServiceUnavailable = 503
}

export interface ServerError {
    statusCode: number;
    message: string;
    details: string;
}

export type ValidationErrors = Record<string, string[]>;

export class ServerErrorResponse implements ServerError {
    readonly statusCode: number;
    readonly message: string;
    readonly details: string;
    readonly timestamp: Date;
    readonly validationErrors?: ValidationErrors;

    private constructor(error: ServerError, validationErrors?: ValidationErrors) {
        this.statusCode = error.statusCode;
        this.message = error.message;
        this.details = error.details;
        this.timestamp = new Date();
        this.validationErrors = validationErrors;
    }

    get isSuccess(): boolean {
        return this.statusCode >= 200 && this.statusCode < 300;
    }

    get isClientError(): boolean {
        return this.statusCode >= 400 && this.statusCode < 500;
    }

    get isServerError(): boolean {
        return this.statusCode >= 500;
    }

    get isNotFound(): boolean {
        return this.statusCode === HttpStatusCode.NotFound;
    }

    get isBadRequest(): boolean {
        return this.statusCode === HttpStatusCode.BadRequest;
    }

    get isUnauthorized(): boolean {
        return this.statusCode === HttpStatusCode.Unauthorized;
    }

    get isForbidden(): boolean {
        return this.statusCode === HttpStatusCode.Forbidden;
    }

    get isConflict(): boolean {
        return this.statusCode === HttpStatusCode.Conflict;
    }

    get isUnprocessableEntity(): boolean {
        return this.statusCode === HttpStatusCode.UnprocessableEntity;
    }

    get hasValidationErrors(): boolean {
        return !!this.validationErrors && Object.keys(this.validationErrors).length > 0;
    }

    get friendlyMessage(): string {
        if (this.hasValidationErrors) {
            return this.getValidationErrorMessage();
        }

        switch (this.statusCode) {
            case HttpStatusCode.NotFound:
                return 'The requested resource was not found';
            case HttpStatusCode.BadRequest:
                return 'Invalid request. Please check your input';
            case HttpStatusCode.Unauthorized:
                return 'You need to be logged in to perform this action';
            case HttpStatusCode.Forbidden:
                return 'You do not have permission to perform this action';
            case HttpStatusCode.Conflict:
                return 'This operation conflicts with an existing resource';
            case HttpStatusCode.UnprocessableEntity:
                return 'The request was well-formed but contains invalid data';
            case HttpStatusCode.InternalServerError:
                return 'An internal server error occurred';
            case HttpStatusCode.ServiceUnavailable:
                return 'The service is temporarily unavailable';
            default:
                return this.message || 'An unexpected error occurred';
        }
    }

    private getValidationErrorMessage(): string {
        if (!this.validationErrors) return '';
        
        const errors = Object.entries(this.validationErrors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ');
        
        return `Validation failed - ${errors}`;
    }

    static fromError(error: ServerError, validationErrors?: ValidationErrors): ServerErrorResponse {
        return new ServerErrorResponse(error, validationErrors);
    }

    static fromAxiosError(error: any): ServerErrorResponse {
        const statusCode = error?.response?.status || HttpStatusCode.InternalServerError;
        const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
        const details = error?.response?.data?.details || '';
        const validationErrors = error?.response?.data?.errors;

        return new ServerErrorResponse(
            { statusCode, message, details },
            validationErrors
        );
    }

    static createDefault(
        statusCode: number,
        message = '',
        details = '',
        validationErrors?: ValidationErrors
    ): ServerErrorResponse {
        return new ServerErrorResponse({ statusCode, message, details }, validationErrors);
    }

    static createNotFound(message = 'Resource not found'): ServerErrorResponse {
        return ServerErrorResponse.createDefault(HttpStatusCode.NotFound, message);
    }

    static createBadRequest(
        message = 'Bad request',
        validationErrors?: ValidationErrors
    ): ServerErrorResponse {
        return ServerErrorResponse.createDefault(
            HttpStatusCode.BadRequest,
            message,
            '',
            validationErrors
        );
    }

    static createUnauthorized(message = 'Unauthorized'): ServerErrorResponse {
        return ServerErrorResponse.createDefault(HttpStatusCode.Unauthorized, message);
    }

    static createForbidden(message = 'Forbidden'): ServerErrorResponse {
        return ServerErrorResponse.createDefault(HttpStatusCode.Forbidden, message);
    }

    static createConflict(message = 'Resource conflict'): ServerErrorResponse {
        return ServerErrorResponse.createDefault(HttpStatusCode.Conflict, message);
    }

    static createUnprocessableEntity(
        message = 'Validation failed',
        validationErrors?: ValidationErrors
    ): ServerErrorResponse {
        return ServerErrorResponse.createDefault(
            HttpStatusCode.UnprocessableEntity,
            message,
            '',
            validationErrors
        );
    }

    static createServerError(message = 'Internal server error'): ServerErrorResponse {
        return ServerErrorResponse.createDefault(HttpStatusCode.InternalServerError, message);
    }

    static createServiceUnavailable(message = 'Service unavailable'): ServerErrorResponse {
        return ServerErrorResponse.createDefault(HttpStatusCode.ServiceUnavailable, message);
    }

    toJSON(): ServerError & { timestamp: string; validationErrors?: ValidationErrors } {
        return {
            statusCode: this.statusCode,
            message: this.message,
            details: this.details,
            timestamp: this.timestamp.toISOString(),
            ...(this.validationErrors && { validationErrors: this.validationErrors })
        };
    }

    toString(): string {
        const base = `[${this.statusCode}] ${this.friendlyMessage}`;
        const details = this.details ? ` - ${this.details}` : '';
        const timestamp = ` (${this.timestamp.toISOString()})`;
        return base + details + timestamp;
    }

    toResponseHeaders(): Record<string, string> {
        return {
            'X-Error-Code': this.statusCode.toString(),
            'X-Error-Message': this.friendlyMessage,
            'X-Error-Timestamp': this.timestamp.toISOString()
        };
    }
} 