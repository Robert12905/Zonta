# Zonta
Create a website/creator to benefit the Zonta Group of Naples, Florida
[Jira Webpage](https://zontawebteam.atlassian.net/jira/software/projects/KAN/boards/1?atlOrigin=eyJpIjoiMzE4YzNiYmJhMmJkNGNiYzk1MTZmNjE3NjQ5MmRmY2EiLCJwIjoiaiJ9)
[SRS Document](https://docs.google.com/document/d/1dx0one2dwSTBl1hStofs0c4XrH2GcPaY/edit?usp=sharing&ouid=118252589920793936650&rtpof=true&sd=true)

## CMS Decap CMS — Quick Setup

This repository now includes a drop-in static CMS configuration using Decap (Netlify) CMS. The admin UI lives at `/admin/index.html` and the CMS configuration is in `/admin/config.yml`.

What you get:
- An editable homepage (title, main paragraph, hero image) backed by `/content/homepage.json`
- An `events` collection under `/content/events/` to add events
- An `about` collection under `/content/about/` for about page
- A `homepage` collection under `/content/homepage/` for homepage changes
- Image uploads are stored in `/Assets` and referenced from JSON files

How to enable the admin panel (Netlify hosting):
1. Deploy the site on Netlify (or a compatible hosting provider).
2. In Netlify app -> Site settings -> Identity: enable Identity (open signup or email invites).
3. In Netlify app -> Settings -> Git Gateway: enable Git Gateway.
4. In Netlify admin you can invite users (email) who will sign in and access `/admin`.

Local testing: Decap CMS requires a backend (git-gateway) and won't fully work from file:// paths — test on a deployed preview site or local dev server connected to Git/Gateway.

## System Architecture
Visual documentation of the project structure and logic.

### 1. Class Diagram (Structure)
**Purpose:** Shows how the file structure (JSON, JS, HTML) maps to logical classes.
![Class Diagram](UML/class-diagram.png)

### 2. Sequence Diagram (Timeline)
**Purpose:** Shows the lifecycle of an event from creation (Admin) to deletion (Automation).
![Sequence Diagram](UML/sequence-diagram.png)

### 3. Collaboration Diagram (Interactions)
**Purpose:** Shows how the 3 main actors (Admin, User, Automation) interact via the GitHub Repo.
![Collaboration Diagram](UML/collaboration-diagram.png)

### 4. Activity Diagram (Workflow)
**Purpose:** Detailed flowchart of the decision logic, specifically the automated cleanup process.
![Activity Diagram](UML/activity-diagram.png)
