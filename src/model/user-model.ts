import * as mysql from "mysql2/promise";
import createConnection from "./database";


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
        const { name, email, password } = data;
        const conection = await createConnection();
        try{
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
    
            
        } finally{
            await conection.end();
        }
    }

    read(){

    }

    update(){

    }

    delete(){

    }

    static async findById(){

    }

    static async findByEmail(email: string): Promise<UserModel>{

        const conection =  await createConnection();

        try{
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

        }finally{
            await conection.end();
        }

        
    }

    static async findAll(){

    }

    fill(data: Partial<UserModel>): void{
        if (data.id !== undefined) this.id = data.id;
        if (data.name !== undefined) this.name = data.name;
        if (data.email !== undefined) this.email = data.email;
        if (data.password !== undefined) this.password = data.password;
        if (data.created_at !== undefined) this.created_at = data.created_at;
    }

}