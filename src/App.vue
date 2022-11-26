<template>
  <div class="box" :style="`background:url(${appBg})`">
    <div class="box-left"></div>
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
            {{ row?.total?.head }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useStore } from "./stores";
import * as echarts from "echarts";
// 背景图片
import appBg from "./assets/images/bg.jpg";
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
let ChinaAdd = ref(<ChinaAdd>{})
let ChinaTotal = ref(<ChinaTotal>{})

onMounted(async () => {
  window.addEventListener("resize", changeSizeFn);

  // 获取疫情数据
  await store.getList();
  initCharts();
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
  const tempData = store.list.diseaseh5Shelf
  const city = tempData.areaTree[0].children;
  tableData.push(...city);
  ChinaAdd.value = tempData.chinaAdd
  ChinaTotal.value = tempData.chinaTotal
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
    console.log(e, "e");
    console.log(tableData, "tableData");
  });
};
</script>

<style lang="less" scoped>
.box {
  height: 100%;
  overflow: hidden;

  display: flex;

  &-left {
    width: 400px;
  }

  &-center {
    flex: 1;
  }

  &-right ::v-deep {
    width: 400px;
    color: #ffffff;

    .el-table {
      background-color: transparent;
      margin-top: 30px;

      thead {
        color: #ffffff;
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
