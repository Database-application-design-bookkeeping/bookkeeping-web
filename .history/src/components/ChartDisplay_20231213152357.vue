<template>
  <div class="chart-box">
    <div id="chartDom1" class="chart-item"></div>
    <div id="chartDom2" class="chart-item"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import axios from "axios";
import { onMounted, reactive } from "vue";
//用于图表展示的数据数组对象
//对象格式为：{value:xxx,name:xxx}
let expenseChartData = [];
let incomeChartData = [];
//用来存储小类别的金额量
let categoryChartData = reactive([{
  name: "餐饮",
  type: "支出",
  amount: 0,
},
{
  name: "购物",
  type: "支出",
  amount: 0
},
{
  name: "出行",
  type: "支出",
  amount: 0
},
{
  name: "社交",
  type: "支出",
  amount: 0
},
{
  name: "医疗",
  type: "支出",
  amount: 0
},
{
  name: "礼物",
  type: "支出",
  amount: 0
},
{
  name: "娱乐",
  type: "支出",
  amount: 0
},
{
  name: "学习",
  type: "支出",
  amount: 0
},
{
  name: "其他",
  type: "支出",
  amount: 0
},
{
  name: "工资",
  type: "收入",
  amount: 0
},
{
  name: "理财",
  type: "收入",
  amount: 0
},
{
  name: "礼金",
  type: "收入",
  amount: 0
},
{
  name: "兼职",
  type: "收入",
  amount: 0
},
{
  name: "其他",
  type: "收入",
  amount: 0
}]);

//用于存储未处理的chart图表的data信息
let expenseVos = reactive({
  list: []
})
let incomeVos = reactive({
  list: []
})

//用来处理后端数据，具体作用可以返回支出/收入的各个小类别的花费情况
function assignmentData(data, type) {
  data.list.map((listItem) => {
    categoryChartData.map((dataItem) => {
      if (listItem.categoryName === dataItem.name && dataItem.type === type) {
        dataItem.amount += listItem.amount
      }
    })
  })
}

//获取总的收入信息
function getIncome() {
  axios({
    url: "/income/total",
  }).then((res) => {
    if (res.data.msg === "查询成功") {
      let expense = res.data.data
      incomeVos.list = expense.incomeVos
      assignmentData(incomeVos, "收入")
      categoryChartData.map((item) => {
        if (item.type === "收入") {
          incomeChartData.push({ value: item.amount, name: item.name });
        }
      })
      initCharts("chartDom2", incomeChartData, "收入项目");
    }
  }).catch((err) => {
    console.log(err);
  })
}

//获取总的支出信息
function getExpense() {
  axios({
    url: "/expense/total",
  }).then((res) => {
    if (res.data.msg === "查询成功") {
      let expense = res.data.data
      expenseVos.list = expense.expenseVos
      assignmentData(expenseVos, "支出")
      categoryChartData.map((item) => {
        if (item.type === "支出") {
          expenseChartData.push({ value: item.amount, name: item.name });
        }
      })
      initCharts("chartDom1", expenseChartData, "支出项目");
    }
  }).catch((err) => {
    console.log(err);
  })
}
//echarts 图表
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

function initCharts(dom, data, title) {
  let chartDom = echarts.init(document.getElementById(dom));
  let option
  //配置
  option = {
    title: {
      text: title,
      subtext: '占比',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '类别',
        type: 'pie',
        radius: '50%',
        data: data.map((item) => { if (item.value != 0) return item }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  chartDom.setOption(option);
}
onMounted(() => {
  getIncome()
  getExpense()
})
</script>

<style lang="scss" scoped>
.chart-box {
  display: flex;
  justify-content: space-between;

  .chart-item {
    width: 50%;
    min-width: 450px;
    height: 300px;
  }
}
</style>