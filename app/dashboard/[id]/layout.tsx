"use client";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <DndProvider options={HTML5toTouch}>{children}</DndProvider>;
}
