# Gmail Automation

## Pre-requisites

1. Sendgrid account
2. Google Console Account
3. Heroku Account
4. PNPM and Node JS 14>

## Not So Quick Start

1. Create new project in Google Console (https://console.cloud.google.com/)
2. Enable Gmail API
3. Configure OAuth Consent Screen
4. Set OAuth scope as gmail.modify
5. Add test user for email address to be tracked
6. Save credentials.json into root folder
7. Copy .env.example to .env
8. Replace .env values with credentials.json values
9. Uncomment `generateCredentials()` in index.ts
10. Run pnpm i
11. Run pnpm dev
12. Open generated OAuth link in terminal
13. Copy generated Auth code back in terminal
14. Get generated token.json values
15. Replace .env values with token.json
16. Create a service account in Google Console (https://cloud.google.com/docs/authentication/production)
17. Create new service account key
18. Save service account key locally
19. Copy service_account values into .env
20. Enable Google Pub/Sub in Google Console
21. Create new topic
22. In topic sidepanel, click permssions, add principal "gmail-api-push@system.gserviceaccount.com"
23. Copy topic name and subscription name and insert in .env value
24. Comment `generatedCredential()`
25. Run pnpm dev
26. Try sending emails to selected email account

## Deploying to Heroku

1. Register for an account in Heroku.com
2. Install Heroku toolbelt ClI
3. Run `heroku create`
4. Go to heroku.com and go to the newly created app
5. In settings page, add config vars
6. Copy all values from .env into config vars
7. Run `git push heroku master`
8. Check application logs to confirm that application is up and running
9. a
