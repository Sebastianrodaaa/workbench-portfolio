import { useEffect, useRef, useState } from "react";
import {
  about,
  education,
  experience,
  profile,
  readme,
  skills,
} from "../../lib/content";
import { useStore, type WindowId } from "../../store/useStore";
import { keypress } from "../../lib/audio";

type Line = { text: string; kind?: "echo" | "err" };

const PROMPT = "C:\\WORKBENCH>";

const BANNER: Line[] = [
  { text: "Workbench(R) DOS  Version 6.22" },
  { text: "(C) Copyright Roda Ventures LLC 1995-2026." },
  { text: "" },
  { text: "Type HELP for a list of commands." },
  { text: "" },
];

const FILES: Record<string, () => string> = {
  "readme.txt": () =>
    [
      ...readme.sections.map((s) => `${s.heading}\n${s.body}`),
      `"${readme.quote}"`,
    ].join("\n\n"),
  "about.txt": () => about.paragraphs.join("\n\n"),
  "contact.txt": () =>
    [
      `NAME     ${profile.name}`,
      `ROLE     ${profile.role}`,
      `EMAIL    ${profile.email}`,
      `PHONE    ${profile.phone}`,
      `WHERE    ${profile.location}`,
      ...profile.links.map(
        (link) => `${link.label.toUpperCase().padEnd(8)} ${link.display}`,
      ),
    ].join("\n"),
  "experience.txt": () =>
    experience
      .map((role) => `${role.period}\n${role.company} — ${role.title}`)
      .join("\n\n"),
  "education.txt": () =>
    education
      .map((entry) => `${entry.period}\n${entry.credential}\n${entry.school}`)
      .join("\n\n"),
  "skills.txt": () =>
    skills.map((g) => `${g.group}:\n  ${g.items.join(", ")}`).join("\n\n"),
};

const APP_NAMES: WindowId[] = [
  "about",
  "work",
  "notes",
  "terminal",
  "contact",
  "credits",
];

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const openWindow = useStore((state) => state.openWindow);
  const setStage = useStore((state) => state.setStage);
  const toggleLamp = useStore((state) => state.toggleLamp);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines]);

  const print = (...next: Line[]) => setLines((prev) => [...prev, ...next]);

  const run = (raw: string) => {
    const input = raw.trim();
    print({ text: `${PROMPT}${raw}`, kind: "echo" });
    if (!input) {
      print({ text: "" });
      return;
    }

    setHistory((prev) => [input, ...prev].slice(0, 40));
    setHistoryIndex(-1);

    const [command, ...args] = input.split(/\s+/);
    const argument = args.join(" ").toLowerCase();

    switch (command.toUpperCase()) {
      case "HELP":
      case "?":
        print(
          { text: "DIR              List the files on this drive." },
          { text: "TYPE <file>      Print a file to the screen." },
          { text: "START <app>      Open a program window." },
          { text: "WHOAMI           Short bio." },
          { text: "VER              Version information." },
          { text: "DATE             Current date and time." },
          { text: "LAMP             Toggle the workshop light." },
          { text: "CLS              Clear the screen." },
          { text: "EXIT             Step away from the desk." },
          { text: "" },
        );
        break;

      case "DIR": {
        const names = Object.keys(FILES);
        print(
          { text: " Volume in drive C is WORKBENCH" },
          { text: " Directory of C:\\WORKBENCH" },
          { text: "" },
          ...names.map((name) => {
            const [base, ext] = name.split(".");
            const size = FILES[name]().length;
            return {
              text: `${base.toUpperCase().padEnd(12)} ${ext.toUpperCase()}   ${String(
                size,
              ).padStart(6)}  01-01-96`,
            };
          }),
          { text: `        ${names.length} file(s)` },
          { text: "" },
        );
        break;
      }

      case "TYPE":
      case "CAT": {
        const file = FILES[argument];
        if (!file) {
          print({ text: "File not found", kind: "err" }, { text: "" });
          break;
        }
        print({ text: file() }, { text: "" });
        break;
      }

      case "START":
      case "OPEN": {
        const target = argument as WindowId;
        if (!APP_NAMES.includes(target)) {
          print(
            { text: `Cannot find the program '${argument || "?"}'.`, kind: "err" },
            { text: `Try: ${APP_NAMES.join(", ")}` },
            { text: "" },
          );
          break;
        }
        openWindow(target);
        print({ text: `Starting ${target}...` }, { text: "" });
        break;
      }

      case "WHOAMI":
        print(
          { text: `${profile.name} — ${profile.role}` },
          { text: profile.tagline },
          { text: "" },
        );
        break;

      case "VER":
        print(
          { text: "Workbench(R) DOS  Version 6.22" },
          { text: "Windows 95 tribute, rendered in DOM on a CRT." },
          { text: "" },
        );
        break;

      case "LAMP":
        toggleLamp();
        print({ text: "Click." }, { text: "" });
        break;

      case "DATE":
      case "TIME":
        print({ text: new Date().toString() }, { text: "" });
        break;

      case "CLS":
      case "CLEAR":
        setLines([]);
        break;

      case "EXIT":
      case "DESK":
        print({ text: "Pushing the chair back..." });
        setTimeout(() => setStage("desk"), 320);
        break;

      case "SUDO":
        print(
          { text: "Bad command or file name", kind: "err" },
          { text: "This is 1995. Just double-click things." },
          { text: "" },
        );
        break;

      case "ECHO":
        print({ text: args.join(" ") }, { text: "" });
        break;

      default:
        print({ text: "Bad command or file name", kind: "err" }, { text: "" });
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-log" ref={logRef}>
        {lines.map((line, index) => (
          <div key={index} className={line.kind}>
            {line.text || "\u00a0"}
          </div>
        ))}
      </div>
      <div className="terminal-input">
        <span>{PROMPT}</span>
        <input
          ref={inputRef}
          value={value}
          spellCheck={false}
          autoComplete="off"
          aria-label="MS-DOS prompt"
          onChange={(event) => {
            keypress();
            setValue(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              run(value);
              setValue("");
              return;
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              const next = Math.min(historyIndex + 1, history.length - 1);
              if (next >= 0) {
                setHistoryIndex(next);
                setValue(history[next]);
              }
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              const next = historyIndex - 1;
              setHistoryIndex(next);
              setValue(next >= 0 ? history[next] : "");
            }
          }}
        />
      </div>
    </div>
  );
}
