CREATE DATABASE IF NOT EXISTS COMP2800;
        use COMP2800;
        CREATE TABLE IF NOT EXISTS BBY_8user (
        ID int NOT NULL AUTO_INCREMENT,
        firstName varchar(30),
        lastName varchar(30),
        email varchar(30),
        password varchar(30),
        role char,
        userName varchar(30),
        age int,
        personality varchar(30),
        PRIMARY KEY (ID));