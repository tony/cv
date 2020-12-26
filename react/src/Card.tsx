import React from "react";

import { languagesQuery } from "../../lib/hub";
import type { IActivity, IOrg, LanguageName } from "../../lib/types";
import "./style.scss";

interface IActivityCardProps {
  activity: IActivity;
  org: IOrg;
}

export const LanguageTag: React.FC<{ languageName: LanguageName }> = ({
  languageName,
}) => {
  const language = languagesQuery.getEntity(languageName);
  if (!language || !language.ui) {
    console.groupCollapsed(`${org.name} missing language for ${languageName}`);
    console.table(org);
    console.groupEnd();
  }

  return (
    <div className="tag fr" style={language.ui}>
      {languageName}
    </div>
  );
};

export const ActivityCard: React.FC<IActivityCardProps> = ({
  activity,
  org,
}) => (
  <div className="card">
    <a
      href={org && org.url ? org.url : "#"}
      title={activity.title}
      className="title"
    >
      {activity.title}
    </a>
    {org?.languages?.map((languageName) => (
      <LanguageTag languageName={languageName} key={languageName} />
    ))}
  </div>
);
