import CSS from "csstype";

export const ActivityTypeNameMap: {
  // [key: ActivityTypeName]: string;
  SoftwareApp: string;
  SoftwareLib: string;
  Patch: string;
  Work: string;
  Publication: string;
  Volunteer: string;
  Website: string;
  Article: string;
} = {
  SoftwareApp: "App",
  SoftwareLib: "Software Component (Library)",
  Patch: "Software Contribution (Patch)",
  Work: "Work",
  Publication: "Publication",
  Volunteer: "Volunteer",
  Website: "Website",
  Article: "Article",
};

export const ActivityTypeColors: {
  // [key: ActivityTypeName]: string;
  SoftwareApp: CSS.Properties;
  SoftwareLib: CSS.Properties;
  Patch: CSS.Properties;
  Work: CSS.Properties;
  Publication: CSS.Properties;
  Volunteer: CSS.Properties;
  Website: CSS.Properties;
  Article: CSS.Properties;
} = {
  SoftwareApp: {
    color: "#f1f8ff", // blue
  },
  SoftwareLib: {
    color: "#f1f8ff", // blue
  },
  Patch: {
    color: "#f1f8ff", // blue
  },
  Work: {
    color: "#f1f8ff", // blue
  },
  Publication: {
    color: "#f1f8ff", // blue
  },
  Volunteer: {
    color: "#f1f8ff", // blue
  },
  Website: {
    color: "#f1f8ff", // blue
  },
  Article: {
    color: "#f1f8ff", // blue
  },
};

export const OrgTypeColors: {
  // [key: OrgTypeName]: string;
  "Open Source": CSS.Properties;
  Company: CSS.Properties;
  Publication: CSS.Properties;
  Website: CSS.Properties;
} = {
  "Open Source": {
    color: "#4a4a4a",
    backgroundColor: "#f5f5f5",
  },
  Company: {
    color: "#4a4a4a",
    backgroundColor: "#f5f5f5",
  },
  Publication: {
    color: "#4a4a4a",
    backgroundColor: "#f5f5f5",
  },
  Website: {
    color: "#4a4a4a",
    backgroundColor: "#f5f5f5",
  },
};

export const LANGUAGE_FALLBACK_COLOR = "#f6f8fa";
