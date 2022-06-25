export type Status = "backlog" | "todo" | "wip" | "review" | "ready" | "done";

type ColumnMeta = {
  status: Status;
  title: string;
  headingColor: string;
};

export const columns: ColumnMeta[] = [
  {
    status: "todo",
    title: "To do",
    headingColor: "red-500",
  },
  {
    status: "wip",
    title: "In progress",
    headingColor: "blue-100",
  },
  {
    status: "review",
    title: "In review",
    headingColor: "slate-100",
  },
  {
    status: "ready",
    title: "Ready to release",
    headingColor: "fuchsia-100",
  },
];
