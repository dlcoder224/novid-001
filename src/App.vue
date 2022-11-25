<template>
  <div class="box" :style="`background:url(${appBg})`">
    <div class="box-left"></div>
    <div class="box-center" id="china"></div>
    <div class="box-right">
      {{ store.item }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useStore } from './stores'
import * as echarts from 'echarts'
// 背景图片
import appBg from './assets/images/bg.jpg'
// 地址坐标
import { geoCoordMap } from './assets/ts/geoMap'

import './assets/js/china.js'

const store = useStore()

onMounted(async () => {
  // 获取疫情数据
  await store.getList()
  initCharts()
})

const initCharts = () => {
  const charts = echarts.init(document.querySelector('#china') as HTMLElement)
  const city = store.list.diseaseh5Shelf.areaTree[0].children
  const data = city.map(v => {
    return {
      name: v.name,
      value: geoCoordMap[v.name].concat(v.total.nowConfirm),
      children: v.children
    }
  })
  charts.setOption({
    geo: {
      map: 'china',
      aspectScale: 0.8,
      layoutCenter: ['50%', '50%'],
      layoutSize: '100%',
      itemStyle: {
        //  normal: {
        areaColor: {
          type: 'linear-gradient',
          x: 0,
          y: 1200,
          x2: 1000,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: '#152E6E' // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#0673AD' // 50% 处的颜色
            }
          ],
          global: true // 缺省为 false
        },
        shadowColor: '#0f5d9d',
        shadowOffsetX: 0,
        shadowOffsetY: 15,
        opacity: 0.5
        // },
      },
      emphasis: {
        areaColor: '#0f5d9d'
      },

      regions: [
        {
          name: '南海诸岛',
          itemStyle: {
            areaColor: 'rgba(0, 10, 52, 1)',
            borderColor: 'rgba(0, 10, 52, 1)',
            //normal: {
            opacity: 0,
            label: {
              show: false,
              color: '#009cc9'
            }
            //},
          },
          label: {
            show: false,
            color: '#FFFFFF',
            fontSize: 12
          }
        }
      ]
    },
    series: [
      {
        type: 'map',
        map: 'china',
        aspectScale: 0.8,
        layoutCenter: ['50%', '50%'], //地图位置
        layoutSize: '100%',
        label: {
          show: true,
          color: '#FFFFFF',
          fontSize: 12
        },
        itemStyle: {
          areaColor: '#0c3653',
          borderColor: '#1cccff',
          borderWidth: 1.8
        },
        emphasis: {
          areaColor: '#56b1da',
          label: {
            show: true,
            color: '#fff'
          }
        },
        data: data
      },
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin',
        symbolSize: [45, 45],
        label: {
          show: true,
          color: '#fff',
          // echart 格式化函数回调
          formatter(value: any) {
            return value.data.value[2]
          }
        },
        itemStyle: {
          color: '#1E90FF' //标志颜色
        },
        data: data
      }
    ]
  })
  charts.on('click', (e: any) => {
    store.item = e.data.children
  })
}
</script>

<style lang="less">
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
  &-right {
    width: 400px;
  }
}
</style>
