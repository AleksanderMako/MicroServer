
export default class LoginResponseDTO {
    public status?: string;
    public token?: string;
    public username?: string;
    public hasError: boolean;
    public error: any;
}