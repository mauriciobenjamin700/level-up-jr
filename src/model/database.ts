import * as mysql from "mysql2/promise";


function createConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "user",
        password: "user",
        database: "tickets",
        port: 33060
    });
}

export default createConnection;