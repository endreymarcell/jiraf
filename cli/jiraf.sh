#!/usr/bin/env bash
set -eo pipefail

jiraf_home=$HOME/.jiraf
jiraf_ticket_file=$jiraf_home/.jiraf-issue
jiraf_pr_body=$jiraf_home/.pr-body


issue_url_root="https://transferwise.atlassian.net/browse/"

function load_issues() {
  curl --silent "$1/issues"
}

function reload_issues() {
  echo Updating cache...
  curl --silent -XPOST "$1/refresh"
}

function prepare_pr_body() {
  local template=$PWD/.github/pull_request_template.md
  if [[ ! -f $template ]]; then
    echo "Error: Cannot find PR template file at $template"
    exit 1
  fi

  local local_current_issue_id="$1"

  head -1 $template > $jiraf_pr_body
  echo "${issue_url_root}${local_current_issue_id}" >> $jiraf_pr_body
  tail -n +2 $template | sed 's/\[ \]/[x]/' >> $jiraf_pr_body
}

function print_help() {
  cat <<EOF
--- JIRAF ---
Manage Jira issues easily.

Startup:
  jiraf start - start the server

Viewing issues:
  jiraf refresh - load issues from Jira (shortcut: r)
  jiraf list - list my issues (shortcut: ls)

Picking issues:
  jiraf set {id} - set the given id as the current issue
  jiraf unset - remove issue id if set
  jiraf pick - choose issue interactively

Using git:
  jiraf branch {name} - create git branch prefixed with the current issue id
  jiraf pr {title} - open a github pull request
EOF
}

case $1 in
  start)
    deno run \
      --allow-net \
      --allow-read \
      --allow-write \
      --allow-env \
      $HOME/code/jiraf/server/server.ts
    ;;

  set)
    if [[ "$2" == "" ]]; then
      echo "Error: Missing ticket id"
      echo "Usage: jiraf set JIRA-123"
      exit 1
    fi
    echo "$2" > $jiraf_ticket_file
    exit 0
    ;;

  unset)
    echo "" > $jiraf_ticket_file
    ;;

  r*)
    jiraf_server_port="$(lsof -i -n -P | grep LISTEN | grep deno | awk '{print $(NF-1)}' | tr -d '*' | xargs)"
    jiraf_server_uri="localhost${jiraf_server_port}"
    reload_issues $jiraf_server_uri
    ;;

  l*s*)
    jiraf_server_port="$(lsof -i -n -P | grep LISTEN | grep deno | awk '{print $(NF-1)}' | tr -d '*' | xargs)"
    jiraf_server_uri="localhost${jiraf_server_port}"
    cache="$(load_issues $jiraf_server_uri)"
    current_issue_id="$(cat $jiraf_ticket_file | xargs)"
    if [[ "$current_issue_id" = "" ]]; then
      echo "$cache"
    else
      echo -e '\e[92m*' "$(echo "$cache" | grep $current_issue_id | xargs)" '\e[39m'
      echo "$cache" | grep -v $current_issue_id
    fi
    ;;

  pick)
    jiraf_server_port="$(lsof -i -n -P | grep LISTEN | grep deno | awk '{print $(NF-1)}' | tr -d '*' | xargs)"
    jiraf_server_uri="localhost${jiraf_server_port}"
    cache="$(load_issues $jiraf_server_uri)"
    echo "$cache" | fzf | awk '{print $1}' > $jiraf_ticket_file
    ;;

  branch)
    if [[ "$2" == "" ]]; then
      echo "Error: Missing ticket id"
      echo "Usage: jiraf branch branch-name-after-ticket-id"
      exit 1
    fi
    current_issue_id="$(cat $jiraf_ticket_file | xargs)"
    if [[ "$current_issue_id" = "" ]]; then
      echo "Error: no issue is selected, run jiraf set or jiraf pick first"
      exit 1
    fi
    git new-branch "${current_issue_id}-$2"
    ;;

  pr)
    if [[ "$2" == "" ]]; then
      echo "Error: Missing PR title"
      echo "Usage: jiraf pr 'Fix all of the things'"
      exit 1
    fi
    current_issue_id="$(cat $jiraf_ticket_file | xargs)"
    if [[ "$current_issue_id" = "" ]]; then
      echo "Error: no issue is selected, run jiraf set or jiraf pick first"
      exit 1
    fi
    prepare_pr_body "$current_issue_id"
    gh pr create --title "[$current_issue_id] $2" --label 'change:standard' --body-file $jiraf_pr_body
    gh pr view --web
    ;;

  *)
    print_help
    exit 1
    ;;
esac
