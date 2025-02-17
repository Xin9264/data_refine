<template>
  <div class="container">
    <h1>视频分析系统</h1>
    <div class="form-container">
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
      <button @click="submitForm" class="submit-btn" :disabled="isLoading">
        {{ isLoading ? '处理中...' : '提交分析' }}
      </button>
    </div>
    <div v-if="response" class="response-container" :class="{ error: isError }">
      <h2>{{ isError ? '错误信息' : '响应结果' }}：</h2>
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<script setup>
const formData = ref({
  user_id: 'a_test',
  trace_id: 'wx_0',
  video_url: 'http://cloud.groundhog.run/a_test/wx_0.mkv',
  task_description: 'copy & paste text from web browser into a word document'
})

const response = ref(null)
const isLoading = ref(false)
const isError = ref(false)

function updateVideoUrl() {
  formData.value.video_url = `http://cloud.groundhog.run/${formData.value.user_id}/${formData.value.trace_id}.mkv`
}

async function submitForm() {
  isLoading.value = true
  isError.value = false
  response.value = null
  
  try {
    console.log('发送请求数据:', {
      ...formData.value,
      debug: true
    })
    
    const res = await fetch('http://54.190.160.106:7777/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...formData.value,
        debug: true
      })
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}, statusText: ${res.statusText}`)
    }
    
    const data = await res.json()
    response.value = JSON.stringify(data, null, 2)
    isError.value = false
  } catch (error) {
    console.error('请求错误:', error)
    isError.value = true
    response.value = `请求出错：\n错误类型：${error.name}\n错误信息：${error.message}\n\n请确认：\n1. 服务器地址是否正确\n2. 网络连接是否正常\n3. 服务器是否在运行`
  } finally {
    isLoading.value = false
  }
}

// 初始化时更新一次URL
updateVideoUrl()
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.form-container {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:disabled {
  background-color: #f8f8f8;
  cursor: not-allowed;
}

.readonly-input {
  background-color: #f8f8f8;
  cursor: not-allowed;
}

.submit-btn {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
}

.submit-btn:hover:not(:disabled) {
  background: #45a049;
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.response-container {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.response-container.error {
  background: #fff5f5;
  border: 1px solid #ffebeb;
}

.error pre {
  color: #dc3545;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  margin: 0;
}
</style>
