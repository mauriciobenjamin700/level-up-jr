-- Cria o banco de dados se ele não existir
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tickets') THEN
      PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE tickets');
   END IF;
END
$$;

-- Conecta ao banco de dados tickets
\connect tickets

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS partners (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_partners_users1
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS fk_partners_users1_idx ON partners (user_id);

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_customers_users1
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS fk_customers_users1_idx ON customers (user_id);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    partner_id INT NOT NULL,
    CONSTRAINT fk_events_partners1
        FOREIGN KEY (partner_id)
        REFERENCES partners (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS fk_events_partners1_idx ON events (partner_id);