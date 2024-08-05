<template>
  <div>
    <div
      class="d-inline-block pt-2 pr-4"
      v-for="(filterItem, index) in filters"
      :key="index"
    >
      <v-checkbox
        :label="filterItem.text"
        :model-value="filterItem.value"
        @click="$emit('checkfilter', filterItem)"
        hide-details
        color="orange"
      >
      </v-checkbox>
    </div>
  </div>
</template>
<script>
export default {
  props: ["filters"],
  emits: ["checkfilter"],
};
</script>
