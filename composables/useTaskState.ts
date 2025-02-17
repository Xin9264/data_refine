import { ref, computed } from 'vue'

// 创建一个单例状态
const formData = ref({
  user_id: 'a_test',
  trace_id: 'wx_0',
  video_url: 'http://cloud.groundhog.run/a_test/wx_0.mkv',
  task_description: 'copy & paste text from web browser into a word document'
})

const response = ref(null)
const isLoading = ref(false)
const isError = ref(false)
const isAnalyzing = ref(false)
const analysisComplete = ref(false)
const progressInfo = ref({
  current_stepId: 0,
  total_action_num: 100,
  running: 'waiting',
  error_info: null
})

export function useTaskState() {
  function updateVideoUrl() {
    formData.value.video_url = `http://cloud.groundhog.run/${formData.value.user_id}/${formData.value.trace_id}.mkv`
  }

  async function checkProgress() {
    try {
      const res = await fetch('/api/get_progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: formData.value.user_id,
          trace_id: formData.value.trace_id
        })
      })
      
      if (!res.ok) throw new Error('Progress check failed')
      
      const data = await res.json()
      progressInfo.value = data
      
      if (data.running === 'completed') {
        isAnalyzing.value = false
        analysisComplete.value = true
        return true
      } else if (data.error_info) {
        isAnalyzing.value = false
        return false
      }
      return null
    } catch (error) {
      console.error('Progress check error:', error)
      return false
    }
  }

  async function downloadResult() {
    try {
      const res = await fetch('/api/get_trace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: formData.value.user_id,
          trace_id: formData.value.trace_id
        })
      })
      
      if (!res.ok) throw new Error('Failed to get trace data')
      
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formData.value.user_id}_${formData.value.trace_id}_trace.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('下载失败：' + error.message)
    }
  }

  async function submitForm() {
    isLoading.value = true
    isError.value = false
    response.value = null
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData.value,
          debug: true
        })
      })
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      response.value = JSON.stringify(data, null, 2)
      isAnalyzing.value = true
      analysisComplete.value = false
    } catch (error) {
      console.error('提交错误:', error)
      isError.value = true
      response.value = `请求出错：\n错误类型：${error.name}\n错误信息：${error.message}`
    } finally {
      isLoading.value = false
    }
  }

  return {
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
    submitForm
  }
} 