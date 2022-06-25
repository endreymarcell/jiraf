#!/usr/bin/env bash
set -eo pipefail

jiraf_home=$HOME/.jiraf
jiraf_issue_key_file=$jiraf_home/.jiraf-issue-key
jiraf_issue_desc_file=$jiraf_home/.jiraf-issue-desc
jiraf_pr_body=$jiraf_home/.pr-body

issue_url_root="https://transferwise.atlassian.net/browse/"

function get_server_uri() {
  jiraf_server_port="$(lsof -i -n -P | grep LISTEN | grep deno | awk '{print $(NF-1)}' | tr -d '*' | xargs)"
  jiraf_server_uri="localhost${jiraf_server_port}"
  echo "$jiraf_server_uri"
}

function load_issues() {
  local server_uri="$(get_server_uri)"
  curl --silent "$server_uri/issues"
}

function reload_issues() {
  echo Updating cache...
  local server_uri="$(get_server_uri)"
  curl --silent -XPOST "$server_uri/refresh" >/dev/null
  echo Done.
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
    echo "$2" > $jiraf_issue_key_file
    cache="$(load_issues)"
    key_and_desc="$(echo "$cache" | grep "$2")}"
    echo "$key_and_desc" | cut -d' ' -f2- > $jiraf_issue_desc_file
    exit 0
    ;;

  unset)
    echo "" > $jiraf_issue_key_file
    ;;

  r*)
    reload_issues
    ;;

  l*s*)
    cache="$(load_issues)"
    current_issue_key="$(cat $jiraf_issue_key_file | xargs)"
    if [[ "$current_issue_key" = "" ]]; then
      echo "$cache"
    else
      echo -e '\e[92m*' "$(echo "$cache" | grep $current_issue_key | xargs)" '\e[39m'
      echo "$cache" | grep -v $current_issue_key
    fi
    ;;

  pick)
    cache="$(load_issues)"
    key_and_desc="$(echo "$cache" | fzf)"
    echo "$key_and_desc" | awk '{print $1}' > $jiraf_issue_key_file
    echo "$key_and_desc" | cut -d' ' -f2- > $jiraf_issue_desc_file
    ;;

  branch)
    if [[ "$2" == "" ]]; then
      echo "Error: Missing ticket id"
      echo "Usage: jiraf branch branch-name-after-ticket-id"
      exit 1
    fi
    current_issue_key="$(cat $jiraf_issue_key_file | xargs)"
    if [[ "$current_issue_key" = "" ]]; then
      echo "Error: no issue is selected, run jiraf set or jiraf pick first"
      exit 1
    fi
    git new-branch "${current_issue_key}-$2"
    ;;

  pr)
    if [[ "$2" == "" ]]; then
      echo "Error: Missing PR title"
      echo "Usage: jiraf pr 'Fix all of the things'"
      exit 1
    fi
    current_issue_key="$(cat $jiraf_issue_key_file | xargs)"
    if [[ "$current_issue_key" = "" ]]; then
      echo "Error: no issue is selected, run jiraf set or jiraf pick first"
      exit 1
    fi
    prepare_pr_body "$current_issue_key"
    gh pr create --title "[$current_issue_key] $2" --label 'change:standard' --body-file $jiraf_pr_body
    gh pr view --web
    ;;

  *)
    print_help
    exit 1
    ;;
esac
