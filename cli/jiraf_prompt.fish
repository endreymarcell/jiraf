function jiraf_prompt
  set -l current_ticket_key (cat ~/.jiraf/.jiraf-issue-key | xargs)
  set -l current_ticket_desc (cat ~/.jiraf/.jiraf-issue-desc | xargs)
  if test -n "$current_ticket_key" -a -n "$current_ticket_desc"
    echo " ${current_ticket_key} ${current_ticket_desc}"
  else
    echo ""
  end
end
