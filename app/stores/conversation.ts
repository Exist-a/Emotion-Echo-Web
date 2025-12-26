import { defineStore } from "pinia";
import { ElNotification } from "element-plus";
import type { returnMsgType } from "~/types/commonType";
import type {
  conversationListItemDataType,
  conversationListItemType,
  conversationListLabelType,
} from "~/types/conversation/conversationListType";
import type { conversationMessagesType } from "~/types/conversation/conversationMessagesType";

// 存储历史对话id，当前对话信息
export const useConversationStore = defineStore("conversation", () => {
  const historyList = ref<conversationListItemDataType[] | null>([
    { id: 1, title: "会话1", dataTime: new Date(), isTop: false },
    {
      id: 2,
      title: "会话2这是一个很长的标题",
      dataTime: new Date(),
      isTop: true,
    },
    { id: 3, title: "会话3", dataTime: new Date(), isTop: false },
  ]);
  const labelHistoryList = ref<conversationListItemType[] | null>(null);

  const getHistoryList = () => {
    // 先调用后端接口获取value
    // 再将historyList分成splitHistoryList
    if (!historyList.value) {
      return null;
    }
    labelHistoryList.value = splitHistoryList(historyList.value);
    return historyList.value;
  };

  const getLabelHistoryList = () => {
    if (!historyList.value) {
      return null;
    }
    if (!labelHistoryList.value) {
      labelHistoryList.value = splitHistoryList(historyList.value);
    }
    return labelHistoryList.value;
  };

  // 创建一个函数用于根据时间分组
  const splitHistoryList = (
    list: conversationListItemDataType[]
  ): conversationListItemType[] => {
    // 先找出置顶,再根据时间
    const top: conversationListItemType = {
      label: "置顶",
      data: [],
    };
    const day: conversationListItemType = {
      label: "今天",
      data: [],
    };
    const week: conversationListItemType = {
      label: "一周内",
      data: [],
    };
    const month: conversationListItemType = {
      label: "三十天内",
      data: [],
    };
    const earlier: conversationListItemType = {
      label: "更早",
      data: [],
    };

    list.forEach((item) => {
      if (item.isTop) {
        top.data?.push(item);
      } else {
        const nowTimeStamp = Date.now();
        const itemTimeStamp = item.dataTime.getTime();
        // 修正：正确计算时间差（当前时间 - 项目时间 = 相差的毫秒数）
        const timeDist = nowTimeStamp - itemTimeStamp;

        if (timeDist <= 86400000) {
          // 24小时内
          day.data?.push(item);
        } else if (timeDist > 86400000 && timeDist <= 604800000) {
          // 1-7天
          week.data?.push(item);
        } else if (timeDist > 604800000 && timeDist <= 2592000000) {
          // 7-30天
          month.data?.push(item);
        } else {
          // 30天以上
          earlier.data?.push(item);
        }
      }
    });

    let res = [top, day, week, month, earlier];
    // 过滤空分组
    res = res.filter((item) => item.data && item.data.length > 0);
    return res;
  };

  // 辅助函数：根据日期获取时间分组标签（用于取消置顶时的归位）
  const getTimeLabelByDate = (date: Date): conversationListLabelType => {
    const nowTimeStamp = Date.now();
    const itemTimeStamp = date.getTime();
    const timeDist = nowTimeStamp - itemTimeStamp;

    if (timeDist <= 86400000) return "今天";
    if (timeDist <= 604800000) return "一周内";
    if (timeDist <= 2592000000) return "三十天内";
    return "更早";
  };

  // 会话记录置顶
  const handleConversationTop = (
    label: conversationListLabelType,
    id: number
  ): returnMsgType => {
    // 1. 校验基础数据存在性
    if (!labelHistoryList.value) {
      ElNotification({
        type: "error",
        title: "操作失败",
        message: "列表不存在",
      });
      return { isOk: false, msg: "列表不存在" };
    }

    // 2. 找到目标分组（当前项所在的分组）
    const targetGroup = labelHistoryList.value.find(
      (item) => item.label === label
    );
    if (!targetGroup || !targetGroup.data || targetGroup.data.length === 0) {
      ElNotification({
        type: "error",
        title: "操作失败",
        message: "列表不存在",
      });
      return { isOk: false, msg: "列表不存在" };
    }

    // 3. 找到目标项在分组 data 中的索引
    const targetIndex = targetGroup.data.findIndex((item) => item.id === id);
    if (targetIndex === -1) {
      ElNotification({
        type: "error",
        title: "操作失败",
        message: "对象不存在",
      });
      return { isOk: false, msg: "对象不存在" };
    }

    // 4. 获取目标项并取反 isTop 状态
    const targetItem = targetGroup.data[targetIndex]!;
    targetItem.isTop = !targetItem.isTop; // 取反状态

    // 5. 从原分组中删除目标项
    targetGroup.data.splice(targetIndex, 1);
    let msg = "";

    if (targetItem.isTop) {
      msg = "置顶成功";
      // 非置顶 → 改为置顶
      const firstItem = labelHistoryList.value[0];
      if (!firstItem || firstItem.label !== "置顶") {
        // 无置顶分组则创建并插入第0位
        const topGroup: conversationListItemType = {
          label: "置顶",
          data: [targetItem],
        };
        labelHistoryList.value.unshift(topGroup);
      } else {
        // 有置顶分组则直接添加
        firstItem.data
          ? firstItem.data.push(targetItem)
          : (firstItem.data = [targetItem]);
      }
    } else {
      // 置顶 → 取消置顶（按时间归位）
      msg = "取消置顶成功";

      // 2.1 计算目标项所属的时间分组标签
      const timeLabel = getTimeLabelByDate(targetItem.dataTime);

      // 2.2 查找是否已有该时间标签的分组
      const timeGroup = labelHistoryList.value.find(
        (item) => item.label === timeLabel
      );

      if (timeGroup) {
        // 有对应分组：直接添加到该分组的 data 中
        timeGroup.data
          ? timeGroup.data.push(targetItem)
          : (timeGroup.data = [targetItem]);
      } else {
        // 无对应分组：创建新分组并插入到正确的位置（保证标签顺序）
        const newTimeGroup: conversationListItemType = {
          label: timeLabel,
          data: [targetItem],
        };

        // 定义标签的正确顺序（用于确定插入位置）
        const labelOrder: conversationListLabelType[] = [
          "置顶",
          "今天",
          "一周内",
          "三十天内",
          "更早",
        ];
        // 找到当前标签在顺序中的索引
        const insertIndex = labelOrder.findIndex((item) => item === timeLabel);
        // 找到插入位置：在已有标签中，比当前标签顺序小的最后一个标签的下一位
        let actualInsertIndex = 0;
        for (let i = 0; i < labelHistoryList.value.length; i++) {
          const currentLabelIndex = labelOrder.findIndex(
            (item) => item === labelHistoryList.value![i]!.label
          );
          if (currentLabelIndex < insertIndex) {
            actualInsertIndex = i + 1;
          } else {
            break;
          }
        }

        // 插入新分组
        labelHistoryList.value.splice(actualInsertIndex, 0, newTimeGroup);
      }
    }

    // 最后：如果原分组删除项后数据为空，删除该空分组
    if (targetGroup.data.length === 0) {
      const groupIndex = labelHistoryList.value.findIndex(
        (item) => item.label === targetGroup.label
      );
      if (groupIndex !== -1) {
        labelHistoryList.value.splice(groupIndex, 1);
      }
    }

    // 触发成功通知
    ElNotification({
      type: "success",
      title: "操作成功",
      message: msg,
    });
    return { isOk: true, msg };
  };

  const handleEditTitle = (
    newTitle: string,
    label: conversationListLabelType,
    id: number
  ): returnMsgType => {
    // 1. 基础数据校验：校验标题非空、列表存在性
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      ElNotification({
        type: "error",
        title: "操作失败",
        message: "会话标题不能为空",
      });
      return { isOk: false, msg: "会话标题不能为空" };
    }

    if (!labelHistoryList.value) {
      ElNotification({
        type: "error",
        title: "操作失败",
        message: "会话历史列表不存在",
      });
      return { isOk: false, msg: "会话历史列表不存在" };
    }

    // 2. 找到目标分组（当前项所在的分组）
    const targetGroup = labelHistoryList.value.find(
      (item) => item.label === label
    );
    if (!targetGroup || !targetGroup.data || targetGroup.data.length === 0) {
      ElNotification({
        type: "error",
        title: "操作失败",
        message: "会话历史列表不存在",
      });
      return { isOk: false, msg: "会话历史列表不存在" };
    }

    // 3. 找到目标项在分组 data 中的索引
    const targetIndex = targetGroup.data.findIndex((item) => item.id === id);
    if (targetIndex === -1) {
      ElNotification({
        type: "error",
        title: "操作失败",
        message: "对象不存在",
      });
      return { isOk: false, msg: "对象不存在" };
    }

    // 4. 修改目标项的标题（利用Vue响应式自动更新视图）
    const targetItem = targetGroup.data[targetIndex]!;
    targetItem.title = trimmedTitle;

    // 触发成功通知
    ElNotification({
      type: "success",
      title: "操作成功",
      message: "修改成功",
    });
    return { isOk: true, msg: "修改成功" };
  };

  const handleDelConversation = (
    id: number,
    label: conversationListLabelType
  ): returnMsgType => {
    if (!labelHistoryList.value) {
      ElNotification({
        type: "error",
        title: "操作失败",
        message: "列表不存在",
      });
      return { isOk: false, msg: "列表不存在" };
    }

    const targetGroup = labelHistoryList.value.find(
      (item) => item.label === label
    );
    if (!targetGroup || !targetGroup.data) {
      ElNotification({
        type: "error",
        title: "操作失败",
        message: "对象不存在",
      });
      return { isOk: false, msg: "对象不存在" };
    }

    const targetIndex = targetGroup.data.findIndex((item) => item.id === id);
    if (targetIndex === -1) {
      ElNotification({
        type: "error",
        title: "操作失败",
        message: "对象不存在",
      });
      return { isOk: false, msg: "对象不存在" };
    }

    // 删除目标项
    targetGroup.data.splice(targetIndex, 1);

    // 如果分组为空，删除该分组
    if (targetGroup.data.length === 0) {
      const groupIndex = labelHistoryList.value.findIndex(
        (item) => item.label === targetGroup.label
      );
      if (groupIndex !== -1) {
        labelHistoryList.value.splice(groupIndex, 1);
      }
    }

    // 触发成功通知
    ElNotification({
      type: "success",
      title: "操作成功",
      message: "删除成功",
    });
    return { isOk: true, msg: "删除成功" };
  };

  //根据会话id请求对话内容
  const getConversationById = (id: number) => {
    //调用后端接口

    //这里先用模拟数据
    const data: conversationMessagesType = [
      {
        id: 1,
        sender: "user",
        sendTime: Date.now(),
        content: "hello",
        contentType: "text",
      },
      {
        id: 2,
        sender: "AI",
        sendTime: Date.now(),
        content: "你好啊，我是琛，是你的专属心理顾问",
        contentType: "text",
      },
      {
        id: 3,
        sender: "user",
        sendTime: Date.now(),
        content: "你能做什么？",
        contentType: "text",
      },
      {
        id: 4,
        sender: "AI",
        sendTime: Date.now(),
        content: "我可以陪你打三角洲，打MC，给你吃脆脆升，喝蜜雪冰城",
        contentType: "text",
      },
    ];
    return data;
  };
  return {
    getHistoryList,
    getLabelHistoryList,
    handleConversationTop,
    handleEditTitle,
    handleDelConversation,
    getConversationById
  };
});
