import * as path from "https://deno.land/std@0.145.0/path/mod.ts";
import { readJsonSync } from "https://deno.land/x/jsonfile@1.0.0/mod.ts";
import { Base64 } from "https://deno.land/x/bb64@1.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.119.0/http/server.ts";
import home_dir from "https://deno.land/x/dir@v1.0.0/home_dir/mod.ts";

let cache = "";

const controller = new AbortController();
const signal = controller.signal;

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
    home_dir() ?? ".",
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
  console.log("Deno go fetch...");
  const issues = await getMyIssues();
  cache = issues.map(formatIssue).join("\n");
  const outputPath = path.join(home_dir() ?? ".", ".jiraf", ".jiraf-cache");
  await Deno.writeTextFile(outputPath, issues.map(formatIssue).join("\n"));
  console.log("Deno done good.");
}

async function handler(request: Request): Promise<Response> {
  if (request.method === "GET" && request.url.endsWith("/issues")) {
    return new Response(cache);
  }

  if (request.method === "POST" && request.url.endsWith("/refresh")) {
    console.log("Refreshing...");
    await loadIssues();
    return new Response("Done.");
  }

  if (request.method === "POST" && request.url.endsWith("/stop")) {
    console.log("Stopping the server.");
    controller.abort();
    return new Response("Stopping.");
  }

  return new Response("OK");
}

const port = 6008;
console.log(`Listening on http://localhost:${port}\nPress Ctrl-C to quit`);
serve(handler, { port, signal });
loadIssues();

const MINUTE = 60_000;
const AUTO_REFRESH_INTERVAL = 10 * MINUTE;
const refreshInterval = setInterval(loadIssues, AUTO_REFRESH_INTERVAL);
signal.addEventListener("abort", () => clearInterval(refreshInterval));
