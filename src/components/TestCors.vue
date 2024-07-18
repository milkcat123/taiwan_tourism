<template>
  <div class="py-3">
    <input type="text" placeholder="要查詢的api url..." v-model="searchurl" />
    <v-btn block variant="tonal" @click="getData">看console檢查</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchurl: "",
      dataContent: "",
    };
  },
  methods: {
    async getData() {
      await this.axios
        .get(this.searchurl)
        .then((res) => {
          console.log("get successful", res);
        })
        .catch((err) => {
          console.error("get error", err);
        });
    },
  },
};
</script>
