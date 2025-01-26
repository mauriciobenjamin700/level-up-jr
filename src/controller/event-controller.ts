import {Router} from "express";
import * as mysql from "mysql2/promise";
import createConnection from "../model/database";


export const eventsRoutes = Router();

eventsRoutes.post("", (req, res) => {
    const { name, email, password, company_name, address, phone } = req.body;
    console.log(name, email, password, address, phone);
    res.json({message: "Partner created"});
});

eventsRoutes.get("", async (req, res) => {


    const conection = await createConnection();
    try{

        const [eventRows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM events"
        )


        res.status(200).json(eventRows);
    } finally{
        await conection.end();
    }

});

eventsRoutes.get("/:id", async (req, res): Promise<any> => {
    const { id } = req.params;
    const conection = await createConnection();
    try{

        const [eventRows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM events WHERE id = ?",
            [id]
        )

        const event = eventRows.length ? eventRows[0] : null;

        if (!event){
            return res.status(404).json({message: "Event not found"});
        }

        res.status(200).json(eventRows);
    } finally{
        await conection.end();
    }
});