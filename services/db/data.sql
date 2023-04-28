-- Test User
INSERT INTO `User` ( 
    `name`, 
    `firstname`, 
    `email`, 
    `phone`, 
    `country`) 
VALUES (
    'admin', 
    'test', 
    'test@test.com', 
    '064739447', 
    'France');

-- Creation of a list of users
INSERT INTO `User` 
    (`name`, `firstname`, `email`, `phone`, `country`) 
VALUES 
    ('URSU', 'Cristian', 'ursu.cristian@gmail.com', '0694627747', 'France'), 
    ('DIA', 'Abdoulaye', 'dia.abdoulaye@gmail.com', '0692643625', 'France'),
    ('ZHOU', 'Pascal', 'zhou.pascal@gmail.com', '0682572366', 'France');

-- Creation of any message 
INSERT INTO `Message` 
    (`from_user_id`, `to_user_id`, `content`) 
VALUES 
    ('3', '4', 'Hello World !'), 
    ('4', '3', 'Goodbye World !'),
    ('2', '4', "Hello how are you ?"),
    ('4', '2', "Good and you ?"),
    ('2', '1', "This is a test message"),
    ('1', '2', "This is a test answer");

-- Creation of trees linked to users
INSERT INTO `Tree` 
    (, `user_id`, `size`) 
VALUES 
    ('1', '1'), ('2', '2'), ('3', '3'), ('4', '4')
