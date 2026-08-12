import type { ComponentType, ReactNode } from "react";
import type { WindowId } from "../../store/useStore";
import { About } from "./About";
import { Work } from "./Work";
import { Notes } from "./Notes";
import { Terminal } from "./Terminal";
import { Contact } from "./Contact";
import { Credits } from "./Credits";

export type AppDefinition = {
  id: WindowId;
  /** Desktop icon caption. */
  label: string;
  /** Title bar and taskbar caption. */
  title: string;
  icon: ReactNode;
  width: number;
  height: number;
  component: ComponentType;
};

/*
 * Icons are drawn as flat rectangles on a 32x32 grid so they stay crisp at
 * icon, title bar, and taskbar sizes.
 */

const IconComputer = (
  <svg viewBox="0 0 32 32" aria-hidden>
    <rect x="3" y="4" width="26" height="19" fill="#c0c0c0" />
    <rect x="3" y="4" width="26" height="1" fill="#ffffff" />
    <rect x="3" y="4" width="1" height="19" fill="#ffffff" />
    <rect x="28" y="4" width="1" height="19" fill="#404040" />
    <rect x="3" y="22" width="26" height="1" fill="#404040" />
    <rect x="5" y="6" width="22" height="14" fill="#008080" />
    <rect x="6" y="7" width="20" height="1" fill="#00a0a0" />
    <rect x="7" y="10" width="9" height="1" fill="#ffffff" />
    <rect x="7" y="13" width="13" height="1" fill="#c0e8e8" />
    <rect x="7" y="16" width="6" height="1" fill="#c0e8e8" />
    <rect x="11" y="23" width="10" height="3" fill="#a0a0a0" />
    <rect x="7" y="26" width="18" height="3" fill="#c0c0c0" />
    <rect x="7" y="26" width="18" height="1" fill="#ffffff" />
    <rect x="7" y="28" width="18" height="1" fill="#404040" />
    <rect x="20" y="27" width="4" height="1" fill="#008000" />
  </svg>
);

const IconFolder = (
  <svg viewBox="0 0 32 32" aria-hidden>
    <rect x="3" y="7" width="11" height="3" fill="#e0b000" />
    <rect x="3" y="9" width="26" height="17" fill="#ffd040" />
    <rect x="3" y="9" width="26" height="1" fill="#ffe890" />
    <rect x="3" y="9" width="1" height="17" fill="#ffe890" />
    <rect x="28" y="10" width="1" height="16" fill="#a07000" />
    <rect x="3" y="25" width="26" height="1" fill="#a07000" />
    <rect x="6" y="13" width="17" height="1" fill="#e0b000" />
    <rect x="6" y="16" width="20" height="1" fill="#e0b000" />
    <rect x="6" y="19" width="14" height="1" fill="#e0b000" />
  </svg>
);

const IconNotepad = (
  <svg viewBox="0 0 32 32" aria-hidden>
    <rect x="6" y="3" width="20" height="26" fill="#ffffff" />
    <rect x="6" y="3" width="20" height="1" fill="#c0c0c0" />
    <rect x="6" y="3" width="1" height="26" fill="#c0c0c0" />
    <rect x="25" y="3" width="1" height="26" fill="#808080" />
    <rect x="6" y="28" width="20" height="1" fill="#808080" />
    <rect x="6" y="3" width="20" height="4" fill="#000080" />
    <rect x="8" y="4" width="9" height="2" fill="#ffffff" />
    <rect x="9" y="11" width="14" height="1" fill="#000080" />
    <rect x="9" y="14" width="14" height="1" fill="#808080" />
    <rect x="9" y="17" width="14" height="1" fill="#808080" />
    <rect x="9" y="20" width="10" height="1" fill="#808080" />
    <rect x="9" y="23" width="12" height="1" fill="#808080" />
  </svg>
);

