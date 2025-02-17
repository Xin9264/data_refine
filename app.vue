<template>
  <div class="dashboard">
    <div class="sidebar">
      <div class="logo">视频分析系统</div>
      <div class="menu">
        <NuxtLink to="/" class="menu-item" active-class="active">
          <i class="fas fa-home"></i>
          控制面板
        </NuxtLink>
        <NuxtLink to="/history" class="menu-item" active-class="active">
          <i class="fas fa-history"></i>
          历史记录
        </NuxtLink>
        <NuxtLink to="/settings" class="menu-item" active-class="active">
          <i class="fas fa-cog"></i>
          设置
        </NuxtLink>
      </div>
    </div>

    <div class="main-content">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
/* 全局样式 */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 布局样式 */
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.sidebar {
  width: 250px;
  background: white;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 40px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: #f5f7fa;
  color: #1890ff;
}

.menu-item.active {
  background: #f0f7ff;
  color: #1890ff;
}

.menu-item i {
  width: 20px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
}
</style>
