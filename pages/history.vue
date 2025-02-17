<template>
  <div class="dashboard-content">
    <div class="header">
      <h1>历史记录</h1>
      <p class="subtitle">查看历史分析任务</p>
    </div>

    <div class="card history-card">
      <div class="history-filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" v-model="searchQuery" placeholder="搜索用户ID或追踪ID...">
        </div>
      </div>

      <div class="history-list">
        <div v-if="loading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          加载中...
        </div>
        <div v-else-if="historyItems.length === 0" class="empty-state">
          <i class="fas fa-history"></i>
          <p>暂无历史记录</p>
        </div>
        <div v-else class="history-items">
          <div v-for="item in filteredHistory" :key="item.id" class="history-item">
            <div class="item-header">
              <div class="item-info">
                <span class="user-id">用户ID: {{ item.user_id }}</span>
                <span class="trace-id">追踪ID: {{ item.trace_id }}</span>
              </div>
              <div class="item-status" :class="item.status">
                {{ item.status }}
              </div>
            </div>
            <div class="item-description">
              {{ item.task_description }}
            </div>
            <div v-if="item.status === 'running'" class="progress-container">
              <div class="progress-info">
                <span>进度：{{ item.progress.current }} / {{ item.progress.total }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getProgressPercentage(item) + '%' }"></div>
              </div>
            </div>
            <div class="item-footer">
              <span class="timestamp">
                <i class="fas fa-clock"></i>
                {{ formatDate(item.timestamp) }}
              </span>
              <button @click="downloadResult(item)" 
                      class="download-btn"
                      :disabled="item.status === 'running'">
                <i class="fas fa-download"></i>
                {{ item.status === 'running' ? '处理中...' : '下载结果' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTaskState } from '../composables/useTaskState'

const taskState = useTaskState()
const searchQuery = ref('')
const loading = ref(true)
const historyItems = ref([])

// 获取历史记录
async function fetchHistory() {
  try {
    const res = await fetch('/api/get_progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: taskState.formData.value.user_id,
        trace_id: taskState.formData.value.trace_id
      })
    })
    
    if (!res.ok) throw new Error('Failed to fetch history')
    
    const data = await res.json()
    // 将进度信息转换为历史记录格式
    historyItems.value = [{
      id: 1,
      user_id: taskState.formData.value.user_id,
      trace_id: taskState.formData.value.trace_id,
      task_description: data.task_description || taskState.formData.value.task_description || '未知任务',
      status: data.running,
      timestamp: new Date().getTime(),
      progress: {
        current: data.current_stepId,
        total: data.total_action_num,
        error: data.error_info
      }
    }]
  } catch (error) {
    console.error('获取历史记录失败:', error)
  } finally {
    loading.value = false
  }
}

const filteredHistory = computed(() => {
  if (!searchQuery.value) return historyItems.value
  const query = searchQuery.value.toLowerCase()
  return historyItems.value.filter(item => 
    item.user_id.toLowerCase().includes(query) ||
    item.trace_id.toLowerCase().includes(query) ||
    item.task_description.toLowerCase().includes(query)
  )
})

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

async function downloadResult(item) {
  try {
    const res = await fetch('/api/get_trace', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: item.user_id,
        trace_id: item.trace_id
      })
    })
    
    if (!res.ok) throw new Error('Failed to get trace data')
    
    const data = await res.json()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${item.user_id}_${item.trace_id}_trace.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Download error:', error)
    alert('下载失败：' + error.message)
  }
}

function getProgressPercentage(item) {
  if (!item.progress?.total) return 0
  return Math.round((item.progress.current / item.progress.total) * 100)
}

// 页面加载时获取历史记录
onMounted(() => {
  fetchHistory()
})

// 定期刷新历史记录
let refreshTimer = null
onMounted(() => {
  refreshTimer = setInterval(fetchHistory, 5000) // 每5秒刷新一次
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
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

.history-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.history-filters {
  margin-bottom: 20px;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-box input:focus {
  border-color: #1890ff;
  outline: none;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-state i, .empty-state i {
  font-size: 24px;
  margin-bottom: 10px;
  color: #999;
}

.history-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  transition: box-shadow 0.3s;
}

.history-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-info {
  display: flex;
  gap: 15px;
}

.user-id, .trace-id {
  color: #666;
  font-size: 14px;
}

.item-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.item-status.completed {
  background: #f6ffed;
  color: #52c41a;
}

.item-status.processing, .item-status.waiting {
  background: #e6f7ff;
  color: #1890ff;
}

.item-description {
  color: #333;
  margin-bottom: 10px;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  color: #999;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.download-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s;
}

.download-btn:hover {
  background: #40a9ff;
}

.download-btn:disabled {
  background: #bfbfbf;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 进度条样式 */
.progress-container {
  margin: 10px 0;
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
</style> 