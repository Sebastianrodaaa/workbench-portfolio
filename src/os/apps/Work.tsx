import { useState } from "react";
import { experience } from "../../lib/content";
import { OsInset } from "../chrome/OsInset";
import { APPS } from "./registry";

export function Work() {
  const [activeId, setActiveId] = useState(experience[0].id);
  const active = experience.find((role) => role.id === activeId) ?? experience[0];

  return (
    <>
      <div className="work">
        <OsInset as="ul" className="work-list">
          {experience.map((role) => (
            <li key={role.id}>
              <button
                type="button"
                aria-current={role.id === activeId}
                onClick={() => setActiveId(role.id)}
              >
                <strong>{role.company}</strong>
                <small>{role.period.split(" — ")[0]}</small>
              </button>
            </li>
          ))}
        </OsInset>

        <article className="os-panel work-detail">
          <h3>{active.company}</h3>
          <p className="eyebrow">
            {active.title}
            {active.meta ? ` · ${active.meta}` : ""}
          </p>
          <p className="eyebrow">{active.period}</p>
          <div className="rule" />
          <p>{active.summary}</p>
          <ul>
            {active.bullets.map((bullet) => (
              <li key={bullet.slice(0, 32)}>{bullet}</li>
            ))}
          </ul>
          <div className="tag-row">
            {active.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          {active.href && (
            <p style={{ marginTop: 10 }}>
              <a href={active.href} target="_blank" rel="noreferrer">
                Open in App Store
              </a>
            </p>
          )}
        </article>
      </div>

      <div className="status-bar">
        <OsInset as="span" className="status-chip">
          {experience.length} object(s) · {APPS.work.label}
        </OsInset>
        <OsInset as="span" className="status-chip">
          {active.company}
        </OsInset>
      </div>
    </>
  );
}
