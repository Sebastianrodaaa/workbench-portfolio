import { profile } from "../../lib/content";

export function Contact() {
  return (
    <div className="flow">
      <h3>Get in touch</h3>
      <p className="eyebrow">{profile.location}</p>
      <div className="rule" />
      <p>
        Email is the fastest way to reach me. I read everything and answer
        anything that isn&apos;t a template.
      </p>
      <ul className="link-list">
        <li>
          <a href={`mailto:${profile.email}`}>
            <span>Email</span>
            <span>{profile.email}</span>
          </a>
        </li>
        <li>
          <a href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}>
            <span>Phone</span>
            <span>{profile.phone}</span>
          </a>
        </li>
        {profile.links.map((link) => (
          <li key={link.label}>
            <a href={link.href} target="_blank" rel="noreferrer">
              <span>{link.label}</span>
              <span>{link.display}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
