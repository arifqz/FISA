<script>
  import { onMount } from 'svelte';
  import { createGraph } from './d3Graph.js';
    let container;


  let data = [
    {
      "year": "CY2021",
      "totalOrders": 430,
      "totalTargets": 376
    },
    {
      "year": "CY2022",
      "totalOrders": 337,
      "totalTargets": 417
    },
    {
      "year": "CY2023",
      "totalOrders": 352,
      "totalTargets": 759
    }
  ];

  onMount(() => {
    createGraph(data, '.graph-container');
  });
</script>

<div class="graph-container" bind:this={container}></div>