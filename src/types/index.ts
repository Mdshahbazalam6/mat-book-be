
export interface TokenPayload {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    iat: number;
    exp: number;
}

export interface ICustomRequest extends Request {
    locals: TokenPayload
}