const IconDos = (
  <svg viewBox="0 0 32 32" aria-hidden>
    <rect x="3" y="5" width="26" height="22" fill="#c0c0c0" />
    <rect x="3" y="5" width="26" height="1" fill="#ffffff" />
    <rect x="3" y="5" width="1" height="22" fill="#ffffff" />
    <rect x="28" y="5" width="1" height="22" fill="#404040" />
    <rect x="3" y="26" width="26" height="1" fill="#404040" />
    <rect x="5" y="7" width="22" height="18" fill="#000000" />
    <rect x="7" y="10" width="2" height="1" fill="#ffffff" />
    <rect x="9" y="10" width="1" height="1" fill="#ffffff" />
    <rect x="11" y="10" width="4" height="1" fill="#ffffff" />
    <rect x="7" y="13" width="8" height="1" fill="#c0c0c0" />
    <rect x="7" y="16" width="5" height="1" fill="#c0c0c0" />
    <rect x="7" y="19" width="6" height="2" fill="#ffffff" />
  </svg>
);

const IconMail = (
  <svg viewBox="0 0 32 32" aria-hidden>
    <rect x="3" y="8" width="26" height="17" fill="#ffffff" />
    <rect x="3" y="8" width="26" height="1" fill="#c0c0c0" />
    <rect x="28" y="8" width="1" height="17" fill="#808080" />
    <rect x="3" y="24" width="26" height="1" fill="#808080" />
    <rect x="3" y="8" width="1" height="17" fill="#c0c0c0" />
    <rect x="5" y="10" width="22" height="2" fill="#e0e0e0" />
    <rect x="6" y="12" width="20" height="2" fill="#c0c0c0" />
    <rect x="8" y="14" width="16" height="2" fill="#a0a0a0" />
    <rect x="11" y="16" width="10" height="1" fill="#808080" />
    <rect x="6" y="19" width="12" height="1" fill="#000080" />
    <rect x="6" y="21" width="8" height="1" fill="#808080" />
  </svg>
);

const IconInfo = (
  <svg viewBox="0 0 32 32" aria-hidden>
    <rect x="10" y="4" width="12" height="24" fill="#ffffff" />
    <rect x="6" y="8" width="20" height="16" fill="#ffffff" />
    <rect x="11" y="5" width="10" height="22" fill="#0a5fd0" />
    <rect x="7" y="9" width="18" height="14" fill="#0a5fd0" />
    <rect x="14" y="9" width="4" height="4" fill="#ffffff" />
    <rect x="14" y="15" width="4" height="8" fill="#ffffff" />
    <rect x="12" y="21" width="8" height="2" fill="#ffffff" />
  </svg>
);

export const APPS: Record<WindowId, AppDefinition> = {
  about: {
    id: "about",
    label: "My Computer",
    title: "Sebastian Roda — Properties",
    icon: IconComputer,
    width: 430,
    height: 340,
    component: About,
  },
  work: {
    id: "work",
    label: "Experience",
    title: "Experience",
    icon: IconFolder,
    width: 540,
    height: 380,
    component: Work,
  },
  notes: {
    id: "notes",
    label: "README.TXT",
    title: "README.TXT — Notepad",
    icon: IconNotepad,
    width: 430,
    height: 330,
    component: Notes,
  },
  terminal: {
    id: "terminal",
    label: "MS-DOS Prompt",
    title: "MS-DOS Prompt",
    icon: IconDos,
    width: 460,
    height: 300,
    component: Terminal,
  },
  contact: {
    id: "contact",
    label: "Contact",
    title: "Contact",
    icon: IconMail,
    width: 380,
    height: 252,
    component: Contact,
  },
  credits: {
    id: "credits",
    label: "Colophon",
    title: "Colophon",
    icon: IconInfo,
    width: 390,
    height: 278,
    component: Credits,
  },
};

export const DESKTOP_ORDER: WindowId[] = [
  "about",
  "work",
  "notes",
  "terminal",
  "contact",
  "credits",
];
