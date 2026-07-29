# FitTrack

FitTrack is a responsive full-stack workout planning web application.
It allows users to create an account, log in securely, plan workouts, view the workout scheduled for today, mark workouts as completed, and delete saved workouts.

## Features

- User registration
- Secure password hashing
- User login and logout
- Personalized welcome message
- JWT-protected workout routes
- Create and view workouts
- Automatic Today's Workout display
- Mark workouts as completed
- Delete workouts
- Responsive desktop and mobile layout

## Technologies

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express

### Database and security

- MongoDB Atlas
- Mongoose
- bcryptjs
- JSON Web Tokens
- dotenv

## Application structure

```text
models/           MongoDB schemas and models
public/           Frontend HTML, CSS and JavaScript
server.js         Express server and API routes
package.json      Project information and dependencies
.gitignore        Files excluded from Git
