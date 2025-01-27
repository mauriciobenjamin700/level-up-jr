import * as mysql from 'mysql2/promise';
import { Database } from "../model/database";

export class UserService {


    async findById(userId: number){
        
        const conection =  Database.getInstance();
    
        const [rows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM users WHERE id = ?", 
            [userId]
        )

        return rows.length ? rows[0] : null;

    }


    async findByEmail(userEmail: number){
        
        const conection =  Database.getInstance();
    
    
        const [rows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM users WHERE email = ?", 
            [userEmail]
        )

        return rows.length ? rows[0] : null;

    }

}