import { useEffect, useRef } from "react";
import { projects } from "../../lib/content";
import { OsInset, OsPanel } from "../chrome/OsInset";
import { APPS } from "./registry";

function ProjectDemo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.loop = true;
    const play = () => {
      void video.play().catch(() => {});
    };
    play();
    video.addEventListener("canplay", play);
    video.addEventListener("loadeddata", play);
    return () => {
      video.removeEventListener("canplay", play);
      video.removeEventListener("loadeddata", play);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className="project-demo"
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      controls={false}
      controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
      onContextMenu={(event) => event.preventDefault()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void event.currentTarget.play();
      }}
    />
  );
}

export function Notes() {
  return (
    <>
      <OsPanel className="projects">
        {projects.map((project, index) => (
          <article className="project" key={project.id}>
            <h3>{project.title}</h3>
            <p className="eyebrow">{project.event}</p>
            {project.demoVideo && <ProjectDemo src={project.demoVideo} />}
            <p>
              <a href={project.url} target="_blank" rel="noreferrer">
                {project.url.replace(/^https:\/\//, "")}
              </a>
            </p>
            <p>{project.body}</p>
            {index < projects.length - 1 && <div className="rule" />}
          </article>
        ))}
      </OsPanel>

      <div className="status-bar">
        <OsInset as="span" className="status-chip">
          {projects.length} object(s) · {APPS.notes.label}
        </OsInset>
      </div>
    </>
  );
}
