<template>
  <div class="video-card">
    <!-- Video Player Area -->
    <div class="video-wrapper">
      <div :id="'player-' + video._id" class="player"></div>
    </div>
    
    <!-- Info & Actions Area -->
    <div class="video-info">
      <h3 class="video-title">{{ video.title }}</h3>
      
      <div class="status-badges mb-3">
        <span v-if="video.isClaimed" class="badge bg-success">✅ 獎勵已領取</span>
        <span v-else-if="watched" class="badge bg-primary">✨ 可領取獎勵</span>
      </div>

      <div class="action-buttons">
        <button 
          v-if="!video.isClaimed"
          class="btn btn-lg w-100 fw-bold shadow-sm"
          :class="watched ? 'btn-success' : 'btn-secondary disabled'"
          @click="watched ? $emit('claim') : null"
        >
          <span v-if="watched">🎁 領取專屬優惠券</span>
          <span v-else>🔒 觀看影片解鎖優惠</span>
        </button>
        
        <button 
          v-else
          class="btn btn-lg w-100 btn-outline-secondary fw-bold"
          disabled
        >
          🎉 此獎勵已領取
        </button>
      </div>
      
      <!-- Only for Testing/Dev: Simulate Watch Button -->
      <div class="mt-3 text-center" v-if="!watched && !video.isClaimed">
        <button class="btn btn-sm btn-outline-secondary" @click="$emit('simulateWatch')">
          (測試用) 模擬觀看完畢
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
.video-card {
  width: 100%;
  max-width: 100%; /* Ensure it does not bleed off mobile screens */
  background-color: var(--app-surface);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.video-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  position: relative;
}

.video-wrapper iframe,
.video-wrapper .player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  border: none;
  max-width: 100%;
}

.video-info {
  padding: 20px;
}

.video-title {
  font-size: 1.25rem;
  color: var(--app-text-main);
  font-weight: 800;
  margin-bottom: 8px;
  line-height: 1.4;
}

.status-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.action-buttons {
  margin-top: 10px;
}

.btn-secondary.disabled {
  background-color: #EAEAEA !important;
  color: #999 !important;
  opacity: 1;
  cursor: not-allowed;
  box-shadow: none !important;
}
</style>