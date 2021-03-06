const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {exec} = require("child_process");
const {errorMessages} = require("../utils/messages");

const axios = require("axios");

const {JIRAF_HOME_FOLDER, GITHUB_URL_BASE, PULL_REQUEST_TEMPLATE} = require("../const");
const {readActiveCardKey, readFromConfig} = require("../utils/storageHandler");
const {interpolate, readGithubCredentials, print, die} = require("../utils/utils");

const branchCommand = ({branchName}) => {
    const cardKey = readActiveCardKey();
    if (!cardKey) {
        throw Error(errorMessages.noCardSet);
    }
    if (!branchName) {
        throw Error(errorMessages.missingArgument("branchname"));
    }

    exec(`git checkout -b ${cardKey}-${branchName}`, error => {
        if (error) {
            die(errorMessages.cannotCreateBranch(error.message.split("\n").join(". ")));
        }
    });
};

const prCommand = () => {
    const cardKey = readActiveCardKey();
    if (!cardKey) {
        throw Error(errorMessages.noCardSet);
    }
    exec("git ls-remote --get-url origin", (error, stdout) => {
        const {owner, repo} = getRepoCoordinates(stdout);
        exec("git rev-parse --abbrev-ref HEAD", (error, stdout) => {
            if (error) {
                die(error.message);
                return;
            }
            const branchName = stdout.trim();
            exec(`git push --set-upstream origin ${branchName}`, error => {
                if (error) {
                    die(error.message);
                }
                editDescriptionAndCreatePullRequest({owner, repo, branchName});
            });
        });
    });
};

const editDescriptionAndCreatePullRequest = ({owner, repo, branchName}) => {
    const editor = readFromConfig("editor");
    const descriptionFileName = path.join(
        JIRAF_HOME_FOLDER,
        `pullrequest.${crypto.randomBytes(20).toString("hex")}.md`
    );
    const preparedTemplate = interpolate(PULL_REQUEST_TEMPLATE, {
        key: readActiveCardKey(),
        jiraUrlBase: readFromConfig("jiraUrlBase"),
    });
    fs.writeFileSync(descriptionFileName, preparedTemplate);
    const childProcess = exec(`${editor} ${descriptionFileName}`);
    childProcess.on("close", () => createPullRequest({owner, repo, branchName, descriptionFileName}));
};

const createPullRequest = ({owner, repo, branchName, descriptionFileName}) => {
    const {GITHUB_USERNAME, GITHUB_API_TOKEN} = readGithubCredentials();
    // allow overwriting the github url base for testing
    const githubUrlBase = process.env["GITHUB_URL_BASE"] || GITHUB_URL_BASE;
    const description = fs.readFileSync(descriptionFileName).toString();
    const descriptionLines = description.split(/\r?\n/);
    const title = descriptionLines[0];
    const body = descriptionLines.slice(1, descriptionLines.length - 1).join("\n");
    axios({
        method: "post",
        url: `${githubUrlBase}/repos/${owner}/${repo}/pulls`,
        auth: {
            username: GITHUB_USERNAME,
            password: GITHUB_API_TOKEN,
        },
        data: {
            title: title,
            head: branchName,
            base: "master",
            body: body,
        },
    })
        .then(response => print(response.data.html_url))
        .catch(error => die(errorMessages.cannotCreatePR(error.message)))
        .finally(() => fs.unlink(descriptionFileName, () => {}));
};

const getRepoCoordinates = remote => {
    const [owner, repo] = remote
        .trim()
        .replace("https://github.com/", "")
        .replace("ssh://git@github.com/", "")
        .replace("git@github.com:", "")
        .replace(".git", "")
        .split("/");
    return {owner, repo};
};

module.exports = {
    branchCommand,
    prCommand,
};
