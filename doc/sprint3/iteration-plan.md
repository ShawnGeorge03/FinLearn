# FinLearn - Agile Avengers

## Iteration 03

- Start date: 12/07/2023
- End date: 21/07/2023

## Participants

- Shawn Santhoshgeorge
- Adam Badar
- Aditya Kulkarni
- Shashwat Doshi
- Rahul Sharma
- Balraj Kharol
- Aryan Thakur

## Process

### Changes from the previous iteration

List the most significant changes you made to your process (if any).

None

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

- Research Page - Search: As a student, I want to be able to search for a specific stock.
- Research Page - More Information: As a student, I want to be able to view a stock's fundamental data, company profile, and in-depth indicators
- Research Page - Top 10 Stocks: As a student, I want to be able to view a selection of the top 10 stocks in a specific category with their graphs
- Research Page - Stock Screener: As a student, I want to be able to view a selection of stocks in a compact manner with more details
- Learning - Monitor Video Progress: As a student I want to track my progress so that I can resume the video where I stopped
- Trading Simulator - User Interface: Create a basic UI for the trading page as described in Figma.
- Trading Simulator - Schema: Create an independent schema to keep track of the trades of the user.
- Task - Add TradingView for Next.js: Adding `npm: react-ts-tradingview-widgets` will provide both React and TS Support and make it easier for use to work with the TradingView Widgets
- Task - AlphaVantage API for the server: Adding a common Alpha Vantage Querying Implementation help to reduce duplicate work and avoid merge hell.
- Task - Implement Server error handling: Implementing Error Handling will help to handle errors from the Server more easily on the Client

### Product Artifacts

- Update Progress bars to vizualize progress.
- Create a research page to research different stocks.
- Create an information page to display information each stock.
- Create a search bar on the Research page to easily search a stock.
