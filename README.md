# GreenShift web

## Sommaire
- Presentation of the project
- Instructions for the installation of the project

## Presentation of the project
The project is a web application that aims to encourage people to take good actions for the environment. Each user will be able to track their progress, share their good actions with the community, communicate with other users, post comments, and many more features to come.

The goal of this application is to raise awareness about the importance of the environment and to encourage people to adopt eco-friendly behaviors in their daily lives. We believe that everyone can do their part to protect our planet, and this application aims to make this process easier and more fun.

## Instructions for the installation of the project
- Make sure you have Docker and Docker Compose installed on your machine.
- Clone this repository on your machine.
- Open the terminal and go to the folder where the repository was cloned.
- Type the command `docker-compose up --build` to start the different services.
- Access the application by opening your browser and typing the address `http://localhost:4200`.
- List of ports used by the different services:
   - API_NODE : 3000
   - APP_ANGULAR : 4200
   - PhpMyAdmin : 5171
   - MySQL : 3306
   - MONGODB = 27017