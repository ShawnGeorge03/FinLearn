# FinLearn - Agile Avengers

## Iteration 02

- Start date: 26/06/2023
- End date: 07/07/2023

## Process

### Changes from the previous iteration

List the most significant changes you made to your process (if any).

- Added CI and Linting rules: We decided to add automatic linting checks using GitHub Actions to improve our development workflow and quality of code.

### Roles & responsibilities

- Each person takes up a feature and implements the backend as well as the front end required for it.
- During the implementation, the developer can reach out to anyone else on the team in case they require help.
- Once the implementation is complete, the developer assigns another developer on the team to review their implementation.
- If a person is responsible for implementing something that requires a broader discussion with the team, they are responsible for setup, confirming, and conducting a meeting with the team.
- Every meeting, one person will be responsible to take notes. The entire team will take turns to be the notetaker according to the lexicographical order of their names

### Events

- Sprint Planning meeting online at the start of the sprint as per the aforementioned date.
- In-person meeting on Tuesday after class.
- Standups asynchronous over Discord.
- Meetings can be either for standup, sprint planning, sprint review, or ad-hoc purposes. All meetings will be held online over Zoom.
- Conduct ad-hoc pair programming sessions.

### Artifacts

List/describe the artifacts you will produce to organize your team.

- We produced a JIRA board and integrated it with GitHub to keep track of all the ongoing tickets, and their status.
- We produced a confluence board to keep track of all product documentation.
- We used RetroTool to conduct our retrospective meetings and stored the content from the retrospective in our Confluence documents.
- Tasks are assigned to team members as a part of the initial sprint planning, and then if required team members take up unforeseen tasks that are needed to make progress.
- Tasks are prioritized from the backlog based on their impact on the user.

### Git / GitHub workflow

We chose the following workflow to optimize communication and ensure
consistency in our version control activities. The strategies mentioned below
maximize visibility and information flow within the project.

#### Git Flow

- Git Flow is a common git branching strategy that helps with agile software
  development and will be used for the duration of this project.
- It creates 2 branches called main and develops which are both responsible for
  recording the history of the project. They also have specific responsibilities.
- The main branch stores the latest stable version of the software while
  the developer stores all the latest complete features from the feature/\* branches.
- When a new feature is to be built, devs are required to start by branching
  off from the latest development branch to create a feature branch.
- When the feature is complete a PR will be created from the feature branch
  to the develop branch, never to the main branch. The PR can be assigned to any
  team member who did not work on that feature.
- If the PR is approved the branch commits will be Squash and Merged to its
  parent branch.

#### Conventional Commits

- We plan to follow the conventional commits naming strategy for commits and
  branches.
- A branch should begin with a category, reference, and brief description and
  will follow the below pattern:
  `{category/reference/description}`
  - Category
    - feature: Adding or Modifying a feature
    - bugfix: Fixing a Bug in developing
    - hotfix: Fixing a Bug in Production, and/or Release
    - chore: Everything Else (Documentation, Formatting, Adding Tests and others)
  - Reference: This points to a ticket number and must follow this format
    {FIN-#}, but if no reference exists then add non-ref.
  - Description: This is meant to be a brief description of the branch

## Product

### Goals and tasks

- All Courses Page - Search Bar: As a signed-in student, I want to be able to search for a particular course or unit that I might be interested in by name.
- Dashboard Learning Page - Continue Learning: As a student, I want to access the dashboard learning page so that I can continue a unit I am learning.
- Account Management - Update Avatar: As a student, I want to update my avatar so that I can personalize my appearance on the platform.
- Account Management - Save Changes: As a student, I want to save the changes I make on the Account Management page so that the updated information is reflected on my account across the platform.
- Account Management - Update Username: As a student, I want to update my username so that I can personalize my account.
- Account Management - Update Password: As a student, I want to edit my password so that I can update it to a new password of my choice.
- Repository and Development flow enhancements:
  - ESLint
  - Prettier
  - Incorporation into GitHub Actions

### Product Artifacts

- Create progress bars on pages to visualize the progress of a student.
- Create a search bar on the All Courses page to easily search a unit or course.
- Create a unit page that lists all the content inside a unit
