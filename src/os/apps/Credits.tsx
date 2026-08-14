import { credits } from "../../lib/content";
import { OsInset, OsPanel } from "../chrome/OsInset";

export function Credits() {
  return (
    <OsPanel className="flow">
      <h3>Colophon</h3>
      <p className="eyebrow">How this machine was built</p>
      <fieldset className="henry-fieldset">
        <legend>Stack</legend>
        <p>
          One glTF diorama, one desktop rendered as real DOM on the monitor, and a
          camera that moves between the two.
        </p>
        <dl className="field">
          {credits.map((credit) => (
            <div style={{ display: "contents" }} key={credit.label}>
              <dt>{credit.label}</dt>
              <dd>{credit.value}</dd>
            </div>
          ))}
        </dl>
      </fieldset>
      <OsInset className="credits-note">
        Textures resized and Meshopt-compressed at build time: 18.1 MB of source
        model ships as 768 KB.
      </OsInset>
    </OsPanel>
  );
}
