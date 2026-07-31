# Ajaia Docs Submission

## Live Links

- Frontend: https://ajaia-docs-sigma-eight.vercel.app
- Backend health endpoint: https://ajaia-docs-api-1452.onrender.com/health
- Source repository: https://github.com/anandpratap1010/ajaia-docs
- Walkthrough video: https://www.loom.com/share/650943959f73469fab794621b3b21961
- Google Drive folder: <ADD_GOOGLE_DRIVE_FOLDER_URL>

## Demo Accounts

### Owner

Email: owner@ajaia.demo  
Password: Password123!

### Collaborator

Email: collaborator@ajaia.demo  
Password: Password123!

### Reviewer

Email: reviewer@ajaia.demo  
Password: Password123!

## Included Materials

- Source code
- README.md
- ARCHITECTURE.md
- AI_WORKFLOW.md
- AI_NATIVE_WORKFLOW.md
- SUBMISSION.md
- WALKTHROUGH_SCRIPT.md
- WALKTHROUGH_URL.txt
- Screenshots directory
- Sample import files

## Working Features

- Seeded-account login
- Create document
- Rename document
- Rich-text editing
- Manual save and reopen
- Text and Markdown import
- Owner-controlled sharing
- Owned/shared document distinction
- Persistent database
- Backend authorization
- Isolated integration tests
- Vercel and Render deployment configuration

## Known Limitations

- Collaboration is asynchronous; there are no WebSockets, CRDTs, live cursors, or presence.
- There are no comments, version history, track changes, or offline mode.
- Sharing works only with an existing seeded user; there are no email invitations or public links.
- Markdown import intentionally simplifies complex nested and inline formatting.
- JWT storage in local storage is a timeboxed demo choice. Production should use secure HTTP-only cookies with CSRF protection.
- PDF, DOCX, OCR, and document export are not supported.
- The frontend bundle can be reduced further with route-level code splitting.

## Next 2–4 Hours

- Add Playwright tests for the complete two-account reviewer workflow.
- Add request-sequenced autosave while retaining manual save.
- Improve Markdown mark, nested-list, and link conversion.
- Move authentication to secure HTTP-only cookies.
- Add route-level code splitting and bundle analysis.
- Capture desktop and mobile screenshots.
- Add deployment monitoring and structured API logs.

## Manual Submission Steps

- Add the source repository URL.
- Record and add the walkthrough video URL.
- Add the Google Drive folder URL if required.
- Capture final screenshots after the latest frontend deployment.
- Run the complete owner-to-collaborator flow against production after each deployment.
