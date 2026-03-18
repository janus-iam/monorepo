# First run

I want you to :

- extract all existing routes in keycloak account-ui in keycloak/js/apps/account-ui/src/routes.tsx in an array with a brief summary
- identify what api endpoinds they are using and find in @keycloak/keycloak-admin-client which methods you can use to do the same thing in an array
- using shadcn and @keycloak/keycloak-admin-client, impelment the same pages for all existing routes to implement them in apps/web

Constraints :
The web app will auth user with better-auth to keycloak through oidc.
The web app routes should be placed under apps/web/src/routes/account/
@keycloak/keycloak-admin-client will be called in the packages/api through protected TRPC procedures.
You will use i18n.


Other pages to implement :

- Show the user a glimpse of their recent activities
  GET /admin/realms/{realm}/events?user={userId}
  List of EventRepresentation
  @keycloak/keycloak-admin-client matching method : findAdminEvents defined in js/libs/keycloak-admin-client/src/resources/realms.ts#L4
  Find a way to display the stats with explanation for educationnal purposes
- A page where user can select secruity level notification they get : I WILL DO THIS ONE

# Future runs

Get the latest keycloak version by running bun fetch-account-ui
That will return NEW_VERSION

Get the current version by running bun fetch-account-ui current
This will return CURRENT_VERSION

Check the keycloak version, if they are different you will run :

bun fetch-account-ui CURRENT_VERSION
bun fetch-account-ui NEW_VERSION

Then make a diff between the two folders (diff -ruN keycloak-account-ui-CURRENT_VERSION keycloak-account-ui-NEW_VERSION) and implement the required changes as a PR.
