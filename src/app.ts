import express from "express";

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

app.post("/partners", (req, res) => {
    const { name, email, password, company_name } = req.body;
    console.log(name, email, password, company_name);
    res.json({message: "Partner created"});
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

app.post("/customers", (req, res) => {
    const { name, email, password, company_name, address, phone } = req.body;
    console.log(name, email, password, address, phone);
    res.json({message: "Partner created"});
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
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});