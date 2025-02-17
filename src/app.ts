import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Database } from "./model/database";
import { authRoutes } from "./controller/auth-controller";
import { customersRoutes } from "./controller/customer-controller";
import { partnersRoutes } from "./controller/partner-controller";
import { eventsRoutes } from "./controller/event-controller";
import { UserService } from "./services/user-service";



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

    const payload = jwt.verify(token, "your_secret_key") as {
        id: number,
        email: string
    };

    const userService = new UserService();

    const user = await userService.findById(payload.id);

    if (!user){
        return res.status(401).json({message: "Invalid token"});
        
    }

    req.user = user as {id: number, email: string};

    return next();

    
})

app.get("/", (req, res) => {
    res.json({message: "Hello World"});
});


app.use("/auth", authRoutes),

app.use("/customers", customersRoutes)

app.use("/partners", partnersRoutes)

app.use("events", eventsRoutes)


app.listen(3000, async () => {
    const conection = Database.getInstance();
    await conection.execute("SET FOREIGN_KEY_CHECKS = 0")
    await conection.execute("TRUNCATE TABLE events")
    await conection.execute("TRUNCATE TABLE partners")
    await conection.execute("TRUNCATE TABLE customers")
    await conection.execute("TRUNCATE TABLE users")
    await conection.execute("SET FOREIGN_KEY_CHECKS = 1")
    console.log("Server is running in http://localhost:3000");
});