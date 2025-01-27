import bcrypt from "bcrypt";
import * as mysql from "mysql2/promise";
import { UserModel } from "../model/user-model";
import { Database } from "../model/database";

export class CustomerService{

    async register(
        data: {
            name: string,
            email: string,
            password: string,
            address: string,
            phone: string,
        }
    ){
        const { name, email, password, address, phone } = data;
        const conection = Database.getInstance();
        const createdAt = new Date();

        const hasedPassword = bcrypt.hashSync(password, 10);

        const userModel = await UserModel.create({
            name, 
            email, 
            password:hasedPassword
        });

        const userId = userModel.id;

        const [partnerResult] = await conection.execute<mysql.ResultSetHeader>(
            "INSERT INTO customers (user_id, address, phone, created_at) VALUES (?, ?, ?, ?)", 
            [userId, address, phone ,createdAt]
        );

        return{
            id: partnerResult.insertId,
            name: name,
            user_id: userId, 
            address: address, 
            phone: phone,
            created_at: createdAt 
        }
}
}