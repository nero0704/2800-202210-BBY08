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
            PRIMARY KEY (ID)
        );
        use COMP2800;
        CREATE TABLE IF NOT EXISTS BBY_8_survey (
            userID int NOT NULL,
            dateOfSurvey DATE,
            survey varchar(30),
            PRIMARY KEY (userID, dateOfSurvey),
            FOREIGN KEY (userID) REFERENCES BBY_8_user(ID)
        );
        CREATE TABLE IF NOT EXISTS BBY_8_album (
            ID int NOT NULL AUTO_INCREMENT,
            title varchar(30), 
            artist varchar(30),
            genre varchar(30),
            dateofRelease DATE,
            PRIMARY KEY (ID)
        );
        CREATE TABLE IF NOT EXISTS BBY_8_song (
            ID int NOT NULL AUTO_INCREMENT,
            title varchar(50),
            artist varchar(30),
            personality varchar(30),
            mood varchar(30), 
            album varchar(30),
            youtubeLink varchar(70),
            spotifyLink varchar(70),
            filesrc varchar (100),            
            PRIMARY KEY (ID)
        );
        CREATE TABLE IF NOT EXISTS BBY_8_library (
            ID int NOT NULL AUTO_INCREMENT,
            userID int NOT NULL,
            songID int NOT NULL,
            PRIMARY KEY (ID),
            FOREIGN KEY (userID) REFERENCES BBY_8_user(ID),
            FOREIGN KEY (songID) REFERENCES BBY_8_song(ID)
        );
INSERT INTO BBY_8_user (firstName, lastname, email, password, role, userName, age, personality, filesrc)
    VALUES ("John", "Smith", "JS@test.ca", "1234", 'A', "JohnCena420", "69", "INFJ", "default");
INSERT INTO BBY_8_user (firstName, lastname, email, password, role, userName, age, personality, filesrc)
    VALUES ("Jason", "Turner", "jasonTurn@tec.ca", "4312", 'R', "JasonSparrow", "34", "ENFJ", "default");
INSERT INTO BBY_8_user (firstName, lastname, email, password, role, userName, age, personality, filesrc)
    VALUES ("Amy", "Santiago", "AMS@brook.ca", "JQRIBVQIX23", 'R', "TheTerminator", "30", "INTP", "default");
INSERT INTO BBY_8_user (firstName, lastname, email, password, role, userName, age, personality, filesrc)
    VALUES ("Diego", "Cuenca Espino", "dce@my.bcit.ca", "notabc123", 'A', "DCE", "21", "INTP", "default");
INSERT INTO BBY_8_album (title, artist, genre, dateofRelease)
    VALUES ("Classical", "Multiple", "Classical", "1900-10-10");
INSERT INTO BBY_8_album (title, artist, genre, dateofRelease)
    VALUES ("Depression Cherry", "Beach House", "Dream Pop", "2015-08-28");
INSERT INTO BBY_8_album (title, artist, genre, dateofRelease)
    VALUES ("Thank Your Lucky Stars", "Beach House", "Dream Pop", "2015-10-16");
INSERT INTO BBY_8_song (title, artist, personality, mood, album, youtubeLink, spotifyLink, filesrc)
    VALUES ("Bach: Cello Suite No.! in G Major", "Yo-Yo Ma", "ISTJ", "TBD", "Six Suites for Unaccompanied Cello", "https://youtu.be/pAgnJDJN4VA?list=PLv5D2n4QoJbrgC3LQo9PAzTZccsgDANBh", "https://open.spotify.com/track/7sjuI9Y9rsrWOJUNVzqOK7?autoplay=true", "bach-cello-yo-yo-ma.jpg");
INSERT INTO BBY_8_song (title, artist, personality, mood, album, youtubeLink, spotifyLink, filesrc)
    VALUES ("Nocturne op.9 No.2", "Chopin", "ISTJ", "TBD", "Chopin: Nocturnes", "https://www.youtube.com/watch?v=9E6b3swbnWg", "https://open.spotify.com/track/61dYvvfIRtIDFuqZypPAta", "nocturne-chopin.jpg");
INSERT INTO BBY_8_song (title, artist, personality, mood, album, youtubeLink, spotifyLink, filesrc)
    VALUES ("Space Song", "Beach House", "ENFJ", "TBD", "Depression Cherry", "https://www.youtube.com/watch?v=RBtlPT23PTM", "https://open.spotify.com/track/7H0ya83CMmgFcOhw0UB6ow?autoplay=true", "beach-house-depression-cherry.png" );
INSERT INTO BBY_8_song (title, artist, personality, mood, album, youtubeLink, spotifyLink, filesrc)
    VALUES ("Myth", "Beach House", "ENFJ", "TBD", "Bloom", "https://www.youtube.com/watch?v=FuvWc3ToDHg", "https://open.spotify.com/track/2NfxtzCIrpCmJX5Z2KMdD5", "beach-house-thank-your.png" );