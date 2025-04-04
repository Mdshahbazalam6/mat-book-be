interface IResponse {
    success: boolean;
    message?: string;
    error_code?: number;
    data: any;
}

export const responseFormatter = ({ success, data, message, error_code }: IResponse) => {
    const responseObject: IResponse = { success, message, data }
    if (!success) {
        responseObject.error_code = error_code ?? 500
    }
    if (!success && !message) {
        responseObject.message = 'Unknown error'
    }
    return responseObject;
}