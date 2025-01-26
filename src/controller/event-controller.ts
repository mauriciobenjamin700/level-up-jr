import {Router} from "express";
import * as mysql from "mysql2/promise";
import createConnection from "../model/database";
import { EventService } from "../services/event-service";


export const eventsRoutes = Router();

eventsRoutes.post("/", async (req, res):Promise <any> => {
    const { name, description, date, location } = req.body;
    
    const eventService = new EventService();

    const connection = await createConnection();

    try{
        

        const [rows] = await connection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM partners WHERE user_id = ?", 
            [req.user!.id]
        )

        const partner = rows.length ? rows[0] : null;

        if (!partner){
            return res.status(403).json({message: "Not authorized"});
        }

        const result = await eventService.create({
            name,
            description,
            date,
            location,
            partnerId: partner.id
        });

        res.status(201).json(result);

    } finally{
        await connection.end();
    }

});

eventsRoutes.get("/", async (req, res) => {

    const eventService = new EventService();

    const events = await eventService.findAll();

    res.status(200).json(events);

});

eventsRoutes.get("/:id", async (req, res): Promise<any> => {
    const { id } = req.params;
    
    const eventService = new EventService();

    const event = await eventService.findById(Number(id));

    res.status(200).json(event);

});