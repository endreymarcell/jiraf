<script lang="ts">
  import type {Status} from "./board.ts";
  import {issues} from "../comm/comm.ts";
  import Card from "./Card.svelte";

  export let status: Status;
  export let title: string;

  $: issuesInColumn = $issues.filter(issue => issue.status === status);

  const headingBgColor = status === 'todo'
    ? 'bg-orange-300'
    : status === 'wip'
    ? 'bg-sky-300'
    : status === 'review'
    ? 'bg-teal-300'
    : status === 'ready'
    ? 'bg-rose-300'
    : 'bg-slate-300';
  </script>

<div data-status={status} class="w-full h-screen bg-neutral-100">
  <div class={`w-full h-10 flex justify-center items-center ${headingBgColor} uppercase tracking-wider text-xl border-white border-x-4`}>{title}</div>
  {#each issuesInColumn as {key, title}}
    <Card {key} {title} />
  {/each}
</div>
