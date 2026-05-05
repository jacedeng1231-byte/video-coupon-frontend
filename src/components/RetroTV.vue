<template>
  <div class="video-item-card">
    <!-- Video Player Area -->
    <div class="video-item-player-container">
      <div :id="'player-' + video._id" class="video-item-player"></div>
    </div>
    
    <!-- Info & Actions Area -->
    <div class="video-item-content">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h3 class="video-item-title">{{ video.title }}</h3>
        <div class="video-item-badge-container">
          <span v-if="video.isClaimed" class="badge bg-success">已領取</span>
          <span v-else-if="watched" class="badge bg-primary">可領取</span>
        </div>
      </div>
      
      <div class="video-item-actions mt-3">
        <button 
          v-if="!video.isClaimed"
          class="btn w-100 fw-bold"
          :class="watched ? 'btn-primary' : 'btn-outline-secondary disabled-style'"
          @click="watched ? $emit('claim') : null"
        >
          <span v-if="watched">🎁 點我領取優惠券</span>
          <span v-else>觀看影片解鎖優惠</span>
        </button>
        
        <button 
          v-else
          class="btn w-100 btn-outline-secondary fw-bold"
          disabled
        >
          已領取此獎勵
        </button>
      </div>
      
      <!-- Only for Testing/Dev: Simulate Watch Button -->
      <div class="mt-2 text-center" v-if="!watched && !video.isClaimed">
        <button class="btn btn-sm btn-link text-muted text-decoration-none" @click="$emit('simulateWatch')">
          <small>(測試) 直接完成觀看</small>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    video: Object,
    watched: Boolean
  }
};
</script>

<style scoped>
.video-item-card {
  width: 100%;
  background-color: var(--app-surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.video-item-player-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  position: relative;
}

.video-item-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  border: none;
}

.video-item-content {
  padding: 16px;
}

.video-item-title {
  font-size: 1.05rem;
  color: var(--app-text-main);
  font-weight: 700;
  margin: 0;
  line-height: 1.4;
  flex: 1;
  padding-right: 8px;
}

.video-item-badge-container {
  flex-shrink: 0;
}

.disabled-style {
  background-color: #F2F2F7 !important;
  color: #AEAEB2 !important;
  border-color: transparent !important;
  opacity: 1 !important;
  cursor: default;
}

.btn-link {
  font-size: 0.8rem;
}
</style>
