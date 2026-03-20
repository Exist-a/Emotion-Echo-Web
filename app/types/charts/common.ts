import type { pieChartItem } from "../charts/pieChartType";
import type { lineChartItem } from "../charts/lineChartType";
import type { barChartItem } from "./barChartType";
export type ChartItem = pieChartItem | lineChartItem | barChartItem;
type chartType = "pie" | "line" | "bar";
