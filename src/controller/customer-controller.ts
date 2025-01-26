import { Router } from "express";
import * as mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import createConnection from "../model/database";
import { CustomerService } from "../services/customer-service";


export const customersRoutes = Router();

customersRoutes.post("/register", async (req, res) => {
    const { name, email, password, address, phone } = req.body;

    const customerService = new CustomerService();

    const result = await customerService.register({
        name,
        email,
        password,
        address,
        phone
    });

    res.status(201).json(result);

});