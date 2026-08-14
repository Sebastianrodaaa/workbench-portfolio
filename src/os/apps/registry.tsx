import type { ComponentType, ReactElement } from "react";
import { profile } from "../../lib/content";
import type { WindowId } from "../../store/useStore";
import { About } from "./About";
import { Work } from "./Work";
import { Notes } from "./Notes";
import { Terminal } from "./Terminal";
import { Contact } from "./Contact";
import { Credits } from "./Credits";
import {
  Computer,
  FileText,
  Folder,
  InfoBubble,
  Mail,
  MsDos,
  Notepad,
} from "@react95/icons";

export type AppDefinition = {
  id: WindowId;
  /** Desktop icon caption. */
  label: string;
  /** Title bar and taskbar caption. */
  title: string;
  icon16: ReactElement;
  icon32: ReactElement;
  width: number;
  height: number;
  /** Open filling the desktop instead of the restore size. */
  openMaximized?: boolean;
  component: ComponentType;
};

export type DesktopShortcut = {
  id: string;
  label: string;
  icon16: ReactElement;
  icon32: ReactElement;
  url: string;
  filename: string;
};

export const DESKTOP_SHORTCUTS: DesktopShortcut[] = [
  {
    id: "resume",
    label: "Resume.pdf",
    icon16: <FileText variant="16x16_4" />,
    icon32: <FileText variant="32x32_4" />,
    url: profile.resume.url,
    filename: profile.resume.filename,
  },
];

export const APPS: Record<WindowId, AppDefinition> = {
  about: {
    id: "about",
    label: "About Me",
    title: "About Me — Sebastian Roda",
    icon16: <Computer variant="16x16_4" />,
    icon32: <Computer variant="32x32_4" />,
    width: 620,
    height: 680,
    component: About,
  },
  work: {
    id: "work",
    label: "Experience",
    title: "Experience",
    icon16: <Folder variant="16x16_4" />,
    icon32: <Folder variant="32x32_4" />,
    width: 690,
    height: 486,
    component: Work,
  },
  notes: {
    id: "notes",
    label: "Projects",
    title: "Projects",
    icon16: <Notepad variant="16x16_4" />,
    icon32: <Notepad variant="32x32_4" />,
    width: 920,
    height: 720,
    openMaximized: true,
    component: Notes,
  },
  terminal: {
    id: "terminal",
    label: "MS-DOS Prompt",
    title: "MS-DOS Prompt",
    icon16: <MsDos variant="16x16_32" />,
    icon32: <MsDos variant="32x32_32" />,
    width: 590,
    height: 384,
    component: Terminal,
  },
  contact: {
    id: "contact",
    label: "Contact",
    title: "Contact",
    icon16: <Mail variant="16x16_4" />,
    icon32: <Mail variant="32x32_4" />,
    width: 486,
    height: 322,
    component: Contact,
  },
  credits: {
    id: "credits",
    label: "Colophon",
    title: "Colophon",
    icon16: <InfoBubble variant="32x32_4" />,
    icon32: <InfoBubble variant="32x32_4" />,
    width: 500,
    height: 355,
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
