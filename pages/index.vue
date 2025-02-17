<template>
  <div class="dashboard-content">
    <div class="header">
      <h1>GUI活动视频分析系统</h1>
      <!-- <p class="subtitle">Have a nice day</p> -->
    </div>

    <div class="card-container">
      <!-- 表单卡片 -->
      <div class="card form-card">
        <h2>任务信息</h2>
        <div class="form-group">
          <label>用户ID：</label>
          <input v-model="formData.user_id" type="text" placeholder="用户ID" @input="updateVideoUrl" :disabled="isLoading">
        </div>
        <div class="form-group">
          <label>追踪ID：</label>
          <input v-model="formData.trace_id" type="text" placeholder="追踪ID" @input="updateVideoUrl" :disabled="isLoading">
        </div>
        <div class="form-group">
          <label>视频URL：</label>
          <input v-model="formData.video_url" type="text" placeholder="视频URL" readonly class="readonly-input">
        </div>
        <div class="form-group">
          <label>任务描述：</label>
          <input v-model="formData.task_description" type="text" placeholder="任务描述" :disabled="isLoading">
        </div>
        <button @click="submitForm" class="submit-btn" :disabled="isLoading || isAnalyzing">
          <i class="fas fa-play"></i>
          {{ isLoading ? '提交中...' : (isAnalyzing ? '分析中...' : '开始分析') }}
        </button>
      </div>

      <!-- 状态卡片 -->
      <div class="card status-card" v-if="isAnalyzing || analysisComplete">
        <h2>分析状态</h2>
        <div class="progress-container" v-if="isAnalyzing">
          <div class="progress-info">
            <span>进度：{{ progressInfo.current_stepId }} / {{ progressInfo.total_action_num }}</span>
            <span>{{ progressInfo.running }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
        <div class="status-info" v-if="progressInfo.error_info">
          <div class="error-message">{{ progressInfo.error_info }}</div>
        </div>
        <div class="result-actions" v-if="analysisComplete">
          <button @click="downloadResult" class="download-btn">
            <i class="fas fa-download"></i> 下载分析结果
          </button>
          <button @click="downloadZipFile" class="download-btn zip-btn">
            <i class="fas fa-file-archive"></i> 下载图标文件
          </button>
        </div>
      </div>
    </div>

    <!-- 响应结果 -->
    <div v-if="response" class="card response-card" :class="{ error: isError }">
      <h2>{{ isError ? '错误信息' : '响应结果' }}</h2>
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<script setup>
import { useTaskState } from '../composables/useTaskState'

const taskState = useTaskState()
const {
  formData,
  response,
  isLoading,
  isError,
  isAnalyzing,
  analysisComplete,
  progressInfo,
  updateVideoUrl,
  checkProgress,
  downloadResult,
  downloadZipFile,
  submitForm
} = taskState

const progressPercentage = computed(() => {
  if (!progressInfo.value.total_action_num) return 0
  return (progressInfo.value.current_stepId / progressInfo.value.total_action_num) * 100
})

let progressTimer = null

// 开始进度检查
function startProgressCheck() {
  progressTimer = setInterval(checkProgress, 2000)
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (progressTimer) {
    clearInterval(progressTimer)
  }
})

// 初始化时更新一次URL
updateVideoUrl()
</script>

<style scoped>
.dashboard-content {
  padding: 30px;
}

.header {
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.card h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #1890ff;
  outline: none;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.readonly-input {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.submit-btn, .download-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.submit-btn {
  background: #1890ff;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #40a9ff;
}

.submit-btn:disabled {
  background: #bfbfbf;
  cursor: not-allowed;
}

.download-btn {
  background: #52c41a;
  color: white;
}

.download-btn:hover {
  background: #73d13d;
}

.progress-container {
  margin-top: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.progress-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1890ff;
  transition: width 0.3s ease;
}

.error-message {
  color: #ff4d4f;
  margin-top: 10px;
  padding: 10px;
  background: #fff1f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
}

.response-card {
  margin-top: 20px;
}

.response-card.error pre {
  color: #ff4d4f;
}

pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
  font-size: 14px;
  overflow-x: auto;
  margin: 0;
}

.result-actions {
  display: flex;
  gap: 10px;
}

.download-btn {
  flex: 1;
}

.zip-btn {
  background: #722ed1;
}

.zip-btn:hover {
  background: #9254de;
}
</style> 