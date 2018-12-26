import { CVActivity, CVActivityType } from "./types";

const notTypoFixes = (activity: CVActivity) =>
  !activity.title.match(
    /(typo|Typo|spelling|Spelling|note|Note|correct|Correct|Fix type|Fix URL|print statement|Remove duplicate)/
  );
const notDocImprovements = (activity: CVActivity) =>
  !activity.title.match(
    /(doc|Doc|license|LICENSE|README|readme|link|Link|\.md|instructions|Instructions|guidelines|pypi badge|AUTHORS|License|changelog|label|copyright|add cookiecutter|issue template|awesome-|front-end frameworks|Examples for issue)|to other tools|sphinx/
  );
const notCodeStyleTweaks = (activity: CVActivity) =>
  !activity.title.match(
    /(indent|Indent|whitespace|spacing|lint|Lint|sort|Sort|jshint|PEP|pep8|tabs|Tabs|Ignore|ignore|__about__|import|tweak|Tweak|hash|modernize|Add.*module|trivial|travis|Travis|dependency|MANIFEST.in|Pythonic|pythonic)/
  );
const onlyMerged = (activity: CVActivity) =>
  "accepted_date" in activity && activity.accepted_date
    ? activity.accepted_date
    : true;

export const filterMap: {
  [filterName: string]: (arg0: CVActivity) => boolean | string;
} = {
  "Hide Spelling Contributions": notTypoFixes,
  "Hide Documentation Contributions": notDocImprovements,
  "Hide Code Style Contributions": notCodeStyleTweaks,
  "Hide Unmerged Contributions": onlyMerged
};

export const availableActivityTypes = (
  activities: Array<CVActivity>,
  activityTypeMap: CVActivityType[]
) => {
  return activityTypeMap.filter(activityType =>
    Object.values(activities).find(
      activity => activity.component_name === activityType.component_name
    )
  );
};
