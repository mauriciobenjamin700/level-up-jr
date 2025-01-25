import express from "express";
import * as mysql from "mysql2/promise";
import bcrypt from "bcrypt";

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

app.get("/", (req, res) => {
    res.json({message: "Hello World"});
});

app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    res.json({message: "Login"});
});

app.post("/partners", async (req, res) => {
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

app.post("/partners/events", (req, res) => {
    const { name, email, password, company_name, address, phone } = req.body;
    console.log(name, email, password, address, phone);
    res.json({message: "Partner created"});
});

app.get("/partners/events", (req, res) => {
    const { name, email, password, company_name, address, phone } = req.body;
    console.log(name, email, password, address, phone);
    res.json({message: "Partner created"});
});

app.get("/partners/events/:id", (req, res) => {
    const { id } = req.params;
    res.send({message: `Event ${id}`});
});

app.post("/customers", async (req, res) => {
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

app.get("/events", (req, res) => {
    const { name, email, password, company_name, address, phone } = req.body;
    console.log(name, email, password, address, phone);
    res.json({message: "Partner created"});
});

app.get("/events/:id", (req, res) => {
    const { id } = req.params;
    res.send({message: `Event ${id}`});
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