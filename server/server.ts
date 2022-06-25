import * as path from "https://deno.land/std@0.145.0/path/mod.ts";
import { readJsonSync } from "https://deno.land/x/jsonfile@1.0.0/mod.ts";
import { Base64 } from "https://deno.land/x/bb64@1.1.0/mod.ts";

type Credentials = {
  JIRA_API_HOST: string;
  JIRA_USERNAME: string;
  JIRA_API_TOKEN: string;
};

type RawIssue = {
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
  };
};

type Issue = {
  key: string;
  summary: string;
  status: string;
};

function getCredentials() {
  const credentialsPath = path.join(
    Deno.env.get("HOME") ?? ".",
    "code",
    "jiraf",
    ".credentials.json"
  );
  return readJsonSync(credentialsPath) as Credentials;
}

async function getMyIssues() {
  const credentials = getCredentials();
  const jql = "assignee=currentuser() AND status != 'Done'";
  const url = `https://${credentials.JIRA_API_HOST}/rest/api/2/search?jql=${jql}&fields=summary,status`;
  const basicAuthString = Base64.fromString(
    `${credentials.JIRA_USERNAME}:${credentials.JIRA_API_TOKEN}`
  );
  const response = await fetch(url, {
    headers: { Authorization: `Basic ${basicAuthString}` },
  });
  const foo = await response.json();
  return foo.issues.map(parse);
}

function parse(rawIssue: RawIssue): Issue {
  return {
    key: rawIssue.key,
    summary: rawIssue.fields.summary,
    status: rawIssue.fields.status.name,
  };
}

function formatIssue({ key, summary, status }: Issue) {
  return `${key} ${summary} (${status})`;
}

async function loadIssues() {
  const issues = await getMyIssues();
  const outputPath = path.join(
    Deno.env.get("HOME") ?? ".",
    ".jiraf",
    ".jiraf-cache"
  );
  await Deno.writeTextFile(outputPath, issues.map(formatIssue).join("\n"));
}

loadIssues();

/*
function handler(_req: Request): Response {
  return new Response("Hello, World!");
}*/

// console.log("Listening on http://localhost:8000");
// serve(handler);
