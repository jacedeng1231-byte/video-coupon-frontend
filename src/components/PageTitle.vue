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
  gap: 15px;
  border-bottom: 4px solid var(--retro-dark);
  padding-bottom: 10px;
}

.page-title-main {
  color: var(--retro-primary);
  font-family: var(--retro-font-display);
  font-size: 2.5rem;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: none; /* Remove global text shadow */
}

.page-title-sub {
  color: var(--retro-accent);
  font-family: var(--retro-font-mono);
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
  background-color: var(--retro-dark);
  padding: 4px 10px;
  box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
}

@media (max-width: 576px) {
  .page-title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
