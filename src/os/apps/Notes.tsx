import { readme } from "../../lib/content";

export function Notes() {
  return (
    <>
      <div className="notepad">
        {readme.sections.map((section) => (
          <div key={section.heading}>
            <h4>{section.heading}</h4>
            <p>{section.body}</p>
          </div>
        ))}
        <blockquote>{readme.quote}</blockquote>
      </div>

      <div className="status-bar">
        <span>{readme.filename}</span>
        <span>Ln 1, Col 1</span>
      </div>
    </>
  );
}
