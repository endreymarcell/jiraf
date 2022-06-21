import JiraClient from "jira-client";

const jira = new JiraClient({
  protocol: "https",
  host: process.env.JIRA_API_HOST,
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_TOKEN,
  apiVersion: "2",
  strictSSL: true,
});

async function getMyIssues() {
  const rawIssues = await jira.searchJira(`assignee=currentuser() AND status != 'Done'`, {fields: ['summary', 'status']})
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
