# Zonta
Create a website/creator to benefit the Zonta Group of Naples, Florida
[Jira Webpage](https://zontawebteam.atlassian.net/jira/software/projects/ZNTWBST/boards/36)
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
Click the links below to view the architecture diagrams for this project.

* [**Class Diagram**](UML/class-diagram.png) – Structure of data, scripts, and pages.
* [**Sequence Diagram**](UML/sequence-diagram.png) – Timeline of an event from creation to deletion.
* [**Collaboration Diagram**](UML/collaboration-diagram.png) – How the Admin, Visitor, and Automation interact.
* [**Activity Diagram**](UML/activity-diagram.png) – Detailed workflow of the decision logic.
