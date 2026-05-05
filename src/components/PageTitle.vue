<template>
  <div class="page-header mb-4">
    <h2 class="page-header-title">{{ title }}</h2>
    <span class="page-header-subtitle" v-if="subtitle">{{ subtitle }}</span>
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
.page-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 12px;
  padding-left: 2px;
}

.page-header-title {
  color: var(--app-text-main);
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.4px;
}

.page-header-subtitle {
  color: var(--app-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

@media (max-width: 576px) {
  .page-header-title {
    font-size: 1.25rem;
  }
}
</style>
