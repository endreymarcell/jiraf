<script lang="ts">
  import { columns} from "./board.ts";
  import Column from "./Column.svelte";
</script>

<div id="board" class="w-screen h-screen columns-4 gap-0">
  {#each columns as {status, title, headingColor}}
    <Column {status} {title} {headingColor} />
  {/each}
</div>
