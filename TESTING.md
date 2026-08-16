# FitTrack Manual Testing

These tests verify the application’s main features, validation, security, and responsive design.

| ID | Feature | Test performed | Expected result | Result |
|---|---|---|---|---|
| T01 | Registration | Register using valid new account details | Account is created successfully | Pass |
| T02 | Duplicate validation | Register again using the same email | Duplicate-account message appears | Pass |
| T03 | Login | Log in using the correct email and password | Personalized dashboard opens | Pass |
| T04 | Login validation | Log in using an incorrect password | Incorrect email or password message appears | Pass |
| T05 | Workout creation | Create a workout scheduled for today | Workout is saved and displayed in Today’s Workout | Pass |
| T06 | Future workout | Create a workout using a future date | Workout appears as Planned in My Workouts | Pass |
| T07 | Workout completion | Mark today’s workout as complete | Status changes to Completed and remains after refresh | Pass |
| T08 | Delete cancellation | Click Delete and cancel the confirmation | Workout remains saved | Pass |
| T09 | Workout deletion | Confirm deletion of a test workout | Workout disappears from the dashboard and database | Pass |
| T10 | Responsive layout | Test login, dashboard, and form at mobile width | Content fits without horizontal scrolling | Pass |

## Security checks


- Passwords are stored as hashes rather than readable text.
- Protected workout routes require a valid JWT.
- Database queries restrict workouts to the authenticated user.
- `.env` is excluded from GitHub.
- Incorrect login details do not reveal whether an email exists.

## Testing environment

- Browser: Desktop web browser
- Backend: Node.js and Express
- Database: MongoDB Atlas
- Frontend: HTML, CSS, and JavaScript