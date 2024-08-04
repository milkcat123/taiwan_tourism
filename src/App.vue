<template>
  <v-layout>
    <NavBar @listdata="getListindex" :nowCityText="nowCityText" />

    <v-main
      class="mx-auto bg-grey-lighten-3"
      min-height="100vh"
      style="width: 100%"
    >
      <div
        class="d-inline-block pt-2 pr-4"
        v-for="(filterItem, index) in filter"
        :key="index"
      >
        <v-checkbox
          :label="filterItem.text"
          v-model="filterItem.value"
          hide-details
          color="orange"
        >
        </v-checkbox>
      </div>

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
          <div class="pa-3" v-show="cityDatas.length === 0">該縣市無活動</div>

          <v-card
            class="ma-2"
            v-for="(item, i) in cityDatas"
            v-show="showCard(item)"
            :key="i"
            style="width: 23.5%"
          >
            <v-card-item>
              <div class="text-overline d-flex justify-space-between">
                {{ item.region }} {{ item.town }}

                <v-btn
                  variant="text"
                  size="small"
                  icon="mdi-heart-outline"
                  @click="toggleFavorite(item.id)"
                  :disabled="item.pastTag"
                >
                  <v-icon :icon="hasFavorite(item.id)" color="red"></v-icon>
                </v-btn>
              </div>

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
import NavBar from "@/layout/NavBar.vue";
import DetailModal from "@/components/DetailModal.vue";
export default {
  name: "App",
  components: {
    NavBar,
    DetailModal,
  },
  data() {
    return {
      cardLoading: true,
      nowTypeIndex: 0,
      dataList: [
        {
          url: "XMLReleaseALL_public/activity_C_f.json",
          datas: [],
        },
        {
          url: "XMLReleaseALL_public/scenic_spot_C_f.json",
          datas: [],
        },
      ],
      filter: [
        {
          text: "隱藏已過期活動",
          value: false,
        },
        {
          text: "僅顯示收藏活動",
          value: false,
        },
      ],
      favoriteItems: [],
      nowCityText: "全台",
      itemData: {},
    };
  },
  created() {
    this.initData(this.nowDatas);
  },
  computed: {
    nowDatas: function () {
      return this.dataList[this.nowTypeIndex];
    },
    cityDatas: function () {
      if (this.nowCityText === "全台") {
        return this.dataList[this.nowTypeIndex].datas;
      } else {
        let result = this.dataList[this.nowTypeIndex].datas.filter((item) => {
          return item.region === this.nowCityText;
        });
        console.log("切換:", this.nowCityText, result);
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
      this.getDataContent(_data, _datas);
      this.cardLoading = false;
    },
    getDataContent(_data, _datas) {
      _data.datas = _datas.map((item) => {
        let data = {
          region: this.returnIfNull(item.Region, "未分類"),
          town: this.returnIfNull(item.Town, "未提供"),
          name: this.returnIfNull(item.Name, "未提供"),
          content: this.returnIfNull(item.Description, "未提供"),
          start: this.returnIfNull(item.Start, "未提供"),
          end: this.returnIfNull(item.End, "未提供"),
          duration: `${item.Start.slice(0, 10)} ~ ${item.End.slice(0, 10)}`,
          id: item.Id,
          address: this.returnIfNull(item.Add, "未提供"),
          tel: this.returnIfNull(item.Tel, "未提供"),
          organization: this.returnIfNull(item.Org, "未提供"),
          cycle: item.Cycle,
          site: this.returnIfNull(item.Website),
          pictures: [
            {
              url: this.returnIfNull(item.Picture1),
              content: this.returnIfNull(item.Picdescribe1),
            },
            {
              url: this.returnIfNull(item.Picture2),
              content: this.returnIfNull(item.Picdescribe2),
            },
            {
              url: this.returnIfNull(item.Picture3),
              content: this.returnIfNull(item.Picdescribe3),
            },
          ],
          position: {
            x: item.Px,
            y: item.Py,
          },
          pastTag: this.filterToday(item.End),
        };
        return data;
      });
    },
    returnIfNull(prop, newVal = null) {
      if (prop === "" || prop === null) {
        return newVal;
      } else {
        return prop;
      }
    },
    async getData(url) {
      this.cardLoading = true;
      let result;
      await this.axios
        .get(`${process.env.VUE_APP_API}/${url}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("get successful", res);
          result = res.data;
        })
        .catch((err) => {
          console.error("get error", err);
          result = require("../public/json/original_data");
        });
      return result.XML_Head.Infos.Info;
    },
    viewDetail(itemData) {
      console.log("viewDetail", itemData);
      this.itemData = itemData;
      let _DetailModal = this.$refs.DetailModal;
      _DetailModal.switchModal();
    },
    filterToday(_date) {
      let today = new Date().getTime();
      let theday = new Date(_date).getTime();
      if (today > theday && theday) {
        return true;
      }
      return false;
    },
    showCard(_item) {
      let tag = _item.pastTag;
      let check = this.filter[0].value;
      let fav = this.filter[1].value;
      let incl = this.favoriteItems.includes(_item.id);
      if (fav) {
        if (incl) {
          return true;
        }
        return false;
      }
      if (tag && check) {
        return false;
      }
      return true;
    },
    hasFavorite(_id) {
      let bool = this.favoriteItems.includes(_id);
      return bool ? "mdi-heart" : "mdi-heart-outline";
    },
    toggleFavorite(_id) {
      let _a = [...this.favoriteItems];
      if (!_a.includes(_id)) {
        this.favoriteItems.push(_id);
        console.log("加入收藏", this.favoriteItems);
      } else {
        this.favoriteItems = _a.filter((it) => it !== _id);
        console.log("取消收藏", this.favoriteItems);
      }
    },
    getListindex(_data) {
      this.nowCityText = _data;
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
