export interface lineChartProps {
    
  XData: string[];
  YData: number[];
  width?: number | string;
  height: number | string;
  title?: string;
}
export interface lineChartItem {
    title?:string;
  XData: string[];
  YData: number[];
  chartType:"line";
}
