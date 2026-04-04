import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      personalInfo: "Personal info",
      personalInfoDescription: "Manage your profile and preferences.",
      save: "Save",
      cancel: "Cancel",
      deviceActivity: "Device activity",
      signedInDevicesExplanation:
        "Review and manage devices and sessions signed in to your account.",
      refreshPage: "Refresh",
      signOut: "Sign out",
      signOutAllDevices: "Sign out all devices",
      linkedAccounts: "Linked accounts",
      linkedAccountsIntroMessage: "Manage identity providers linked to your account.",
      signingIn: "Signing in",
      signingInDescription: "Manage credentials and sign-in methods.",
      application: "Applications",
      applicationsIntroMessage: "Review apps that have access to your account.",
      groups: "Groups",
      groupDescriptionLabel: "View your group memberships.",
      organizations: "Organizations",
      organizationDescription: "View organizations you belong to.",
      resources: "Resources",
      resourceIntroMessage: "Manage resources and sharing permissions.",
      oid4vci: "Verifiable credentials",
      verifiableCredentialsTitle: "Verifiable credentials",
      verifiableCredentialsDescription: "Request verifiable credentials from your issuer.",
      content: "Content",
    },
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export { i18n };
