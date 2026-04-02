- [ ] Create a page called `what-do-you-need` with two CTA buttons, one is `Sign In` and the other is `Register`; this will be a gateway to either the register flow or login with keycloak itself. After Sign in, redirect to `/dashboard`

- [ ] Put the same fonts in web and landing

- [ ] Create a suite of pages where a user can register themself with mfa enabled by default and mandatory :

There are 8 steps to complete :

- Email
- Verification email
- Username
- Password
- Conditions of use etc Acceptation
- TOTP
- Personal questions
- Seed
- Explain the viusal security signature while showing it for it for the first time and phishing prevention

And then make a beautiful "Thank you screen" and goodbye screen.

## TOTP

Implemented with Keycloak Admin REST API

## Personal questions

Define 3 questions that the user will need to answer to register.
2 only will be required to recover.

You will store the questions chosen in a database in plain text and the answers in a hash.
Questions should be generated like :

Family members:

- mom
- dad
- mother father
- mother mother
- father father
- father mother
- you

Questions:

- birth city
- first pet color
- first pet name

What is {question} of {family member}

The user can refresh the questions combianiason if it doesnt work for him.

They can also creates their own questions.

## Recovery code

Generate a recovery code that the user will need to use to recover their account if they lose their password.

## Verification email

Send a verification email to the user to verify their email.

## Password

Must be a X menomic words generated. They will be english.

Encourage the user to create a story with this word.
For example show "monkey car sun table oven" -> "A monkey wont ride a car, but loves the sun. I have a great table and a good oven".
They can remember via multiplephrases. Be pedagological.

## Verification email

Use default Keycloak email verification procedure

## Seed

Generate a seed with bip39.mnemonicToSeedWebcrypto(mn); where mn is the chosen passphrase.

You will store the seed in the db for recovery later if needed.

AT each connnection, passord + TOTP mandatory are asked
There are recovery methods :
If TOTP is lost, reset procedure with seed.
If password is lost, reset procedure with personal questions.

# Force user to complete steps :

When user created in Keycloak API, set by defaul : verifyEmail, TOTP, Seed and Questions as Keycloak required questions.
Once Seed is setup, remove the seed of requiredActions user dic
Once personal questions are setup, remove the questions of requiredActions user dic

For registration screens, create a `/register/route.tsx` providing a parent layout and all steps who are each in one file `/register/STEP1.tsx` `/register/STEP2.tsx` etc
At each step show a phrase like :
"You might lose 3 minutes to create your account but we swear it will be worth it ;)"
"Two more steps to go..."
"Only one step remaining"
"This is the last one !"

Use smooth animations for sliding between the steps etc !

- [ ] Add a blog post for all the MFA methods

- [ ] Improve the theme and make it the same for apps/landing/src/routes/blog.$slug.tsx and apps/landing/src/routes/governance.$slug.tsx

- [ ] Create a dashboard like https://github.com/keycloak/keycloak/tree/main/js/apps/account-ui with all pages for the user to manage they account using https://github.com/keycloak/keycloak/tree/main/js/libs/keycloak-admin-client following [transform.md](./transform.md)

- [ ] In the dashboard, add a page where the user can see the metrics related to the user theyself, queried from Clickhouse

- [ ] See if we can disable keycloak user event collections since they are published to NATS via KETE and saved into Clickhouse

- [ ] In one of the page or in a new one, they should be able to manage their profile picture.

- [ ] Add user profile picture using keycloak custom attribute field. However, compare multiuple implementations for this before doing it

- [ ] Disable keycloak user account ui and password recovery or TOTP recovery

- [ ] Add a email proxy for privacy and anti data-leak like AppleId

- [ ] Plug Better Auth to Keycloak instances for user

- [x] Define governance for the three realms (prod, dev, ops)

- [ ] Automate keycloak account-ui app monitoring and PR proposals with https://cursor.com/docs/cli/github-actions

- [ ] Mark somewhere against what version of keycloak is built the apps/web/src/routes/account pages and edit `scripts/fetch-account-ui.ts` accordingly

- [ ] Add tests for the web app with auth

- [x] Mutualize the landing and web tsconfig.json

- [ ] Add to landing page
  - [ ] https://magicui.design/docs/components/highlighter
  - [ ] https://magicui.design/docs/components/dotted-map
  - [ ] https://magicui.design/docs/components/light-rays
  - [ ] https://ui.aceternity.com/blocks/illustrations/testimonials-hover-illustration
  - [ ] https://ui.aceternity.com/components/gooey-input ?
  - [ ] https://www.chamaac.com/components/sections/how-it-works to explain register flow

- Explore MapCN https://ui.tripled.work

- [ ] Create a trpc public procedure for landing page analytics which forward to NATS

- [ ] Create a trpc private procedure for web app analytics which forwards to NATS

- [ ] Add NATS event emission in existing TRPC procedures for meaningful analytics

- [ ] Create a batched ingestion service from NATS to Clikhouse -> langage to be chosens

- [x] Add to web app dor "what-do-you-need" page https://magicui.design/docs/components/striped-pattern

- [x] Add to web app https://www.cult-ui.com/docs/components/family-button to switch color mode

- [ ] Create a Keycloak extension to implement TOTP lifecycle management admin API endpoints
      Take inspiration on https://github.com/arisusantolie/keycloak-totp-api-provider and https://deepwiki.com/search/can-i-create-a-java-extension_d6f847f8-6b97-4b5a-b32a-1c56b5986200?mode=fast

- [ ] Add a Shared Secret Visual Method like https://github.com/teapot-labs/identeapots

- [ ] Add a blog post explaining the role of the "Security Signature" Shared Secret Visual and where the passkeys comes in clutch to verify domain name. Open source -> More prone to be cloned and phising tries. Still a security for email to prevent fishing. Version for dev : "deterministic visual anti-phishing identifier" - accessible via une API avec un hash du user id

- [ ] Add `janus_signature_hash` keycloak custom attribute field. Use server app to compute with `HMAC(user_id, server_secret)` and update it with the Keycalok API between `Conditions of use etc Acceptation` and `TOTP` register flow steps

- [ ] Create a ultra performant dedicated API for with cache and metrics integration with one endpoint : https://signature.getjanus.eu/v1/${user.attributes.janus_signature_hash}.svg. You will create a workload perf benchmark -> langage to be chosen

- [ ] Generate a new keycloak admin client ?

- [ ] Create a page where user can set up or remove a totp. Keep multi devices support like Keycloak.

- [x] Write a message in the web app footer using https://vercel.com/docs/environment-variables/system-environment-variables saying :
      "Built against commit …" with a link to the github repo commit.

- [ ] Create requiredActions using Terraform

- [ ] Create permanent admin account using terraform ?

- [ ] Server will listen to NATS

- [ ] Create workers for NATS messaging

- [ ] Connexion check
