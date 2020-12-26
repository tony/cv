import React from "react";

import { languagesQuery } from "../../lib/hub";
import type { IActivity, IOrg } from "../../lib/types";
import "./style.scss";

interface IActivityCardProps {
  activity: IActivity;
  org: IOrg;
}

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
    {org &&
      org.languages &&
      org.languages.map((languageName, idx) => {
        const language = languagesQuery.getEntity(languageName);
        if (!language || !language.ui) {
          console.groupCollapsed(
            `${org.name} missing language for ${languageName}`
          );
          console.table(org);
          console.groupEnd();
        }

        return (
          <div key={idx} className="tag fr" style={language.ui}>
            {languageName}
          </div>
        );
      })}
  </div>
);
