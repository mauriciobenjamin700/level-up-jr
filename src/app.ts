import express, { Request, Response, NextFunction } from "express";
import * as mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function createConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "user",
        password: "user",
        database: "tickets",
        port: 33060
    });
}

const app = express();

app.use(express.json());

const unprotectedRoutes = [
    {method: "POST", path: "/auth/login"},
    {method: "POST", path: "/customers/register"},
    {method: "POST", path: "/partners/register"},
    {method: "GET",  path: "/events"},
    {method: "GET",  path: "/events/:id"},
];

app.use(async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    const isUnprotected = unprotectedRoutes.some(
        (route) => route.method === req.method && route.path === req.path
    );

    if (isUnprotected){
        return next();
    }

    const token = req.headers["authorization"]?.split(" ")[1]

    if (!token) {
        return res.status(401).json({message: "No token provided"});
    }

    try{
        const payload = jwt.verify(token, "your_secret_key") as {
            id: number,
            email: string
        };

        const conection =  await createConnection();

        const [rows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM users WHERE id = ?", 
            [payload.id]
        )

        const user = rows.length ? rows[0] : null;

        if (!user){
            return res.status(401).json({message: "Invalid token"});
            
        }

        req.user = user as {id: number, email: string};

        await conection.end();

        return next();

    } catch (error){
        return res.status(401).json({message: "Invalid token"});
    }

    
})

app.get("/", (req, res) => {
    res.json({message: "Hello World"});
});

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    
    const conection =  await createConnection();
    try{

        const [rows] = await conection.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM users WHERE email =?", 
            [email]
        )

        const user = rows.length ? rows[0] : null;

        if (user && bcrypt.compareSync(password, user.password)){

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                }, 
                "your_secret_key", 
                { expiresIn: "1h" }
            );

            res.json({ token: token });
        } else {
            res.status(401).json({message: "Invalid credentials"});
        }

    }finally{
        await conection.end();
    }

});

app.post("/partners/register", async (req, res) => {
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

app.post("/partners/events", async (req, res): Promise<any> => {
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

app.get("/partners/events", async (req, res): Promise<any> =>  {

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

app.get("/partners/events/:id", async (req, res): Promise<any> => {

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

app.post("/customers/register", async (req, res) => {
    const { name, email, password, address, phone } = req.body;
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
            "INSERT INTO customers (user_id, address, phone, created_at) VALUES (?, ?, ?, ?)", 
            [userId, address, phone ,createdAt]
        );

        res.status(201).json({
            id: partnerResult.insertId,
            name: name,
            user_id: userId, 
            address: address, 
            phone: phone,
            created_at: createdAt 
        }
        )
    } finally{
        await conection.end();
    }
});


app.post("/events", (req, res) => {
    const { name, email, password, company_name, address, phone } = req.body;
    console.log(name, email, password, address, phone);
    res.json({message: "Partner created"});
});

app.get("/events", async (req, res) => {


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

app.get("/events/:id", async (req, res): Promise<any> => {
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
app.listen(3000, async () => {
    const conection = await createConnection();
    await conection.execute("SET FOREIGN_KEY_CHECKS = 0")
    await conection.execute("TRUNCATE TABLE events")
    await conection.execute("TRUNCATE TABLE partners")
    await conection.execute("TRUNCATE TABLE customers")
    await conection.execute("TRUNCATE TABLE users")
    await conection.execute("SET FOREIGN_KEY_CHECKS = 1")
    console.log("Server is running in http://localhost:3000");
});