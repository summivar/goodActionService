# Good Action Service Test Task

  

Good Action Service is a web application that empowers users to make a positive impact in their lives and the lives of others. With Good Action Service, users can easily register, connect with friends, manage their good actions, and keep track of their social circle's achievements.

  

# Technology Stack

  

Good Action Service leverages the following technologies:

  

 - Backend: Nest.js, a powerful and scalable Node.js framework written  
   in TypeScript, provides a solid foundation for building the      
   application's server-side logic.

       

 - Frontend: Next.js combined with React, both written in TypeScript,   
   delivers a dynamic and interactive user interface, ensuring a modern 
   and engaging user experience.

       

 - Database: MongoDB, a flexible and scalable NoSQL database,   
   efficiently stores and manages the application's data.

  

# Requirements

  

To run GoodActionService on your local machine, ensure the following components are installed:

	Node.js
	npm
	Docker
	MongoDB

  

# Getting Started

  

Follow the steps below to get GoodActionService up and running:

 1. Clone the repository.
 2. Navigate to the backend directory and install the required dependencies:
```bash
cd backend
npm install
```
 3. Rename the `.env.example` file to `.env` and update the environment variables with your specific configuration.
 4. Start the backend server:
```bash
npm run start:dev
```
 5. Open a new terminal window, navigate to the frontend directory, and install the required dependencies:
 ```bash
cd ../frontend
npm install
```
 7. Start the frontend development server:
```bash
npm run dev
```
 8. Open your preferred web browser and visit [http://localhost:3000](http://localhost:3000) to access GoodActionService.
 
 You may change API url - ./frontend/services/api/index.ts
