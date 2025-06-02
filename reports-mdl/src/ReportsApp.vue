<template>
  <div class="reports-app">
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ReportsApp',
  setup() {
    return {};
  }
});
</script>

<style scoped>
.reports-app {
  height: 100%;
  width: 100%;
}
</style>