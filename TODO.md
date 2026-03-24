- [ ] Create a suite of pages where a user can register themself with mfa enabled by default and mandatory :

- TOTP
- Personal questions
- Recovery code
- Seed
- Verification email

To recover a lost account; user will need personal questions of recoverry code. They will need to be set at accounrt creation.


Each time, passord + TOTP mandatory are asked

Recover methods :
If TOTP is lost, reset procedure with see
If password is lost, reset procedure personal questions

When user created in Keycloak API, set by default, verifyEmail, TOTP, Seed and Questions required questions

Once Seed is setup, remove the seed of requiredActions user dic
Once personal questions are setup, remove the questions of requiredActions user dic

- [ ] Add a blog post for the MFA methods

- [ ] Create a dashboard like https://github.com/keycloak/keycloak/tree/main/js/apps/account-ui with all pages for the user to manage they account using https://github.com/keycloak/keycloak/tree/main/js/libs/keycloak-admin-client following [transform.md](./transform.md)

- [ ] In the dashboard, add a page where the user can see the metrics related to the user theyself, queried from prometheus

- [ ] Add user profile picture using keycloak custom attribute field. However, compare multiuple implementations for this before doing it

- [ ] Disable keycloak user account ui and user password or TOTP recovery

- [ ] Add a email proxy for privacy and anti data-leak like AppleId

- [ ] Plug Better Auth to Keycloak instances for user

- [ ] Define governance for the three realms (prod, dev, ops)

- [ ] Automate keycloak account-ui monitoring and PR proposals with https://cursor.com/docs/cli/github-actions

- [ ] Mark somewhere against what version of keycloak is built the apps/web/src/routes/account pages

- [ ] Add tests for the web app with auth

- [x] Mutualize the landing and web tsconfig.json

- [ ] Create a Keycloak extension to implement admin API endpoints for TOTP lifecycle management
Take inspiration on https://github.com/arisusantolie/keycloak-totp-api-provider and https://deepwiki.com/search/can-i-create-a-java-extension_d6f847f8-6b97-4b5a-b32a-1c56b5986200?mode=fast

- [ ] Create a page where user can set up or remove a totp. Keep multi devices support like Keycloak.

- [ ] Create permanent admin account using terraform ?