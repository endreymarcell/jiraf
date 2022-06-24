import * as path from "path";
import {fileURLToPath} from 'url';
import JiraClient from "jira-client";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

function getJiraClient() {
  const {JIRA_API_HOST, JIRA_USERNAME, JIRA_API_TOKEN} = getCredentialsFromEnv();
  return new JiraClient({
    protocol: "https",
    host: JIRA_API_HOST,
    username: JIRA_USERNAME,
    password: JIRA_API_TOKEN,
    apiVersion: "2",
    strictSSL: true,
  });
}

function getCredentialsFromEnv() {
  const vars = [
    "JIRA_API_HOST",
    "JIRA_USERNAME",
    "JIRA_API_TOKEN",
  ]
  for (const envVar of vars) {
    if (process.env[envVar] === undefined) {
      console.error(`${envVar} is undefined!`)
      process.exit(1)
    }
  }
  return Object.fromEntries(vars.map(varName => [varName, process.env[varName]]))
}

async function getMyIssues() {
  const query = `assignee=currentuser() AND status != 'Done'`;
  const options = {fields: ['summary', 'status']}
  const rawIssues = await getJiraClient().searchJira(query, options)
  return rawIssues.issues.map(parseIssue)
}

function parseIssue(issue) {
  return {
    key: issue.key,
    summary: issue.fields.summary,
    status: issue.fields.status.name,
  }
}

function formatIssue({ key, summary, status }) {
  return `${key} ${summary} (${status})`
}

const myIssues = await getMyIssues()
console.log(myIssues.map(formatIssue).join('\n'));
