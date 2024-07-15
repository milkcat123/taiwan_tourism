<template>
  <v-layout>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer>
      <v-list density="compact">
        <template
          v-for="(item, index) in listItems"
          :key="`list-list-${index}`"
        >
          <v-list-subheader>{{ item.subTitle }}</v-list-subheader>

          <v-list-item
            v-for="(item, index) in item.datas"
            :key="`list-item-${index}`"
            :active="item.value === nowCityIndex"
            :value="item"
            color="primary"
            @click="changeListIndex(index)"
          >
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main
      class="mx-auto bg-grey-lighten-3"
      min-height="100vh"
      style="width: 100%"
    >
      <div class="d-flex align-strech justify-start flex-wrap">
        <v-card
          class="ma-2"
          v-for="(item, i) in cityDatas"
          :key="i"
          style="width: 23.5%"
        >
          <v-card-item>
            <div>
              <div class="text-overline">{{ item.region }} {{ item.town }}</div>
              <div class="text-h6 mb-2" style="min-height: 2rem">
                {{ item.name }}
              </div>
              <div
                class="text-body-2 mb-2 multi-ellipsis"
                style="min-height: 100px"
              >
                {{ item.content }}
              </div>
              <div class="text-overline">活動時間</div>
              <div class="text-caption">
                {{ item.duration }}
              </div>
            </div>
          </v-card-item>
        </v-card>
      </div>
    </v-main>
  </v-layout>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      title: "觀光資訊資料",
      dataList: [
        {
          url: "api/XMLReleaseALL_public/activity_C_f.json",
          datas: [],
        },
      ],
      listItems: [
        {
          subTitle: "活動",
          datas: [
            {
              text: "全台",
              value: 0,
            },
          ],
        },
        {
          subTitle: "景點",
          //   datas: [
          //     {
          //       text: "全台",
          //       value: 0,
          //     },
          //   ],
        },
      ],
      nowTypeIndex: 0,
      nowCityIndex: 0,
    };
  },
  created() {
    this.initData(this.nowDatas);
  },
  mounted() {},
  computed: {
    nowDatas: function () {
      return this.dataList[this.nowTypeIndex];
    },
    cityDatas: function () {
      if (this.nowCityIndex === 0) {
        return this.dataList[this.nowTypeIndex].datas;
      } else {
        let _city =
          this.listItems[this.nowTypeIndex].datas[this.nowCityIndex].text;
        let result = this.dataList[this.nowTypeIndex].datas.filter((item) => {
          return item.region === _city;
        });
        return result;
      }
    },
  },
  methods: {
    async initData(_data) {
      let _datas = await this.getData(_data.url);
      console.log("_datas", _datas);
      if (_datas === undefined) {
        return;
      }
      this.getCityList(_datas);
      this.getDataContent(_data, _datas);
    },
    getCityList(_datas) {
      //列表
      let _set = new Set();
      let _arr = [];
      _datas.forEach((item) => {
        _set.add(item.Region);
      });
      Array.from(_set).forEach((item, index) => {
        _arr.push({
          text: item,
          value: index + 1,
        });
      });
      this.listItems[0].datas = [...this.listItems[0].datas, ..._arr];
      console.log("getCityList", this.listItems[0].datas);
    },
    getDataContent(_data, _datas) {
      _data.datas = _datas.map((item) => {
        let data = {
          region: item.Region,
          town: item.Town,
          name: item.Name,
          content: item.Description,
          duration: `${item.Start.slice(0, 10)} ~ ${item.End.slice(0, 10)}`,
        };
        return data;
      });
    },
    async getData(url) {
      let result;
      await this.axios
        .get(url)
        .then((res) => {
          console.log("get successful", res);
          result = res.data.XML_Head.Infos.Info;
        })
        .catch((err) => {
          console.error("get error", err);
        });
      return result;
    },
    changeListIndex(index) {
      this.nowCityIndex = index;
      console.log("changeListIndex", this.nowCityIndex, this.cityDatas);
    },
  },
};
</script>
<style lang="scss">
.multi-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
  word-break: break-word; /* Breaks the word properly */
  white-space: normal;
}
</style>