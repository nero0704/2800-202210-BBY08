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
INSERT INTO user (firstName, lastname, email, password, role, userName, age, personality)
    VALUES ("John", "Smith", "JS@test.ca", "1234", 'A', "JohnCena420", "69", "INFJ");
INSERT INTO user (firstName, lastname, email, password, role, userName, age, personality)
    VALUES ("Jason", "Turner", "jasonTurn@tec.ca", "4312", 'R', "JasonSparrow", "34", "ISTJ");
INSERT INTO user (firstName, lastname, email, password, role, userName, age, personality)
    VALUES ("Amy", "Santiago", "AMS@brook.ca", "JQRIBVQIX23", 'R', "TheTerminator", "30", "INTP");
INSERT INTO user (firstName, lastname, email, password, role, userName, age, personality)
    VALUES ("Diego", "Cuenca Espino", "dce@my.bcit.ca", "notabc123", 'A', "DCE", "21", "INTP");