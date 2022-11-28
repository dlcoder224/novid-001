<template>
  <div class="box" :style="`background:url(${appBg})`">
    <div class="box-left">
      <div class="box-left-card">
        <section>
          <div>较上日+ {{ chinaAdd.localConfirmH5 }}</div>
          <div>{{ chinaTotal.localConfirm }}</div>
          <div>本土现有确诊</div>
        </section>
        <section>
          <div>较上日+ {{ chinaAdd.nowConfirm }}</div>
          <div>{{ chinaTotal.nowConfirm }}</div>
          <div>现有确诊</div>
        </section>
        <section>
          <div>较上日+ {{ chinaAdd.confirm }}</div>
          <div>{{ chinaTotal.confirm }}</div>
          <div>累计确诊</div>
        </section>
        <section>
          <div>较上日+ {{ chinaAdd.noInfect }}</div>
          <div>{{ chinaTotal.noInfect }}</div>
          <div>无症状感染者</div>
        </section>
        <section>
          <div>较上日+ {{ chinaAdd.importedCase }}</div>
          <div>{{ chinaTotal.importedCase }}</div>
          <div>境外输入</div>
        </section>
        <section>
          <div>较上日+ {{ chinaAdd.dead }}</div>
          <div>{{ chinaTotal.dead }}</div>
          <div>累计死亡</div>
        </section>
      </div>
      <div class="box-left-pie"></div>
      <div class="box-left-line"></div>
    </div>
    <div class="box-center" id="china"></div>
    <div class="box-right">
      <el-table :data="tableData" :row-class-name="tableRowClassName" style="width: 100%" height="calc(100vh - 80px)">
        <el-table-column prop="name" label="地区" align="center" />
        <el-table-column prop="confirm" label="新增确诊">
          <template #default="{ row }">
            {{ row?.today?.confirm }}
          </template>
        </el-table-column>
        <el-table-column prop="confirmCuts" label="累计确诊" align="center">
          <template #default="{ row }">
            {{ row?.total?.confirm }}
          </template>
        </el-table-column>
        <el-table-column prop="heal" label="治愈" align="center">
          <template #default="{ row }">
            {{ row?.total?.heal }}
          </template>
        </el-table-column>
        <el-table-column prop="head" label="死亡" align="center">
          <template #default="{ row }">
            {{ row?.total?.head ? row?.total?.head : 0 }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 背景图片
import appBg from "./assets/images/bg.jpg";
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useStore } from "./stores";
import * as echarts from "echarts";
// 地址坐标
import { geoCoordMap } from "./assets/ts/geoMap";
import type { Children, ChinaAdd, ChinaTotal } from "./stores/type";
import "./assets/js/china.js";

interface tableData {
  name: string;
  today: object;
  total: object;
}

const store = useStore();

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: tableData;
  rowIndex: number;
}) => {
  if (rowIndex % 2 === 0) {
    return "warning-row";
  } else {
    return "success-row";
  }
};

let tableData = reactive(<Children[]>[]);
let cityDetail = reactive(<Children[]>[]);
let chinaAdd = ref(<ChinaAdd>{});
let chinaTotal = ref(<ChinaTotal>{});

onMounted(async () => {
  window.addEventListener("resize", changeSizeFn);

  // 获取疫情数据
  await store.getList();
  initCharts();
  initPre();
  initLine();
});

const changeSizeFn = () => {
  nextTick(() => {
    initCharts();
  });
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", changeSizeFn);
});

const initCharts = () => {
  const charts = echarts.init(document.querySelector("#china") as HTMLElement);
  const tempData = store.list.diseaseh5Shelf;
  const city = tempData.areaTree[0].children;
  tableData.push(...city);
  chinaAdd.value = tempData.chinaAdd;
  chinaTotal.value = tempData.chinaTotal;
  cityDetail.push(...city[11].children.slice(0, 9));
  const data = city.map((v) => {
    return {
      name: v.name,
      value: geoCoordMap[v.name].concat(v.total.nowConfirm),
      children: v.children,
    };
  });
  const option = {
    geo: {
      map: "china",
      aspectScale: 0.8,
      layoutCenter: ["50%", "50%"],
      layoutSize: "100%",
      itemStyle: {
        areaColor: {
          type: "linear-gradient",
          x: 0,
          y: 1200,
          x2: 1000,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "#152E6E", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#0673AD", // 50% 处的颜色
            },
          ],
          global: true, // 缺省为 false
        },
        shadowColor: "#0f5d9d",
        shadowOffsetX: 0,
        shadowOffsetY: 15,
        opacity: 0.5,
      },
      emphasis: {
        areaColor: "#0f5d9d",
      },

      regions: [
        {
          name: "南海诸岛",
          itemStyle: {
            areaColor: "rgba(0, 10, 52, 1)",
            borderColor: "rgba(0, 10, 52, 1)",
            opacity: 0,
            label: {
              show: false,
              color: "#009cc9",
            },
          },
          label: {
            show: false,
            color: "#FFFFFF",
            fontSize: 12,
          },
        },
      ],
    },
    series: [
      {
        type: "map",
        map: "china",
        aspectScale: 0.8,
        layoutCenter: ["50%", "50%"], //地图位置
        layoutSize: "100%",
        label: {
          show: true,
          color: "#FFFFFF",
          fontSize: 12,
        },
        itemStyle: {
          areaColor: "#0c3653",
          borderColor: "#1cccff",
          borderWidth: 1.8,
        },
        emphasis: {
          areaColor: "#56b1da",
          label: {
            show: true,
            color: "#fff",
          },
        },
        data: data,
      },
      {
        type: "scatter",
        coordinateSystem: "geo",
        symbol: "pin",
        symbolSize: [45, 45],
        label: {
          show: true,
          color: "#fff",
          // echart 格式化函数回调
          formatter(value: any) {
            return value.data.value[2];
          },
        },
        itemStyle: {
          color: "#1E90FF", //标志颜色
        },
        data: data,
      },
    ],
  };

  charts.setOption(option);
  charts.resize();
  charts.on("click", (e: any) => {
    // store.item = e.data.children;
    tableData.splice(0);
    tableData.push(...e.data.children);
    cityDetail.splice(0);
    cityDetail.push(...e.data.children.slice(0, 9));
  });
};

