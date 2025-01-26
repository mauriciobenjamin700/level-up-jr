import * as mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import createConnection from "../model/database";
import jwt from 'jsonwebtoken';


export class AuthService{

    async login(
        email: string,
        password: string,
    ){

        const conection =  await createConnection();
        try{
    
            const [rows] = await conection.execute<mysql.RowDataPacket[]>(
                "SELECT * FROM users WHERE email =?", 
                [email]
            )
    
            const user = rows.length ? rows[0] : null;
    
            if (user && bcrypt.compareSync(password, user.password)){
    
                return jwt.sign(
                    {
                        id: user.id,
                        email: user.email
                    }, 
                    "your_secret_key", 
                    { expiresIn: "1h" }
                );
            } else {
                throw new InvalidCredentialsError();
            }
    
        }finally{
            await conection.end();
        }
    }
}


export class InvalidCredentialsError extends Error{
    constructor(){
        super("Invalid credentials");
    }
}