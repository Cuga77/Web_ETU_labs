<template>
  <div>
    <Line :data="chartData" :options="mergedOptions" />
  </div>
</template>

<script>
  import {Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
  import {Line} from 'vue-chartjs';

  Chart.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
  )

  export default {
    name: 'BarChart',
    components: {Line},
    props: {
      chartData: {
        type: Object,
        required: true
      },
      chartOptions: {
        type: Object
      }
    },
    computed: {
      mergedOptions() {
        const text = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#e5e7eb';
        const base = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: text } },
            title: { color: '#cbd5e1' }
          },
          scales: {
            x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
            y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } }
          }
        };
        const u = this.chartOptions || {};
        return {
          ...base,
          ...u,
          plugins: {
            ...base.plugins,
            ...(u.plugins || {}),
            legend: {
              ...base.plugins.legend,
              ...((u.plugins || {}).legend || {}),
              labels: {
                ...base.plugins.legend.labels,
                ...((((u.plugins || {}).legend || {}).labels) || {})
              }
            },
            title: { ...base.plugins.title, ...((u.plugins || {}).title || {}) }
          },
          scales: {
            x: { ...base.scales.x, ...((u.scales || {}).x || {}) },
            y: { ...base.scales.y, ...((u.scales || {}).y || {}) }
          }
        };
      }
    }
  }
</script>

<style scoped>

</style>