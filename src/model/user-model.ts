import bcrypt from "bcrypt";
import * as mysql from "mysql2/promise";
import { Database } from "./database";


export class UserModel{
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: Date;

    constructor(data: Partial<UserModel>){
        this.fill(data)
    }


    static async create(data:{
        name: string,
        email: string,
        password: string
    }): Promise<UserModel>  {

        data.password = UserModel.hashPassword(data.password);
        const { name, email, password } = data;
        const conection = Database.getInstance();

        const createdAt = new Date();

        const [userResult] = await conection.execute<mysql.ResultSetHeader>(
            "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)", 
            [name, email, password, createdAt]
        );

        return new UserModel({
            ...data,
            created_at: createdAt,
            id: userResult.insertId
        })
    
    }

    read(){

    }

    async update(){
        const connection = Database.getInstance();

        const [result] = await connection.execute<mysql.ResultSetHeader>(
            "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", 
            [this.name, this.email, this.password, this.id]
        );

        if (result.affectedRows === 0){
            throw new Error("User not found");
        };
    }

    delete(){

    }

    static async findById(id: string){
        const connection = Database.getInstance();

        const [rows] = await connection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM users WHERE id = ?", 
            [id]
        );

        const user = rows.length ? rows[0] : null;

        if (!user) return null;

        return new UserModel({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            created_at: user.created_at
        })
    }

    static async findByEmail(email: string): Promise<UserModel>{

        const conection =  Database.getInstance();

        const [rows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM users WHERE email =?", 
            [email]
        )
    
        const user = rows.length ? rows[0] : null;

        if (!user) return null;

        return new UserModel({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            created_at: user.created_at
        })   
    }

    static async findAll(){
        const connection = Database.getInstance();

        const [rows] = await connection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM users"
        );

        return rows.map(user => new UserModel({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            created_at: user.created_at
        }))
    }

    fill(data: Partial<UserModel>): void{
        if (data.id !== undefined) this.id = data.id;
        if (data.name !== undefined) this.name = data.name;
        if (data.email !== undefined) this.email = data.email;
        if (data.password !== undefined) this.password = data.password;
        if (data.created_at !== undefined) this.created_at = data.created_at;
    }

    static hashPassword(password: string): string{
        return bcrypt.hashSync(password, 10);
    }

    static comparePassword(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }

}