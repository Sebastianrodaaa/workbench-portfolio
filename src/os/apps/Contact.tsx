import { profile } from "../../lib/content";
import { OsButton } from "../chrome/OsButton";
import { OsPanel } from "../chrome/OsInset";

export function Contact() {
  return (
    <OsPanel className="flow">
      <h3>Get in touch</h3>
      <p className="eyebrow">{profile.location}</p>
      <fieldset className="henry-fieldset">
        <legend>Contact information</legend>
        <p>
          Email is the fastest way to reach me. I read everything and answer
          anything that isn&apos;t a template.
        </p>
        <div className="link-list">
          <OsButton
            className="link-button"
            onClick={() => {
              window.location.href = `mailto:${profile.email}`;
            }}
          >
            Email
            <span>{profile.email}</span>
          </OsButton>
          <OsButton
            className="link-button"
            onClick={() => {
              window.location.href = `tel:${profile.phone.replace(/[^\d+]/g, "")}`;
            }}
          >
            Phone
            <span>{profile.phone}</span>
          </OsButton>
          {profile.links.map((link) => (
            <OsButton
              key={link.label}
              className="link-button"
              onClick={() => window.open(link.href, "_blank", "noopener,noreferrer")}
            >
              {link.label}
              <span>{link.display}</span>
            </OsButton>
          ))}
        </div>
      </fieldset>
    </OsPanel>
  );
}
