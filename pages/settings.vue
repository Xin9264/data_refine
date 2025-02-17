<template>
  <div class="dashboard-content">
    <div class="header">
      <h1>系统设置</h1>
      <p class="subtitle">配置系统参数</p>
    </div>

    <div class="settings-container">
      <!-- 服务器设置 -->
      <div class="card settings-card">
        <h2>服务器配置</h2>
        <div class="form-group">
          <label>API 服务器地址</label>
          <input 
            v-model="settings.apiServer" 
            type="text" 
            placeholder="输入服务器地址"
          >
          <span class="help-text">示例: http://54.190.160.106:7777</span>
        </div>
        <div class="form-group">
          <label>调试模式</label>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              id="debug-mode" 
              v-model="settings.debugMode"
            >
            <label for="debug-mode"></label>
          </div>
          <span class="help-text">开启后将显示详细的调试信息</span>
        </div>
      </div>

      <!-- 分析设置 -->
      <div class="card settings-card">
        <h2>分析配置</h2>
        <div class="form-group">
          <label>进度检查间隔 (秒)</label>
          <input 
            v-model.number="settings.progressInterval" 
            type="number" 
            min="1" 
            max="10"
          >
          <span class="help-text">设置检查分析进度的时间间隔</span>
        </div>
        <div class="form-group">
          <label>自动下载结果</label>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              id="auto-download" 
              v-model="settings.autoDownload"
            >
            <label for="auto-download"></label>
          </div>
          <span class="help-text">分析完成后自动下载结果文件</span>
        </div>
      </div>

      <!-- 界面设置 -->
      <div class="card settings-card">
        <h2>界面设置</h2>
        <div class="form-group">
          <label>主题色</label>
          <div class="color-picker">
            <div 
              v-for="color in themeColors" 
              :key="color.value"
              class="color-option"
              :class="{ active: settings.theme === color.value }"
              :style="{ backgroundColor: color.color }"
              @click="settings.theme = color.value"
            ></div>
          </div>
        </div>
        <div class="form-group">
          <label>紧凑模式</label>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              id="compact-mode" 
              v-model="settings.compactMode"
            >
            <label for="compact-mode"></label>
          </div>
          <span class="help-text">使用更紧凑的界面布局</span>
        </div>
      </div>

      <div class="settings-actions">
        <button @click="saveSettings" class="save-btn">
          <i class="fas fa-save"></i>
          保存设置
        </button>
        <button @click="resetSettings" class="reset-btn">
          <i class="fas fa-undo"></i>
          恢复默认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const defaultSettings = {
  apiServer: 'http://54.190.160.106:7777',
  debugMode: true,
  progressInterval: 2,
  autoDownload: false,
  theme: 'blue',
  compactMode: false
}

const settings = ref({ ...defaultSettings })

const themeColors = [
  { value: 'blue', color: '#1890ff' },
  { value: 'green', color: '#52c41a' },
  { value: 'purple', color: '#722ed1' },
  { value: 'red', color: '#f5222d' },
  { value: 'orange', color: '#fa8c16' }
]

// 加载设置
onMounted(() => {
  const savedSettings = localStorage.getItem('appSettings')
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings)
  }
})

function saveSettings() {
  localStorage.setItem('appSettings', JSON.stringify(settings.value))
  // 这里可以添加保存成功的提示
  alert('设置已保存')
}

function resetSettings() {
  if (confirm('确定要恢复默认设置吗？')) {
    settings.value = { ...defaultSettings }
    localStorage.removeItem('appSettings')
    alert('已恢复默认设置')
  }
}
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

.settings-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.settings-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.settings-card h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #1890ff;
  outline: none;
}

.help-text {
  display: block;
  margin-top: 4px;
  color: #999;
  font-size: 12px;
}

/* 开关样式 */
.toggle-switch {
  position: relative;
  width: 50px;
  height: 24px;
  margin: 8px 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ddd;
  transition: .4s;
  border-radius: 24px;
}

.toggle-switch label:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle-switch input:checked + label {
  background-color: #1890ff;
}

.toggle-switch input:checked + label:before {
  transform: translateX(26px);
}

/* 颜色选择器 */
.color-picker {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  box-shadow: 0 0 0 2px white, 0 0 0 4px currentColor;
}

/* 按钮样式 */
.settings-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.save-btn, .reset-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.save-btn {
  background: #1890ff;
  color: white;
}

.save-btn:hover {
  background: #40a9ff;
}

.reset-btn {
  background: #f5f5f5;
  color: #666;
}

.reset-btn:hover {
  background: #e8e8e8;
}
</style> 