import * as mysql from 'mysql2/promise';
import createConnection from "../model/database";

export class UserService {


    async findById(userId: number){
        
        const conection =  await createConnection();
        
        try{
    
    
            const [rows] = await conection.execute<mysql.RowDataPacket[]>(
                "SELECT * FROM users WHERE id = ?", 
                [userId]
            )
    
            return rows.length ? rows[0] : null;

        }finally{
            await conection.end();
        }
    }


    async findByEmail(userEmail: number){
        
        const conection =  await createConnection();
        
        try{
    
    
            const [rows] = await conection.execute<mysql.RowDataPacket[]>(
                "SELECT * FROM users WHERE email = ?", 
                [userEmail]
            )
    
            return rows.length ? rows[0] : null;

        }finally{
            await conection.end();
        }
    }

}