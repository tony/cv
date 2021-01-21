import chroma from "chroma-js";
import CSS from "csstype";

interface IActivityTypeNameStringMap {
  // [key: ActivityTypeName]: string;
  SoftwareApp: string;
  SoftwareLib: string;
  Patch: string;
  Work: string;
  Publication: string;
  Volunteer: string;
  Website: string;
  Article: string;
}
export const ActivityTypeNameMap: IActivityTypeNameStringMap = {
  SoftwareApp: "Published software",
  SoftwareLib: "Published software (library, component)",
  Patch: "Contributed software patch",
  Work: "Employed",
  Volunteer: "Volunteered",
  Publication: "Published book",
  Website: "Published website",
  Article: "Published article",
};
export const ActivityTypeVerbMap: IActivityTypeNameStringMap = {
  SoftwareApp: "Published",
  SoftwareLib: "Published",
  Patch: "Patched",
  Work: "Worked",
  Volunteer: "Volunteered",
  Publication: "Published",
  Website: "Published",
  Article: "Published",
};
export const ActivityTypeEmojiMap: IActivityTypeNameStringMap = {
  SoftwareApp: "",
  SoftwareLib: "⚙️",
  Patch: "",
  Work: "",
  Volunteer: "",
  Publication: "",
  Website: "",
  Article: "",
};

export const ActivityTypeSVGIconMap: IActivityTypeNameStringMap = {
  SoftwareApp: "package",
  SoftwareLib: "settings",
  Patch: "file-diff",
  Work: "briefcase",
  Volunteer: "heart",
  Publication: "book",
  Website: "browser",
  Article: "news",
};

// Thanks @primer/css, license MIT
// https://github.com/primer/css/blob/cdaaba6/src/support/variables/color-system.scss
export const ColorsBase: {
  [key: string]: string;
} = {
  black: "#1b1f23",
  white: "#fff",
  // ........ Gray .........
  "gray.000": "#fafbfc",
  "gray.100": "#f6f8fa",
  "gray.200": "#e1e4e8",
  "gray.300": "#d1d5da",
  "gray.400": "#959da5",
  "gray.500": "#6a737d",
  "gray.600": "#586069",
  "gray.700": "#444d56",
  "gray.800": "#2f363d",
  "gray.900": "#24292e",
  // ........ Blue ........
  "blue.000": "#f1f8ff",
  "blue.100": "#dbedff",
  "blue.200": "#c8e1ff",
  "blue.300": "#79b8ff",
  "blue.400": "#2188ff",
  "blue.500": "#0366d6",
  "blue.600": "#005cc5",
  "blue.700": "#044289",
  "blue.800": "#032f62",
  "blue.900": "#05264c",
  // ........ Green ........
  "green.000": "#f0fff4",
  "green.100": "#dcffe4",
  "green.200": "#bef5cb",
  "green.300": "#85e89d",
  "green.400": "#34d058",
  "green.500": "#28a745",
  "green.600": "#22863a",
  "green.700": "#176f2c",
  "green.800": "#165c26",
  "green.900": "#144620",
  // ........ Yellow ........
  "yellow.000": "#fffdef",
  "yellow.100": "#fffbdd",
  "yellow.200": "#fff5b1",
  "yellow.300": "#ffea7f",
  "yellow.400": "#ffdf5d",
  "yellow.500": "#ffd33d",
  "yellow.600": "#f9c513",
  "yellow.700": "#dbab09",
  "yellow.800": "#b08800",
  "yellow.900": "#735c0f",

  // ........ Orange ........
  "orange.000": "#fff8f2",
  "orange.100": "#ffebda",
  "orange.200": "#ffd1ac",
  "orange.300": "#ffab70",
  "orange.400": "#fb8532",
  "orange.500": "#f66a0a",
  "orange.600": "#e36209",
  "orange.700": "#d15704",
  "orange.800": "#c24e00",
  "orange.900": "#a04100",
  // ........ Red ........
  "red.000": "#ffeef0",
  "red.100": "#ffdce0",
  "red.200": "#fdaeb7",
  "red.300": "#f97583",
  "red.400": "#ea4a5a",
  "red.500": "#d73a49",
  "red.600": "#cb2431",
  "red.700": "#b31d28",
  "red.800": "#9e1c23",
  "red.900": "#86181d",
  // ........ Purple ........
  "purple.000": "#f5f0ff",
  "purple.100": "#e6dcfd",
  "purple.200": "#d1bcf9",
  "purple.300": "#b392f0",
  "purple.400": "#8a63d2",
  "purple.500": "#6f42c1",
  "purple.600": "#5a32a3",
  "purple.700": "#4c2889",
  "purple.800": "#3a1d6e",
  "purple.900": "#29134e",
  // ........ Pink ........
  "pink.000": "#ffeef8",
  "pink.100": "#fedbf0",
  "pink.200": "#f9b3dd",
  "pink.300": "#f692ce",
  "pink.400": "#ec6cb9",
  "pink.500": "#ea4aaa",
  "pink.600": "#d03592",
  "pink.700": "#b93a86",
  "pink.800": "#99306f",
  "pink.900": "#6d224f",
};

