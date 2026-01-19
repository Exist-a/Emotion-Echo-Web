<template>
  <el-button @click="goBackDialogVisible = true" style="position: fixed;left: 5px;top: 5px;" type="primary">返回题目列表</el-button>
  <!-- 加载占位：避免数据未加载时白屏/报错 -->
  <div v-if="loading" class="loading-container">
    <el-skeleton :rows="5" animated />
  </div>

  <!-- 答题页面：数据加载完成后显示 -->
  <div v-else class="question-container">
    <h1 class="title">{{ survey.title }}</h1>
    <p class="description" v-if="survey.description">
      {{ survey.description }}
    </p>
    <!-- 遍历题目，绑定每个题目的选中值 -->
    <div
      v-for="question in survey.questions"
      :key="question.id"
      class="question-block"
    >
      <h3 class="question-text">{{ question.id }}. {{ question.name }}</h3>
      <!-- 核心：绑定v-model收集每个题目的选中值 -->
      <el-radio-group v-model="answerMap[question.id]" class="radio-group">
        <el-radio
          v-for="option in question.options"
          :key="option.id"
          :value="option.id"
          class="radio-option"
        >
          {{ option.text }}
        </el-radio>
      </el-radio-group>
    </div>

    <!-- 提交按钮：收集所有答题数据 -->
    <div class="submit-btn-wrap">
      <el-button
        type="primary"
        size="large"
        @click="handleSubmit"
        :disabled="!hasAnsweredAll"
      >
        提交答案
      </el-button>
    </div>
  </div>

  <el-dialog v-model="goBackDialogVisible" title="提示" width="500">
    <span>是否返回？答题情况不会保存</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="goBackDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="navigateTo({ name: 'question' })">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { surveyData } from "~/types/question/questionType";

const route = useRoute();
const loading = ref(true);
const survey = ref<surveyData>({ id: 0, title: "", questions: [] });
const goBackDialogVisible = ref(false);
const questionBank: surveyData = {
  id: 1,
  title: "心理健康量表",
  description: "请根据您的实际情况选择最符合的选项。",
  questions: [
    {
      id: 1,
      name: "你最近是否感到情绪低落？",
      options: [
        { id: 1, text: "从不" },
        { id: 2, text: "偶尔" },
        { id: 3, text: "经常" },
        { id: 4, text: "总是" },
      ],
    },
    {
      id: 2,
      name: "你是否对平时感兴趣的事物失去兴趣？",
      options: [
        { id: 1, text: "从不" },
        { id: 2, text: "偶尔" },
        { id: 3, text: "经常" },
        { id: 4, text: "总是" },
      ],
    },
    {
      id: 3,
      name: "你是否对平时感兴趣的事物失去兴趣？",
      options: [
        { id: 1, text: "从不" },
        { id: 2, text: "偶尔" },
        { id: 3, text: "经常" },
        { id: 4, text: "总是" },
      ],
    },
    {
      id: 4,
      name: "你是否对平时感兴趣的事物失去兴趣？",
      options: [
        { id: 1, text: "从不" },
        { id: 2, text: "偶尔" },
        { id: 3, text: "经常" },
        { id: 4, text: "总是" },
      ],
    },
    {
      id: 5,
      name: "你是否对平时感兴趣的事物失去兴趣？",
      options: [
        { id: 1, text: "从不" },
        { id: 2, text: "偶尔" },
        { id: 3, text: "经常" },
        { id: 4, text: "总是" },
      ],
    },
  ],
};

// 收集每个题目的选中值
const answerMap = ref<Record<number, number>>({});

//根据路由id获取题目详情
const getQuestionDetail = async (id: string | number) => {
  loading.value = true;
  try {
    // 实际项目中替换为接口请求
    const target = questionBank;
    if (target) {
      survey.value = target;
      // 初始化答题映射
      target.questions.forEach((q) => {
        if (!answerMap.value[q.id]) answerMap.value[q.id] = 0;
      });
    } else {
      ElMessage.error("题目不存在");
    }
  } catch (err) {
    ElMessage.error("获取题目失败");
  } finally {
    loading.value = false;
  }
};

// 6. 计算属性：判断是否所有题目都已作答（控制提交按钮禁用）
const hasAnsweredAll = computed(() => {
  const questions = survey.value.questions;
  if (questions.length === 0) return false;
  return questions.every((q) => answerMap.value[q.id]! > 0);
});

// 7. 提交答题数据逻辑
const handleSubmit = () => {
  const submitData = {
    questionnaireId: survey.value.id,
    answers: answerMap.value,
  };
  console.log("提交的答题数据：", submitData);

  ElMessage.success("答题提交成功！");
};
const backToQuesList = () => {
  //先弹窗
};

// 页面挂载时获取题目详情
onMounted(() => {
  const questionId = route.params.id as string | number;
  if (questionId) {
    // 后端沟通获取数据
    getQuestionDetail(questionId);
  } else {
    ElMessage.warning("缺少题目ID");
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
.question-container {
  width: 70%;
  margin: 0 auto;
  background-color: #fff;
  padding: 40px;
  min-height: 80vh;
  border-radius: $radius-lg;
  box-shadow: $box-shadow;
  .title {
    text-align: center;
    margin-bottom: 40px;
    font-size: 30px;
    color: #303133;
  }
  .description {
    text-align: center;
    margin-bottom: 30px;
    font-size: 16px;
    color: #909399;
  }
  .question-block {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e6e6e6;

    .question-text {
      margin-bottom: 15px;
      font-size: 18px;
      color: #606266;
    }

    .radio-group {
      display: flex; // 选项横向排列，更美观
      gap: 20px; // 选项间距
      flex-wrap: wrap; // 小屏自动换行

      .radio-option {
        margin: 0 !important; // 重置Element默认间距
        font-size: 16px;
      }
    }
  }

  .submit-btn-wrap {
    text-align: center;
    margin-top: 40px;
  }
}

.loading-container {
  width: 70%;
  margin: 40px auto;
  padding: 20px;
}
</style>
