CREATE DATABASE `hidrafelis`;

USE `hidrafelis`;

CREATE TABLE `log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` int NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(30) NOT NULL,
  `active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
);