# FitTrack Manual Testing

These tests verify the application’s main features, validation, security, and responsive design.

| ID | Feature | Test performed | Expected result | Result |
|---|---|---|---|---|
| T01 | Registration | The user enters a name, a new valid email address and a password containing at least eight characters, then clicks **Create account**. | The backend creates one account, stores a hashed version of the password and displays a successful-registration message. | Pass |
| T02 | Duplicate validation | The user tries to create another account using an email address that is already registered. | The backend rejects the request, displays a duplicate-account message and does not create a second account. | Pass |
| T03 | Login | The user enters the correct email address and password for an existing account, then clicks **Log in**. | The backend verifies the credentials, returns a login token and opens the dashboard with the authenticated user's name in the welcome message. | Pass |
| T04 | Login validation | The user enters a registered email address with an incorrect password and clicks **Log in**. | The application displays a general incorrect-email-or-password message and does not open the private dashboard. | Pass |
| T05 | Workout creation | The user selects a workout category, adds exercises with valid sets and repetitions, selects today's date and clicks **Save workout**. | The backend stores the complete workout in MongoDB and the frontend displays it in **Today's Workout** and **My Workouts**. | Pass |
| T06 | Future workout | The user creates a valid workout and selects a scheduled date later than the current date. | The workout appears with the status **Planned** in **My Workouts**, but it does not replace the workout displayed for today. | Pass |
| T07 | Workout completion | The user clicks **Mark as complete** on the workout scheduled for today. | The backend saves the completed status, the dashboard changes the label to **Completed**, and the change remains after refreshing the page. | Pass |
| T08 | Delete cancellation | The user clicks **Delete** beside a saved workout and selects **Cancel** in the confirmation dialog. | The application closes the dialog without sending a deletion request, so the workout remains visible and stored in MongoDB. | Pass |
| T09 | Workout deletion | The user clicks **Delete** beside a saved workout and confirms the deletion. | The backend removes the selected workout belonging to that user, and it no longer appears after the dashboard refreshes. | Pass |
| T10 | Category exercise list | The user selects **Upper Body** and opens the exercise list, then changes the category to **Lower Body**. | The first list contains only upper-body exercises. After the category changes, the application clears incompatible selections and displays only lower-body exercises. | Pass |
| T11 | Status filter | The user selects **Completed** from the status filter in **My Workouts**. | The list immediately hides planned workouts and displays only workouts whose saved status is completed. | Pass |
| T12 | Date filter | The user chooses a date that matches one or more saved workouts in the date filter. | The list displays only workouts scheduled for the selected date. Choosing a date without a match displays the no-results message. | Pass |
| T13 | Workout search | The user types part of a workout title or exercise name into the search field. | JavaScript immediately displays the matching workouts and hides items that do not contain the search text. | Pass |
| T14 | Clear filters | The user applies search, status or date filters and then clicks **Clear filters**. | The application removes every filter value and displays the complete list of saved workouts again. | Pass |
| T15 | Workout completion ratio | The user loads the dashboard with three completed workouts and one still-planned workout. | The summary displays 3 completed, 1 still planned and a decimal completion ratio of 0.75, calculated as completed workouts divided by all workouts. | Pass |
| T16 | Responsive layout | The user opens the login page, dashboard and workout form at a mobile viewport width of approximately 390 pixels. | The cards, form controls, filters and buttons reorganize into readable mobile layouts without horizontal scrolling. | Pass |

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
