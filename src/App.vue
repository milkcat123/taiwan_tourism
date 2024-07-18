<template>
  <v-layout>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer>
      <div class="pa-2">
        <v-btn block variant="tonal" @click="initData(nowDatas)">
          沒資料請按這
        </v-btn>
      </div>
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
        <!-- loading -->
        <v-skeleton-loader
          type="article,subtitle,button"
          class="ma-2"
          width="300"
          height="330"
          v-if="cardLoading"
        ></v-skeleton-loader>
        <!-- cards -->
        <template v-if="!cardLoading">
          <v-card
            class="ma-2"
            v-for="(item, i) in cityDatas"
            :key="i"
            style="width: 23.5%"
          >
            <v-card-item>
              <div class="text-overline">{{ item.region }} {{ item.town }}</div>
              <div
                class="text-h6 mb-2 multi-ellipsis line-2"
                style="min-height: 64px"
              >
                {{ item.name }}
              </div>
              <div
                class="text-body-2 mb-2 multi-ellipsis line-5"
                style="min-height: 100px"
              >
                {{ item.content }}
              </div>
              <div class="text-overline">活動時間</div>
              <div class="text-caption mb-3">
                {{ item.duration }}
              </div>
              <v-btn
                block
                variant="tonal"
                color="primary"
                @click="viewDetail(item)"
                >查看詳情</v-btn
              >
            </v-card-item>
          </v-card>
        </template>
      </div>
    </v-main>
  </v-layout>
  <DetailModal ref="DetailModal" :itemData="itemData" />
</template>

<script>
import DetailModal from "@/components/DetailModal.vue";
export default {
  name: "App",
  components: {
    DetailModal,
  },
  data() {
    return {
      title: "全台觀光資訊 Taiwan Tourism Info",
      dataList: [
        {
          url: "api/XMLReleaseALL_public/activity_C_f.json",
          datas: [],
        },
        {
          url: "api/XMLReleaseALL_public/scenic_spot_C_f.json",
          datas: [],
        },
      ],
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
      nowTypeIndex: 0,
      nowCityIndex: 0,
      cardLoading: true,
      itemData: {},
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
      this.cardLoading = false;
    },
    getCityList(_datas) {
      //列表
      let _set = new Set();
      let _arr = [];
      _datas.forEach((item) => {
        let _region = item.Region === null ? "未分類" : item.Region;
        _set.add(_region);
      });
      Array.from(_set).forEach((item, index) => {
        _arr.push({
          text: item,
          value: index + 1,
        });
      });
      let _init = {
        text: "全台",
        value: 0,
      };
      this.listItems[0].datas = [_init, ..._arr];
      console.log("getCityList", this.listItems[0].datas);
    },
    getDataContent(_data, _datas) {
      _data.datas = _datas.map((item) => {
        let data = {
          region: this.returnIfNull(item.Region) ? "未分類" : item.Region,
          town: item.Town,
          name: item.Name,
          content: item.Description,
          duration: `${item.Start.slice(0, 10)} ~ ${item.End.slice(0, 10)}`,
          id: item.Id,
          address: item.Add,
          tel: item.Tel,
          organization: item.Org,
          cycle: item.Cycle,
          site: item.Website,
          pictures: [
            { url: item.Picture1, content: item.Picdescribe1 },
            { url: item.Picture2, content: item.Picdescribe2 },
            { url: item.Picture3, content: item.Picdescribe3 },
          ],
          position: {
            x: item.Px,
            y: item.Py,
          },
        };
        return data;
      });
    },
    returnIfNull(prop) {
      if (prop === "" || prop === null) {
        return true;
      } else {
        return false;
      }
    },
    async getData(url) {
      this.cardLoading = true;
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
    viewDetail(itemData) {
      console.log("viewDetail", itemData);
      this.itemData = itemData;
      let _DetailModal = this.$refs.DetailModal;
      _DetailModal.switchModal();
    },
  },
};
</script>

<style lang="scss">
.multi-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word; /* Breaks the word properly */
  white-space: normal;
  &.line-5 {
    -webkit-line-clamp: 5;
  }
  &.line-2 {
    -webkit-line-clamp: 2;
  }
}
</style>
