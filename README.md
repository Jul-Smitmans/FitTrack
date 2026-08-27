# FitTrack

FitTrack is a responsive full-stack workout planning web application.
It allows users to create an account, log in securely, plan workouts, view the workout scheduled for today, mark workouts as completed, and delete saved workouts.

## Features

- User registration
- Secure password hashing
- User login and logout
- Personalized welcome message
- JWT-protected workout routes
- Create structured workouts with multiple exercises
- Record sets and repetitions for each exercise
- Add and remove exercises interactively before saving
- Choose exercises from an expanded list that matches the selected workout category
- View complete exercise details in Today's Workout and My Workouts
- Filter My Workouts by title or exercise, planned/completed status, and date
- View completed and planned workout totals with a decimal completion ratio (completed ÷ total)
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

```
## Dynamic interactions

1. After login, the dashboard displays a personalized welcome message using the authenticated user's name.
2. The dashboard checks the current date and automatically displays the workout scheduled for today.
3. While planning a workout, the user can add or remove several structured exercises. JavaScript immediately displays each exercise with its sets and repetitions before the complete workout is saved.
