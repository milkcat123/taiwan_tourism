<template>
  <v-dialog v-model="dialog" width="auto">
    <v-card max-width="600">
      <v-card-item>
        <div class="mb-4">
          <div class="text-overline">
            {{ getItemData.region }} {{ getItemData.town }}
          </div>
          <div class="text-h6 mb-1">{{ getItemData.name }}</div>
          <div :class="contentTitleClass">
            {{ getItemData.duration }}
          </div>
          <p class="multi-ellipsis line-5">
            {{ getItemData.content }}
          </p>
          <v-btn class="ms-auto" text="查看更多"></v-btn>
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
        <div class="mb-3">
          <div :class="contentTitleClass">活動網址 |</div>
          {{ getItemData.site }}
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
      dialog: true,
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
  },
  methods: {
    switchModal() {
      this.dialog = true;
    },
  },
};
</script>

<style type="scss"></style>
