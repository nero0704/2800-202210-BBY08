CREATE DATABASE IF NOT EXISTS COMP2800;
        use COMP2800;
        CREATE TABLE IF NOT EXISTS BBY_8_user (
            ID int NOT NULL AUTO_INCREMENT,
            firstName varchar(30),
            lastName varchar(30),
            email varchar(30),
            password varchar(30),
            role char,
            userName varchar(30),
            age int,
            personality varchar(30),
            filesrc varchar (100),
            PRIMARY KEY (ID));
        use COMP2800;
        CREATE TABLE IF NOT EXISTS BBY_8_survey (
            userID int NOT NULL,
            dateOfSurvey DATE,
            survey varchar(30),
            PRIMARY KEY (userID, dateOfSurvey),
            FOREIGN KEY (userID) REFERENCES BBY_8_user(ID)
        );
        CREATE TABLE IF NOT EXISTS BBY_8_music (
            ID int NOT NULL AUTO_INCREMENT,
            songName varchar(30),
            songArtists varchar(30),
            songPersonality varchar(30),
            PRIMARY KEY (ID)
        );
        CREATE TABLE IF NOT EXISTS BBY_8_library (
            userID int NOT NULL,
            songName varchar(30),
            PRIMARY KEY (userID),
            FOREIGN KEY (userID) REFERENCES BBY_8_user(ID)
        );
INSERT INTO BBY_8_user (firstName, lastname, email, password, role, userName, age, personality, filesrc)
    VALUES ("John", "Smith", "JS@test.ca", "1234", 'A', "JohnCena420", "69", "INFJ", "default");
INSERT INTO BBY_8_user (firstName, lastname, email, password, role, userName, age, personality, filesrc)
    VALUES ("Jason", "Turner", "jasonTurn@tec.ca", "4312", 'R', "JasonSparrow", "34", "ISTJ", "default");
INSERT INTO BBY_8_user (firstName, lastname, email, password, role, userName, age, personality, filesrc)
    VALUES ("Amy", "Santiago", "AMS@brook.ca", "JQRIBVQIX23", 'R', "TheTerminator", "30", "INTP", "default");
INSERT INTO BBY_8_user (firstName, lastname, email, password, role, userName, age, personality, filesrc)
    VALUES ("Diego", "Cuenca Espino", "dce@my.bcit.ca", "notabc123", 'A', "DCE", "21", "INTP", "default");
