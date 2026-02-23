<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  $hass: Object
});

const devices = ref([]);
const isLoading = ref(true);
const error = ref(null);

// 处理设备状态数据
const processDevices = (hass) => {
  if (!hass || !hass.states) {
    error.value = '无法获取设备状态';
    isLoading.value = false;
    return;
  }

  const deviceList = [];
  
  // 遍历所有状态实体
  for (const [entityId, stateObj] of Object.entries(hass.states)) {
    // 跳过非设备实体（可选，根据需要调整）
    if (!entityId.includes('.')) continue;

    deviceList.push({
      id: entityId,
      name: stateObj.attributes.friendly_name || entityId,
      state: stateObj.state,
      attributes: stateObj.attributes,
      lastUpdated: stateObj.last_updated
    });
  }

  devices.value = deviceList;
  isLoading.value = false;
  error.value = null;
};

// 监听$hass变化
watch(
  () => props.$hass,
  (newHass) => {
    if (newHass) {
      processDevices(newHass);
    }
  },
  { deep: true }
);

// 组件挂载时检查$hass是否已存在
onMounted(() => {
  if (props.$hass) {
    processDevices(props.$hass);
  }
});
</script>

<template>
  <div class="dashboard-container">
    <h1>智能家居设备状态</h1>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">
      加载设备状态中...
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <!-- 设备列表 -->
    <div v-else-if="devices.length > 0" class="devices-grid">
      <div v-for="device in devices" :key="device.id" class="device-card">
        <div class="device-name">{{ device.name }}</div>
        <div class="device-state" :class="`state-${device.state}`">
          {{ device.state }}
        </div>
        <div class="device-info">
          <small>{{ device.id }}</small>
          <small>{{ new Date(device.lastUpdated).toLocaleString() }}</small>
        </div>
      </div>
    </div>
    
    <!-- 无设备状态 -->
    <div v-else class="no-devices">
      未检测到设备
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.loading, .error, .no-devices {
  text-align: center;
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.device-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.device-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.device-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.device-state {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
  text-align: center;
}

.state-on {
  background-color: #4caf50;
  color: white;
}

.state-off {
  background-color: #9e9e9e;
  color: white;
}

.state-unavailable {
  background-color: #ff9800;
  color: white;
}

.device-info {
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