export const ColorsComputed: {
  [key: string]: string;
} = {
  // ........ Fades ........
  "black.fade.15": chroma(ColorsBase["black"])
    .alpha(0.15)
    .hex(),
  "black.fade.30": chroma(ColorsBase["black"])
    .alpha(0.3)
    .hex(),
  "black.fade.50": chroma(ColorsBase["black"])
    .alpha(0.5)
    .hex(),
  "black.fade.70": chroma(ColorsBase["black"])
    .alpha(0.7)
    .hex(),
  "black.fade.85": chroma(ColorsBase["black"])
    .alpha(0.85)
    .hex(),

  // White
  "white.fade.15": chroma(ColorsBase["white"])
    .alpha(0.15)
    .hex(),
  "white.fade.30": chroma(ColorsBase["white"])
    .alpha(0.3)
    .hex(),
  "white.fade.50": chroma(ColorsBase["white"])
    .alpha(0.5)
    .hex(),
  "white.fade.70": chroma(ColorsBase["white"])
    .alpha(0.7)
    .hex(),
  "white.fade.85": chroma(ColorsBase["white"])
    .alpha(0.85)
    .hex(),
};

// ........ Color defaults ........
export const ColorsDefaults: {
  [key: string]: string;
} = {
  red: ColorsBase["red.500"],
  purple: ColorsBase["purple.500"],
  blue: ColorsBase["blue.500"],
  green: ColorsBase["green.500"],
  yellow: ColorsBase["yellow.500"],
  orange: ColorsBase["orange.500"],
  "gray.dark": ColorsBase["gray.900"],
  "gray.light": ColorsBase["gray.400"],
  gray: ColorsBase["gray.500"],
};

export const Colors: {
  [key: string]: string;
} = { ...ColorsBase, ...ColorsDefaults, ...ColorsComputed };

export const OrgTypeColors: {
  // [key: OrgTypeName]: string;
  "Open Source": CSS.Properties;
  Company: CSS.Properties;
  Publication: CSS.Properties;
  Website: CSS.Properties;
} = {
  "Open Source": {
    backgroundColor: "#f5f5f5",
    borderColor: Colors["gray.300"],
    borderStyle: "solid",
    borderWidth: "1px",
    color: Colors["gray.500"],
  },
  Company: {
    backgroundColor: "#f5f5f5",
    borderColor: Colors["gray.500"],
    borderStyle: "solid",
    borderWidth: "1px",
    color: Colors["gray.700"],
  },
  Publication: {
    backgroundColor: "#f5f5f5",
    borderColor: Colors["green.300"],
    borderStyle: "solid",
    borderWidth: "1px",
    color: Colors["green.500"],
  },
  Website: {
    backgroundColor: "#f5f5f5",
    borderColor: Colors["blue.300"],
    borderStyle: "solid",
    borderWidth: "1px",
    color: Colors["blue.500"],
  },
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
    backgroundColor: Colors["gray.300"],
    borderStyle: "none",
    borderWidth: 0,
    color: Colors["gray.800"],
  },
  SoftwareLib: {
    backgroundColor: Colors["gray.200"],
    borderStyle: "none",
    borderWidth: 0,
    color: Colors["gray.800"],
  },
  Patch: {
    backgroundColor: "#f5f5f5",
    borderColor: Colors["gray.300"],
    borderStyle: "none",
    borderWidth: "0",
    color: Colors["gray.800"],
  },
  Work: {
    backgroundColor: Colors["blue.300"],
    borderStyle: "none",
    borderWidth: 0,
    color: Colors["gray.800"],
  },
  Publication: {
    backgroundColor: Colors["blue.200"],
    borderStyle: "none",
    borderWidth: "0",
    color: Colors["gray.800"],
  },
  Volunteer: {
    backgroundColor: Colors["red.300"],
    borderStyle: "none",
    borderWidth: "0",
    color: Colors["white"],
  },
  Website: {
    backgroundColor: Colors["orange.400"],
    borderStyle: "none",
    borderWidth: "0",
    color: Colors["white"],
  },
  Article: {
    backgroundColor: Colors["blue.100"],
    borderStyle: "none",
    borderWidth: "0",
    color: Colors["black"],
  },
};

export const LANGUAGE_FALLBACK_COLOR = "#f6f8fa";

// via v1: https://github.com/tony/cv/blob/v1/lib/selectors.js
export const reActivityTypoFix = /(typo|Typo|spelling|Spelling|note|Note|correct|Correct|Fix type|Fix URL|print statement|Remove duplicate)/;
export const reActivityDocImprovement = /(doc|Doc|license|LICENSE|README|readme|link|Link|\.md|instructions|Instructions|guidelines|pypi badge|AUTHORS|License|changelog|label|copyright|add cookiecutter|issue template|awesome-|front-end frameworks|Examples for issue)|to other tools|sphinx|RelayHooks-Introduction|Changelog|changelog|CHANGES|highlight/;
export const reActivityCodeStyleTweak = /(indent|Indent|whitespace|spacing|lint|Lint|sort|Sort|jshint|PEP|pep8|tabs|Tabs|Ignore|ignore|__about__|import|tweak|Tweak|hash|modernize|Add.*module|trivial|travis|Travis|dependency|MANIFEST.in|Pythonic|pythonic|exportable|empty line|Typing|typing|Typings|typings)/;
