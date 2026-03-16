<template>
  <div class="page-title-container mb-4">
    <h2 class="page-title-main">{{ title }}</h2>
    <span class="page-title-sub" v-if="subtitle">{{ subtitle }}</span>
  </div>
</template>

<script>
export default {
  name: "PageTitle",
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ""
    }
  }
}
</script>

<style scoped>
.page-title-container {
  display: flex;
  align-items: baseline;
  gap: 12px;
  border-bottom: 2px solid var(--app-border);
  padding-bottom: 12px;
  margin-top: 8px;
}

.page-title-main {
  color: var(--app-primary);
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-title-sub {
  color: var(--app-text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

@media (max-width: 576px) {
  .page-title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    border-bottom: 1px solid var(--app-border);
  }
  
  .page-title-main {
    font-size: 1.5rem;
  }
}
</style>
