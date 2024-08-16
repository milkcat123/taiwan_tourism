<template>
  <v-app-bar color="primary" density="compact">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        variant="text"
        color="white"
      ></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>{{ title }}</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer">
    <v-list density="compact">
      <template v-for="(item, index) in listItems" :key="`list-list-${index}`">
        <v-list-subheader>
          {{ item.subTitle }}
        </v-list-subheader>

        <v-list-item
          v-for="(item, index) in item.datas"
          :key="`list-item-${index}`"
          :active="item.text === nowCityText"
          :value="item"
          color="primary"
          @click="changeListIndex(item)"
        >
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import citycode from "../../public/json/citycode.json";
export default {
  props: ["nowCityText"],
  emits: ["listdata"],
  data() {
    return {
      title: "全台觀光資訊 Taiwan Tourism Info",
      drawer: false,
      listItems: [
        {
          subTitle: "活動",
          datas: [],
        },
        {
          subTitle: "景點",
          datas: [],
        },
      ],
      cityCode: citycode,
    };
  },
  methods: {
    changeListIndex(item) {
      this.$emit("listdata", item.text);
    },
    getCityList() {
      let _list = this.cityCode.map((it, idx) => {
        return { text: it.city, value: idx + 1 };
      });

      let _init = {
        text: "全台",
        value: 0,
      };
      let _none = {
        text: "未分類",
        value: 99,
      };
      this.listItems[0].datas = [_init, ..._list, _none];
    },
  },
  mounted() {
    this.getCityList();
  },
};
</script>
