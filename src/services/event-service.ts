import * as mysql from "mysql2/promise";
import createConnection from "../model/database";

export class EventService{

    async create(
            data:{
                name: string,
                description: string | null,
                date: string,
                location: string,
                partnerId: number
            }
    ): Promise<{ id: number, partner_id: number, name: string, description: string | null, date: Date, location: string, created_at: Date }> {

        const { name, description, date, location, partnerId } = data;
    
        const conection = await createConnection();
        try{
            const eventDate = new Date(date);
    
            const createdAt = new Date();
    
            const [eventResult] = await conection.execute<mysql.ResultSetHeader>(
                "INSERT INTO events (partner_id, name, description, date, location, created_at) VALUES (?, ?, ?, ?, ?, ?)", 
                [partnerId, name, description, eventDate, location, createdAt]
            );
    
            return{
                    id: eventResult.insertId, 
                    partner_id: partnerId,  // Partner ID
                    name: name,
                    description: description,
                    date: eventDate,
                    location: location,
                    created_at: createdAt,
                }

        } finally{
            await conection.end();
        }
    }

    async findAll(partnerId?: number){

        const conection = await createConnection();
        try{
            const query = partnerId 
                ? "SELECT * FROM events WHERE partner_id = ?" 
                : "SELECT * FROM events";
            const params = partnerId 
                ? [partnerId] 
                : [];

            const [eventRows] = await conection.execute<mysql.RowDataPacket[]>(
                query, 
                params
            )
    
            return eventRows;
            
        } finally{
            await conection.end();
        }
    }

    async findById(eventId: number){
        const conection = await createConnection();
        try{
            const [eventRows] = await conection.execute<mysql.RowDataPacket[]>(
                "SELECT * FROM events WHERE id = ?", 
                [eventId]
            )
            
            const event = eventRows.length > 0 ? eventRows[0] : null;

            return event;
            
        }finally{
            await conection.end()
        }
    }

}