-- Creation of the User database
CREATE TABLE `green-shift`.`User` (`ID` INT NOT NULL AUTO_INCREMENT ,
    `name` VARCHAR(255) NOT NULL ,
    `firstname` VARCHAR(255) NOT NULL ,
    `email` VARCHAR(510) NOT NULL ,
    `phone` VARCHAR(255) NOT NULL ,
    `country` VARCHAR(255) NOT NULL ,
    `registration` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

-- Ceation of the Message database
CREATE TABLE `green-shift`.`Message` (`ID` INT NOT NULL AUTO_INCREMENT ,
    `from_user_id` INT NOT NULL ,
    `to_user_id` INT NOT NULL ,
    `content` TEXT NOT NULL ,
    PRIMARY KEY (`ID`)
) ENGINE = InnoDB;
ALTER TABLE `Message` ADD `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `content`;
ALTER TABLE `Message` ADD CONSTRAINT `from_user_id` FOREIGN KEY (`from_user_id`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Message` ADD CONSTRAINT `to_user_id` FOREIGN KEY (`to_user_id`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Creation of the Tree database
CREATE TABLE `green-shift`.`Tree` (`ID` INT NOT NULL AUTO_INCREMENT ,
    `user_id` INT NOT NULL ,
    `size` INT NOT NULL ,
    PRIMARY KEY (`ID`)
) ENGINE = InnoDB;
ALTER TABLE `Tree` ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Creation of the Post database
CREATE TABLE `green-shift`.`Post` (`ID` INT NOT NULL AUTO_INCREMENT ,
    `user_id` INT NOT NULL ,
    `tree_id` INT NOT NULL ,
    `title` VARCHAR(255) NOT NULL ,
    `description` TEXT NOT NULL ,
    `likes` INT NOT NULL ,
    `is_valid` BOOLEAN NOT NULL ,
    PRIMARY KEY (`ID`)
) ENGINE = InnoDB;
ALTER TABLE `Post` ADD CONSTRAINT `tree_id` FOREIGN KEY (`tree_id`) REFERENCES `Tree`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Post` ADD CONSTRAINT `post_user_id` FOREIGN KEY (`user_id`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Creation of the Comment database
CREATE TABLE `green-shift`.`Comment` (`ID` INT NOT NULL AUTO_INCREMENT ,
    `post_id` INT NOT NULL ,
    `user_id` INT NOT NULL ,
    `Description` TEXT NOT NULL ,
    `likes` INT NOT NULL ,
    PRIMARY KEY (`ID`)
) ENGINE = InnoDB;
ALTER TABLE `Comment` ADD CONSTRAINT `post_id` FOREIGN KEY (`post_id`) REFERENCES `Post`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Comment` ADD CONSTRAINT `comment_user_id` FOREIGN KEY (`user_id`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Creation of the Media database
CREATE TABLE `green-shift`.`Media` (`ID` INT NOT NULL AUTO_INCREMENT ,
    `post_id` INT NOT NULL ,
    `name` VARCHAR(255) NOT NULL ,
    `type` TEXT NOT NULL ,
    `path` VARCHAR(510) NOT NULL ,
    PRIMARY KEY (`ID`)
) ENGINE = InnoDB;
ALTER TABLE `Media` ADD CONSTRAINT `media_post_id` FOREIGN KEY (`post_id`) REFERENCES `Post`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Creation of the ValidatedBy database
CREATE TABLE `green-shift`.`ValidatedBy` (`ID` INT NOT NULL AUTO_INCREMENT ,
    `user_id` INT NOT NULL ,
    `post_id` INT NOT NULL ,
    PRIMARY KEY (`ID`)) ENGINE = InnoDB;
ALTER TABLE `ValidatedBy` ADD CONSTRAINT `val_user_id` FOREIGN KEY (`user_id`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT; 
ALTER TABLE `ValidatedBy` ADD CONSTRAINT `val_post_id` FOREIGN KEY (`post_id`) REFERENCES `Post`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;