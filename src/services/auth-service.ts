import bcrypt from 'bcrypt';
import createConnection from "../model/database";
import jwt from 'jsonwebtoken';
import { UserModel } from '../model/user-model';


export class AuthService{

    async login(
        email: string,
        password: string,
    ){

        const userModel = await UserModel.findByEmail(email);

        if (userModel && bcrypt.compareSync(password, userModel.password)){

            return jwt.sign(
                {
                    id: userModel.id,
                    email: userModel.email
                }, 
                "your_secret_key", 
                { expiresIn: "1h" }
            );
        } else {
            throw new InvalidCredentialsError();
        }
    }
}


export class InvalidCredentialsError extends Error{
    constructor(){
        super("Invalid credentials");
    }
}