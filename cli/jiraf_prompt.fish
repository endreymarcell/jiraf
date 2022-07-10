function jiraf_prompt
  if test -f ~/.jiraf/.jiraf-issue-key -a -f ~/.jiraf/.jiraf-issue-desc
    set -l current_ticket_key (cat ~/.jiraf/.jiraf-issue-key | xargs)
    set -l current_ticket_desc (cat ~/.jiraf/.jiraf-issue-desc | xargs)
    set -l git_branch_prefix ''
    set -l git_sync_indicator ''
    if git status >/dev/null 2>&1
      set git_branch_prefix (git branch --show-current | head -c 10 | xargs)
    end
    if test -n "$current_ticket_key" -a -n "$current_ticket_desc"
      if test "$git_branch_prefix" = "$current_ticket_key"
        set git_sync_indicator ==
      end
      echo " $git_sync_indicator$current_ticket_key $current_ticket_desc"
    else
      echo ""
    end
  else
    echo ""
  end
end
