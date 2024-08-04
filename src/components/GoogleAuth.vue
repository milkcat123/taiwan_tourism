<template>
  <!-- <v-btn class="" data-onsuccess="onSignIn">登入</v-btn> -->
  <GoogleLogin :callback="callback" prompt />
</template>
<script>
export default {
  methods: {
    callback(response) {
      // This callback will be triggered when the user selects or login to
      // his Google account from the popup
      console.log("回傳GOOGLE授權KEY", response);
    },
  },
};
</script>
