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
| T10 | Category exercise list | Select Upper Body, then open the exercise list | Only upper-body exercise suggestions are displayed | Pass |
| T11 | Status filter | Select Completed in My Workouts | Only completed workouts are displayed | Pass |
| T12 | Date filter | Choose a date that contains a saved workout | Only workouts scheduled for that date are displayed | Pass |
| T13 | Workout search | Search for a workout title or exercise name | Matching workouts are displayed immediately | Pass |
| T14 | Clear filters | Apply several filters, then select Clear filters | All saved workouts are displayed again | Pass |
| T15 | Workout completion ratio | Load, complete, create, and delete workouts | Completed count, planned count, and decimal completion ratio (completed ÷ total) update correctly | Pass |
| T16 | Responsive layout | Test login, dashboard, and form at mobile width | Content fits without horizontal scrolling | Pass |

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
