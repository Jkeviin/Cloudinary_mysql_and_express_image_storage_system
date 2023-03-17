drop  database if exists lavasoft;
CREATE DATABASE lavasoft;
USE lavasoft;
CREATE TABLE imagenes (
   id INT AUTO_INCREMENT PRIMARY KEY,
   url VARCHAR(255) NOT NULL
);

select * from imagenes