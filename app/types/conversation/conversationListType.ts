export type conversationListItemDataType = {
  id: number;
  title: string;
  dataTime: Date;
  isTop: boolean;
};
export type conversationListLabelType =
  | "今天"
  | "一周内"
  | "三十天内"
  | "更早"
  | "置顶";
export interface conversationListItemType {
  label: conversationListLabelType
  data: conversationListItemDataType[] | null;
  // activeId:Ref<number>
}
