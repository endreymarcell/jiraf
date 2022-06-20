import JiraClient from "jira-client";

const jira = new JiraClient({
  protocol: "https",
  host: process.env.JIRA_API_HOST,
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_TOKEN,
  apiVersion: "2",
  strictSSL: true,
});

const foo = await jira.searchJira(`assignee=currentuser()`, {  fields: ['summary', 'status'] })
console.log(JSON.stringify(foo.issues.map(issue => ({
  key: issue.key,
  summary: issue.fields.summary,
  status: issue.fields.status.name,
})), null, 2));
