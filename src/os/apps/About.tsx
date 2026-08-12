import { useState } from "react";
import { about, education, hackathons, profile, skills } from "../../lib/content";

const TABS = ["General", "Education", "Hackathons", "Skills"] as const;
type Tab = (typeof TABS)[number];

export function About() {
  const [tab, setTab] = useState<Tab>("General");

  return (
    <>
      <div className="tabs" role="tablist">
        {TABS.map((name) => (
          <button
            type="button"
            key={name}
            role="tab"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {tab === "General" && (
          <>
            <h3>{about.heading}</h3>
            <p className="eyebrow">{profile.role}</p>
            <div className="rule" />
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            <div className="rule" />
            <dl className="field">
              {about.facts.map((fact) => (
                <div style={{ display: "contents" }} key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        {tab === "Education" && (
          <>
            {education.map((entry) => (
              <fieldset className="group" key={entry.id}>
                <legend>{entry.period}</legend>
                <h4>{entry.credential}</h4>
                <p>
                  {entry.school}
                  <br />
                  {entry.place}
                </p>
              </fieldset>
            ))}
          </>
        )}

        {tab === "Hackathons" && (
          <>
            {hackathons.map((win) => (
              <fieldset className="group" key={win.id}>
                <legend>{win.location}</legend>
                <h4>{win.place}</h4>
                {win.awards && win.awards.length > 0 && (
                  <p className="eyebrow">{win.awards.join(" · ")}</p>
                )}
                <p>{win.event}</p>
              </fieldset>
            ))}
          </>
        )}

        {tab === "Skills" && (
          <>
            {skills.map((group) => (
              <fieldset className="group" key={group.group}>
                <legend>{group.group}</legend>
                <div className="tag-row" style={{ marginTop: 0 }}>
                  {group.items.map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </fieldset>
            ))}
          </>
        )}
      </div>
    </>
  );
}
