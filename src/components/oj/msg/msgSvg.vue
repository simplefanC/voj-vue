<template>
  <svg height="20" width="20">
    <circle cx="10" cy="10" r="10" style="fill: red;"></circle>
    <text v-if="total >= 10" dy="15" style="fill: white" x="2">
      {{ total > 99 ? 99 : total }}
    </text>
    <text v-else-if="total > 0" dy="15" style="fill: white" x="6">
      {{ total }}
    </text>
  </svg>
</template>

<script>
export default {
  name: 'msgSvg',
  props: {
    total: {
      required: true,
      type: Number,
    },
  },
};
</script>
