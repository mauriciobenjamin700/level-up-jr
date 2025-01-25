-- Cria o banco de dados se ele não existir
CREATE DATABASE IF NOT EXISTS tickets;
USE tickets;

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS partners (
    id INT NOT NULL AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    INDEX fk_partners_users1_idx (user_id),
    CONSTRAINT fk_partners_users1
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS customers (
    id INT NOT NULL AUTO_INCREMENT,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    INDEX fk_customers_users1_idx (user_id),
    CONSTRAINT fk_customers_users1
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS events (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    partner_id INT NOT NULL,
    PRIMARY KEY (id),
    INDEX fk_events_partners1_idx (partner_id),
    CONSTRAINT fk_events_partners1
        FOREIGN KEY (partner_id)
        REFERENCES partners (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
) ENGINE = InnoDB;