import { landing, portfolio } from "../../lib/content";
import { OsPanel } from "../chrome/OsInset";

export function About() {
  const { welcome, aboutMe } = portfolio;

  return (
    <div className="about-page">
      <header className="about-hero">
        <h2 className="about-hero__title">{landing.title}</h2>
        <p className="about-hero__subtitle">
          {landing.subtitle.map((item, index) => (
            <span key={item}>
              {index > 0 && <span aria-hidden> · </span>}
              {item}
            </span>
          ))}
        </p>
      </header>

      <OsPanel className="flow about-body">
        <h3>{welcome.greeting}</h3>
        <p>{welcome.intro}</p>
        <p>{welcome.closing}</p>

        <h3>{aboutMe.heading}</h3>
        {aboutMe.blocks.map((block) =>
          block.type === "figure" ? (
            <figure className="portfolio-photo" key={block.text}>
              <img src={block.src} alt={block.alt} loading="lazy" />
              <figcaption>{block.text}</figcaption>
            </figure>
          ) : (
            <p key={block.text.slice(0, 32)}>{block.text}</p>
          ),
        )}
      </OsPanel>
    </div>
  );
}
