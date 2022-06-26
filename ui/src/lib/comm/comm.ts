import { writable } from "svelte/store";
import type { Status } from "../board/board.ts";
import { mockIssues } from "./mockData.ts";
import { columns } from "../board/board.ts";

export type Issue = {
  key: string;
  title: string;
  status: Status;
};

export const issues = writable<Issue[]>(mockIssues);
export const changeCounter = writable(0);

export function moveCard(key: string, statusIndex: number) {
  issues.update((value) => {
    const currentIndex = value.findIndex((issue) => issue.key === key);
    const issue = value[currentIndex];
    const newIndex =
      value
        .map((issue) => issue.status)
        .lastIndexOf(columns[statusIndex].status) + 1;

    const issuesWithout = value.filter((issue) => issue.key !== key);
    return [
      ...issuesWithout.slice(0, newIndex),
      {
        ...issue,
        status: columns[statusIndex].status,
      },
      ...issuesWithout.slice(newIndex),
    ];
  });
}