const initPre = () => {
  const charts = echarts.init(
    document.querySelector(".box-left-pie") as HTMLElement
  );
  charts.setOption({
    backgroundColor: "#223651",
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        itemStyle: {
          borderRadius: 4,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "15",
            fontWeight: "bold",
          },
        },
        data: cityDetail.map((v) => {
          return {
            name: v.name,
            value: v.adcode,
          };
        }),
      },
    ],
  });
};
const initLine = () => {
  const charts = echarts.init(
    document.querySelector(".box-left-line") as HTMLElement
  );

  var data = [
    ...cityDetail.slice(0,3)
  ];
  const xData = <any[]>[]
  const yData = <any[]>[];

  var min = 50;

  data.map(function (a, b) {
    xData.push(a.name);
    if (a.adcode === '0') {
      yData.push(a.adcode + min);
    } else {
      yData.push(a.adcode);
    }
  });

  const option = {
    backgroundColor: "#223651",
    color: ["#3398DB"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          opacity: 0,
        },
      },
      formatter: function (prams:any) {
        if (prams[0].data === min) {
          return "活动分析：0%";
        } else {
          return "活动分析：" + prams[0].data;
        }
      },
    },
    grid: {
      left: "15%",
      top: "10%",
      right: "5%",
      bottom: "12%",
      // containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        gridIndex: 0,
        data: xData,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#0c3b71",
          },
        },
        axisLabel: {
          show: true,
          color: "rgb(170,170,170)",
          fontSize: 14,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        // name:"单位:户",
        nameTextStyle: {
          color: "rgb(170,170,170)",
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(255,255,255,0.2)", //网格线的颜色
            type: "dashed",
          },
        },
        // min: min,
        // max: 100,
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: "rgb(170,170,170)",
          formatter: "{value}",
        },
      },
    ],
    series: [
      {
        // 分隔
        type: "pictorialBar",
        itemStyle: {
          normal: {
            color: "#6DF95A",
          },
        },
        symbolRepeat: "fixed",
        symbolMargin: 4,
        symbol: "rect",
        symbolClip: true,
        symbolSize: [30, 8],
        symbolPosition: "start",
        symbolOffset: [0, -1],
        data: yData,
        // width: 25,
        z: 0,
        zlevel: 8,
      },
    ],
  };

  charts.setOption(option);
};
</script>

<style lang="less" scoped>
@white: #ffffff;
@itemBg: #223651;
@itemColor: #41b0db;
@itemBorder: #212028;

.box {
  height: 100%;
  overflow: hidden;
  padding-top: 30px;

  display: flex;

  &-left {
    width: 400px;

    &-pie {
      height: 300px;
      margin-top: 20px;
    }

    &-line {
      height: 230px;
      margin-top: 20px;
    }

    &-card {
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: auto auto;

      section {
        background-color: @itemBg;
        border: 1px solid @itemBorder;
        padding: 10px;

        display: flex;
        flex-direction: column;
        align-items: center;

        div:nth-child(2) {
          color: @itemColor;
          padding: 10px 0;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }

  &-center {
    flex: 1;
  }

  &-right ::v-deep {
    width: 400px;
    color: @white;

    .el-table {
      background-color: transparent;

      thead {
        color: @white;
      }

      .el-table__inner-wrapper {
        &::before {
          height: 0;
        }

        .warning-row {
          --el-table-tr-bg-color: var(--el-color-warning-light-9);
        }

        .success-row {
          --el-table-tr-bg-color: var(--el-color-success-light-9);
        }
      }
    }
  }
}
</style>
