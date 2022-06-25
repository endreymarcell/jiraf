function jiraf_prompt
  set -l jiraf_cache_file $HOME/.jiraf/.jiraf-cache
  set -l current_ticket_id (cat ~/.jiraf/.jiraf-issue | xargs)
  if test -n "$current_ticket_id"
    if test -f $jiraf_cache_file
      echo " $(grep $current_ticket_id $jiraf_cache_file | xargs)"
    else
      echo " $current_ticket_id"
    end
  else
    echo ""
  end
end
