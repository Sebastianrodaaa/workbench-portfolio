import { credits } from "../../lib/content";

export function Credits() {
  return (
    <div className="flow">
      <h3>Colophon</h3>
      <p className="eyebrow">How this machine was built</p>
      <div className="rule" />
      <p>
        One glTF diorama, one desktop rendered as real DOM on the monitor, and a
        camera that moves between the two. Every window, bevel, and icon here is
        drawn with CSS and SVG.
      </p>
      <dl className="field">
        {credits.map((credit) => (
          <div style={{ display: "contents" }} key={credit.label}>
            <dt>{credit.label}</dt>
            <dd>{credit.value}</dd>
          </div>
        ))}
      </dl>
      <div className="rule" />
      <p style={{ color: "var(--dim)" }}>
        Textures resized and Meshopt-compressed at build time: 18.1 MB of source
        model ships as 768 KB.
      </p>
    </div>
  );
}
