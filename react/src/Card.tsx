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
      org.languages.map((language, idx) => (
        <div
          key={idx}
          className="tag fr"
          style={{
            backgroundColor: languagesQuery.getEntity(language)?.color,
            color: languagesQuery.getEntity(language)?.textColor,
          }}
        >
          {language}
        </div>
      ))}
  </div>
);
