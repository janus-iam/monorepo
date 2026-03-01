- [ ] Create a suite of pages where a user can register themself with mfa enabled by default :

- TOTP
- Personal questions
- Recovery code
- Verification email

To recover a lost account; user will need personal questions of recoverry code. They will need to be set at accounrt creation.

- [ ] Create a dashboard like https://github.com/keycloak/keycloak/tree/main/js/apps/account-ui with all pages for the user to manage they account using https://github.com/keycloak/keycloak/tree/main/js/libs/keycloak-admin-client :

- copy endpoints queryiung
- keep same functions

- [ ] In the dashboard, add a page where the user can see the metrics related to the user theyself, queried from prometheus

- [ ] Add user profile picture using keycloak custom attribute field. However, compare multiuple implementations for this before doing it

- [ ] Disable keycloak user account ui

- [ ] Add a email proxy for privacy
