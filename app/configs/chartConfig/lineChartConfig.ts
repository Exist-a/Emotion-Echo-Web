import type { pieChartDataItem } from "~/types/charts/pieChartType";

export const lineChartOption = (
  XData: string[],
  YData: number[],
  title: string | undefined
) => ({
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: XData,
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: title,
      data: YData,
      type: "line",
      areaStyle: {},
    },
  ],
});
