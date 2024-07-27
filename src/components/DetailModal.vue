<template>
  <v-dialog v-model="dialog" width="auto">
    <v-card max-width="1000" width="80vw">
      <v-card-item>
        <div class="mb-4">
          <div class="text-overline">
            {{ getItemData.region }} {{ getItemData.town }}
          </div>
          <div class="text-h6 mb-1">{{ getItemData.name }}</div>
          <div :class="contentTitleClass">
            {{ getItemData.duration }}
          </div>
          <!-- <p class="multi-ellipsis line-5"> -->
          <p>
            {{ getItemData.content }}
          </p>
          <!-- <v-btn class="ms-auto" text="查看更多"></v-btn> -->
        </div>
        <div class="mb-3">
          <div :class="contentTitleClass">活動地址 |</div>
          {{ getItemAddress }}
        </div>
        <div class="mb-3">
          <div :class="contentTitleClass">主辦單位 |</div>
          {{ getItemData.organization }}
        </div>
        <div class="mb-3">
          <div :class="contentTitleClass">連絡電話 |</div>
          {{ getItemData.tel }}
        </div>
        <template v-if="getItemData.site !== null">
          <div class="mb-3">
            <div :class="contentTitleClass">活動網址 |</div>
            <a :href="getItemData.site" target="_blank">{{
              getItemData.site
            }}</a>
          </div>
        </template>
        <div class="mb-3" v-if="ifImgNull">
          <div :class="contentTitleClass">活動集錦 |</div>
          <div class="d-flex flex-wrap">
            <template
              v-for="(item, index) in getItemData.pictures"
              :key="index"
            >
              <v-card width="400px" class="ma-3" v-if="item.url !== null">
                <!-- <img :src="item.url" :alt="item.content" /> -->
                <v-img height="250px" :src="item.url" cover></v-img>
                <!-- <p>{{ item.content }}</p> -->
                <v-card-title class="px-3 py-2">{{
                  item.content
                }}</v-card-title>
              </v-card>
            </template>
          </div>
        </div>
      </v-card-item>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="關閉" @click="dialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  props: ["itemData"],
  computed: {
    getItemData: function () {
      return this.itemData;
    },
    getItemAddress: function () {
      let _item = this.getItemData;
      return _item.address === ""
        ? `${_item.region}${_item.town}`
        : _item.address;
    },
    contentTitleClass: function () {
      return `text-caption mb-1 text-blue-darken-2`;
    },
    ifImgNull: function () {
      let bool = this.getItemData.pictures.some((item) => {
        return item.url !== null;
      });
      console.log("ifImgNull", bool);
      return bool;
    },
  },
  methods: {
    switchModal() {
      this.dialog = true;
    },
  },
};
</script>

<style type="scss"></style>
