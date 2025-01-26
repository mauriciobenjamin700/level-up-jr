import * as mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import createConnection from "../model/database";

export class PartnerService{

    async register(
        name: string, 
        email: string, 
        password: string, 
        company_name: string,
    ){
    
        const conection = await createConnection();
        try{
            const createdAt = new Date();
    
            const hasedPassword = bcrypt.hashSync(password, 10);
    
            const [userResult] = await conection.execute<mysql.ResultSetHeader>(
                "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)", 
                [name, email, hasedPassword, createdAt]
            );
    
            const userId = userResult.insertId;
    
            const [partnerResult] = await conection.execute<mysql.ResultSetHeader>(
                "INSERT INTO partners (user_id, company_name, created_at) VALUES (?, ?, ?)", 
                [userId, company_name, createdAt]
            );
    
            return {
                id: partnerResult.insertId, 
                name: name,
                user_id: userId, 
                company_name: company_name, 
                created_at: createdAt 
            }
        } finally{
            await conection.end();
        }
    }

    async findByUserId(userId: number): Promise<any>{
        const conection = await createConnection();
        try{
            const [rows] = await conection.execute<mysql.RowDataPacket[]>(
                "SELECT * FROM partners WHERE user_id = ?", 
                [userId]
            );
            
            const partner = rows.length > 0 ? rows[0] : null;

            return partner;


        }finally{
            await conection.end();
        }
    }

}