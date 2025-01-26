import { Router } from "express";
import * as mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import createConnection from "../model/database";

export const partnersRoutes = Router();


partnersRoutes.post("/register", async (req, res) => {
    const { name, email, password, company_name } = req.body;
    
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

        res.status(201).json({
            id: partnerResult.insertId, 
            name: name,
            user_id: userId, 
            company_name: company_name, 
            created_at: createdAt 
        }
        )
    } finally{
        await conection.end();
    }
});

partnersRoutes.post("/events", async (req, res): Promise<any> => {
    const { name, description, date, location} = req.body;

    const userId = req.user!.id;

    const conection = await createConnection();
    try{

    
        const [rows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM partners WHERE user_id = ?", 
            [userId]
        )

        const partner = rows.length ? rows[0] : null;

        if (!partner){
            return res.status(403).json({message: "Not authorized"});
        }

        const eventDate = new Date(date);

        const createdAt = new Date();

        const [eventResult] = await conection.execute<mysql.ResultSetHeader>(
            "INSERT INTO events (partner_id, name, description, date, location, created_at) VALUES (?, ?, ?, ?, ?, ?)", 
            [partner.id, name, description, eventDate, location, createdAt]
        );

        res.status(201).json(
            {
                id: eventResult.insertId, 
                partner_id: partner.id,  // Partner ID
                name: name,
                description: description,
                date: eventDate,
                location: location,
                created_at: createdAt,
            }
        );
    } finally{
        await conection.end();
    }

});

partnersRoutes.get("/events", async (req, res): Promise<any> =>  {

    const userId = req.user!.id;

    const conection = await createConnection();
    try{

        const [rows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM partners WHERE user_id =?", 
            [userId]
        )

        const partner = rows.length ? rows[0] : null;

        if (!partner){
            return res.status(403).json({message: "Not authorized"});
        }

        const [eventRows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM events WHERE partner_id = ?", 
            [partner.id]
        )


        res.status(200).json(eventRows);
    } finally{
        await conection.end();
    }

});

partnersRoutes.get("/events/:id", async (req, res): Promise<any> => {

    const userId = req.user!.id;

    const eventId = req.params.id

    const conection = await createConnection();
    try{

        const [rows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM partners WHERE user_id =?", 
            [userId]
        )

        const partner = rows.length ? rows[0] : null;

        if (!partner){
            return res.status(403).json({message: "Not authorized"});
        }

        const [eventRows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM events WHERE partner_id = ? AND id = ?", 
            [partner.id, eventId]
        )

        const event = eventRows.length ? eventRows[0] : null;

        if (!event){
            return res.status(404).json({message: "Event not found"});
        }

        res.status(200).json(event);


        res.status(200).json(eventRows);
    } finally{
        await conection.end();
    }

});