# FitTrack - Smart Workout Planner

FitTrack is a responsive full-stack workout planning web application. Users can create an account, log in securely, plan structured workouts, view the workout scheduled for today, track completed workouts, and search their workout history.

## Features

- Create a user account and log in securely.
- Display a personalized welcome message after login.
- Create structured workouts containing several exercises.
- Choose exercises that match the selected workout category.
- Record the number of sets and repetitions for each exercise.
- Add or remove exercises before saving a workout.
- Automatically display the workout scheduled for today.
- Mark a workout as completed.
- Delete a saved workout.
- Search workouts by title or exercise.
- Filter workouts by planned/completed status and date.
- View completed and still-planned workout totals and a completion ratio.
- Use the application on desktop, tablet, and mobile screen sizes.

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
- JSON Web Tokens (JWT)
- dotenv

## Requirements

Before installing FitTrack, make sure that you have:

- A computer with an internet connection.
- [Node.js](https://nodejs.org/) installed. npm is included with Node.js.
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account.
- Git installed if you want to clone the repository with Git. Alternatively, you can download the repository as a ZIP file from GitHub.
- A modern web browser such as Chrome, Edge, or Firefox.

You can confirm that Node.js and npm are installed by opening a terminal and entering:

```bash
node -v
npm -v
```

Both commands should display a version number.

## Installation and setup

### 1. Download the project

Choose one of the following methods.

#### Option A: Clone the GitHub repository

Open a terminal and run:

```bash
git clone https://github.com/Jul-Smitmans/FitTrack.git
cd FitTrack
```

`git clone` downloads a local copy of the repository. `cd FitTrack` moves the terminal into the downloaded project folder.

#### Option B: Download a ZIP file

1. Open the [FitTrack GitHub repository](https://github.com/Jul-Smitmans/FitTrack).
2. Select **Code** and then **Download ZIP**.
3. Extract the downloaded ZIP file.
4. Open the extracted project folder in Visual Studio Code.
5. Open **Terminal > New Terminal** in Visual Studio Code.

### 2. Install the project dependencies

Run the following command from the project folder:

```bash
npm install
```

This reads `package.json` and installs Express, Mongoose, bcryptjs, JSON Web Token, dotenv, and the other packages required by FitTrack. The generated `node_modules` folder does not need to be downloaded from GitHub because `npm install` recreates it.

### 3. Create a MongoDB Atlas database

FitTrack stores user accounts and workouts in MongoDB Atlas. Each person installing the application should use their own Atlas database and credentials.

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create an account or sign in.
2. Create a new Atlas project.
3. Create a free database cluster. A free cluster is sufficient for testing FitTrack.
4. Create a **database user** with a username and password. A database user is different from the account used to sign in to the Atlas website.
5. Open **Network Access** and add your current IP address to the project IP access list. Atlas blocks database connections from addresses that are not included in this list.
6. Return to the cluster and select **Connect**.
7. Choose **Drivers** (or **Connect your application**) and select the Node.js driver.
8. Copy the connection string. It should have a structure similar to:

```text
mongodb+srv://<database-user>:<database-password>@<cluster-address>/fittrack?retryWrites=true&w=majority
```

9. Replace `<database-user>`, `<database-password>`, and `<cluster-address>` with the values provided by Atlas. Do not leave the angle-bracket placeholders in the finished connection string.

If the database password contains reserved characters such as `@`, `:`, `/`, `?`, `#`, or `%`, those characters must be percent-encoded in the connection string. MongoDB provides more information in its [connection troubleshooting guide](https://www.mongodb.com/docs/atlas/troubleshoot-connection/).

### 4. Create the environment file

Create a file named `.env` in the main project directory, beside `server.js` and `package.json`.

Add the following two lines:

```dotenv
MONGODB_URI=mongodb+srv://<database-user>:<encoded-database-password>@<cluster-address>/fittrack?retryWrites=true&w=majority
JWT_SECRET=replace-this-with-a-long-random-secret
```

- `MONGODB_URI` tells the backend which MongoDB Atlas database it should use.
- `JWT_SECRET` is a private value used to create and verify login tokens.

Replace all placeholder values with your own settings. Do not add spaces around the `=` signs.

Important security rules:

- Never publish the `.env` file.
- Never place a real MongoDB password directly in `server.js`, `README.md`, or another tracked file.
- Never commit the `.env` file to GitHub. This project already lists `.env` in `.gitignore` so Git normally excludes it.
- Use a different JWT secret and database password when another person installs the application.

### 5. Start FitTrack

From the main project directory, run:

```bash
node server.js
```

If the setup is correct, the terminal should display messages similar to:

```text
Connected to MongoDB Atlas
FitTrack is running at http://localhost:3000
```

Keep this terminal open while using the application. Open the following address in a browser:

```text
http://localhost:3000
```

To stop the server, return to the terminal and press `Ctrl + C`.

## How to use FitTrack

### 1. Create an account

1. Open `http://localhost:3000`.
2. Select **Create account** if the registration page is not already displayed.
3. Enter your name, email address, and a password containing at least eight characters.
4. Select **Create account**.

The password is hashed by the backend before the account is stored in MongoDB. The application does not save the readable password.

### 2. Log in

1. Open the login page.
2. Enter the email address and password used during registration.
3. Select **Log in**.

After a successful login, FitTrack displays a personalized message such as `Hi, Julien! Welcome back.` The backend also creates a login token that allows the user to access their own workouts.

### 3. Plan a workout

1. Select **Plan a workout** on the dashboard.
2. Choose a workout category, such as **Upper Body** or **Lower Body**.
3. Choose the scheduled date.
4. Choose an exercise from the list associated with the selected category.
5. Enter the number of sets and repetitions.
6. Select **Add exercise**. The exercise is added to the temporary exercise list.
7. Repeat the exercise steps to add more exercises to the same workout.
8. Optionally enter workout notes.
9. Select **Save Workout**.

FitTrack sends the complete workout to the Express backend, which validates it and stores it in MongoDB.

### 4. Use Today's Workout

When the dashboard opens, FitTrack checks the current date. If a workout is scheduled for today, the **Today's Workout** section displays its category, notes, exercises, sets, and repetitions.

Select **Mark as complete** after finishing the workout. Its status changes from planned to completed and remains saved after the page is refreshed.

### 5. Search and manage workouts

The **My Workouts** section displays the user's planned and completed workouts.

- Enter a workout title or exercise in **Search workouts**.
- Use the status menu to display all, planned, or completed workouts.
- Choose a date to find workouts scheduled on that day.
- Select **Clear filters** to display all workouts again.
- Select **Delete** beside a workout and confirm the action to remove it permanently.

The workout record also displays the numbers of completed and still-planned workouts and a decimal completion ratio calculated as completed workouts divided by all workouts.

### 6. Log out

Select **Log out** at the top of the dashboard. FitTrack removes the local login session and returns to the login page.

## Data stored in MongoDB

FitTrack stores two main types of documents:

- **Users:** name, email address, and hashed password.
- **Workouts:** owner, category/title, scheduled date, optional notes, exercises, sets, repetitions, and completion status.

Each workout is connected to the user who created it. Authenticated backend routes ensure that users can retrieve, complete, and delete only their own workouts.

## Troubleshooting

### The server cannot connect to MongoDB Atlas

- Confirm that `MONGODB_URI` is present in `.env` and contains the complete connection string.
- Confirm that the database username and password are correct.
- Confirm that your current IP address is included in the Atlas **Network Access** list.
- If your public IP address has changed, add the new address in Atlas.
- Confirm that reserved characters in the database password are percent-encoded.

### The terminal reports `bad auth: authentication failed`

The database username or password in `MONGODB_URI` is incorrect. Remember that the MongoDB database user is separate from the account used to sign in to the Atlas website.

### The terminal reports `MongoDB URI cannot have port number` or `Invalid URL`

The connection string is incomplete, contains a placeholder, or contains a special password character that has not been percent-encoded. Copy a fresh driver connection string from Atlas and replace its placeholders carefully.

### The browser cannot open `localhost:3000`

- Confirm that `node server.js` is still running.
- Read the terminal for an error message.
- Confirm that you opened `http://localhost:3000` rather than the project file directly.
- Stop any other program already using port 3000, or close an older FitTrack server before restarting it.

### Login works initially but later expires

FitTrack login tokens expire after two hours. Log in again to create a new session.

## Application structure

```text
models/           MongoDB schemas and models
public/           Frontend HTML, CSS, images, and JavaScript
server.js         Express server, authentication, database connection, and API routes
package.json      Project information and dependency list
package-lock.json Exact installed dependency versions
README.md         Installation, usage, and project documentation
TESTING.md        Manual test cases and recorded results
.gitignore        Files that Git must exclude
```

## Dynamic interactions

1. After login, the dashboard displays a personalized welcome message using the authenticated user's name.
2. The dashboard checks the current date and automatically displays the workout scheduled for today.
3. While planning a workout, the user can add or remove several structured exercises. JavaScript immediately displays each exercise with its sets and repetitions before the complete workout is saved.
4. The workout search and filter controls immediately update the visible workout list according to the user's search text, selected status, or selected date.

## Security notes

- Passwords are hashed with bcryptjs before they are stored.
- Protected workout routes require a valid JSON Web Token.
- MongoDB credentials and the JWT secret are loaded from the private `.env` file.
- The `.env` file and `node_modules` folder are intentionally excluded from Git.

This application was created as an educational portfolio project and is not intended for production deployment without further security review and testing.
