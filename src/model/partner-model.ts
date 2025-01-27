import * as mysql from "mysql2/promise";
import { Database } from "./database";
import { UserModel } from "./user-model";

export class PartnerModel{
    id: number;
    user_id: number;
    company_name: string;
    created_at: Date;
    user?: UserModel

    constructor(data: Partial<PartnerModel>){
        this.fill(data)
    }

    fill(data: Partial<PartnerModel>){
        this.id = data.id;
        this.user_id = data.user_id;
        this.company_name = data.company_name;
        this.created_at = data.created_at;
    }

    static async create(data:{
        user_id: number,
        company_name: string
    }): Promise<PartnerModel>  {
        const { user_id, company_name } = data;

        const conection = Database.getInstance();

        const createdAt = new Date();

        const [partnerResult] = await conection.execute<mysql.ResultSetHeader>(
            "INSERT INTO partners (user_id, company_name, created_at) VALUES (?, ?, ?)", 
            [user_id, company_name, createdAt]
        );

        return new PartnerModel({
            ...data,
            created_at: createdAt,
            id: partnerResult.insertId
        })
    
    }

    read(){

    }

    async update(){
        const connection = Database.getInstance();

        const [result] = await connection.execute<mysql.ResultSetHeader>(
            "UPDATE partners SET company_name = ? WHERE id = ?", 
            [this.company_name, this.id]
        );

        if (result.affectedRows === 0){
            throw new Error("Partner not found");
        };
    }

    delete(){

    }

    async findById(id: string){
        const connection = Database.getInstance();
        const [rows] = await connection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM partners WHERE id = ?", 
            [id]
        );
        
        const partner = rows.length > 0 ? rows[0] : null;

        return partner;
    }

    static async findByUserId(userId: number): Promise<PartnerModel | null>{
        const connection = Database.getInstance();
        const [rows] = await connection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM partners WHERE user_id = ?", 
            [userId]
        );
        
        const partner = rows.length > 0 
        ? new PartnerModel(rows[0] as Partial<PartnerModel>) 
        : null;

        return partner;
    }
}