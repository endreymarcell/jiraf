<script lang="ts">
  import { columns} from "./board.ts";
  import Column from "./Column.svelte";
  import {isDraggingCard} from "./drag.ts";
  import {changeCounter} from "../comm/comm.ts";
</script>

<div id="board" class="w-screen h-screen columns-4 gap-0" class:select-none={$isDraggingCard}>
  {#key $changeCounter}
    {#each columns as {status, title}}
      <Column {status} {title} />
    {/each}
  {/key}
</div>
