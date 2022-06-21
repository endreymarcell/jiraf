#!/usr/bin/env bash
set -euo pipefail

jiraf_home=$HOME/.jiraf
jiraf_cache=$jiraf_home/.jiraf-cache
jiraf_ticket_file=$jiraf_home/.jiraf-issue
jiraf_pr_body=$jiraf_home/.pr-body

issue_url_root="https://transferwise.atlassian.net/browse/"

function load_issues() {
  echo Updating cache...
  node $HOME/code/jiraf/index.mjs > $jiraf_cache
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

case $1 in
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
    load_issues
    ;;
  l*s*)
    if [[ ! -f "$jiraf_cache" ]]; then
      load_issues
    fi
    cat "$jiraf_cache"
    ;;
  pick)
    if [[ ! -f "$jiraf_cache" ]]; then
      load_issues
    fi
    cat "$jiraf_cache" | fzf | awk '{print $1}' > $jiraf_ticket_file
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
    gh pr create --title "'[$current_issue_id] $2'" --label 'change:standard' --body-file $jiraf_pr_body
    ;;
  *)
    echo anything else
    ;;
esac
