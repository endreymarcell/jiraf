<script lang="ts">
  import { drag } from './drag.ts'

  export let title: string;
  export let key: string;
</script>

<div class="m-1 border-2 border-slate-400 rounded px-1 flex gap-1 bg-slate-100 cursor-move" use:drag>
  <div class="font-bold text-sky-600">{key}</div>
  <div>{title}</div>
</div>
