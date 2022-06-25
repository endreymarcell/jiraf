import { writable } from "svelte/store";
import type { Status } from "../board/board.ts";
import { mockIssues } from "./mockData.ts";

export type Issue = {
  key: string;
  title: string;
  status: Status;
};

export const issues = writable<Issue[]>(mockIssues);
