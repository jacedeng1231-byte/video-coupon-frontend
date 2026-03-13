<script>
import api from "../api/api";

export default {
  data() {
    return {
      videos: [],
      watched: {},
      loading: true,
      players: {}
    }
  },
  methods: {
    async loadVideos() {
      this.loading = true;
      try {
        const userId = localStorage.getItem("userId");
        const res = await api.get("/videos", {
          params: { userId }
        });
        this.videos = res.data;
        
        // Initialize watched status from backend
        this.videos.forEach(video => {
          if (video.isWatched) {
            this.watched[video._id] = true;
          }
        });
      } catch (err) {
        console.error("Failed to load videos:", err);
      } finally {
        this.loading = false;
        // Wait for next tick to ensure DOM is updated with player containers
        this.$nextTick(() => {
          this.initYouTubeAPI();
        });
      }
    },
    async claimCoupon(couponId) {
      const userId = localStorage.getItem("userId");
      await api.post("/coupons/claim", {
        userId,
        couponId,
      });
      alert("優惠券已領取");
      this.loadVideos(); // 重新載入以更新領取狀態
    },
    async markWatched(videoId) {
      const userId = localStorage.getItem("userId");
      try {
        await api.post("/videos/view", { userId, videoId });
        this.watched[videoId] = true;
      } catch (err) {
        console.error("Failed to record view:", err);
      }
    },
    initYouTubeAPI() {
      const initPlayers = () => {
        if (!window.YT || !window.YT.Player) return;
        
        this.videos.forEach((video) => {
          // Check if the container exists and player isn't already initialized
          if (document.getElementById(`player-${video._id}`) && !this.players[video._id]) {
            this.players[video._id] = new YT.Player(`player-${video._id}`, {
              videoId: video.youtubeId,
              events: {
                onStateChange: (event) => {
                  if (event.data === YT.PlayerState.ENDED) {
                    this.markWatched(video._id);
                  }
                },
              },
            });
          }
        });
      };

      if (window.YT && window.YT.Player) {
        initPlayers();
      } else {
        // If script is already loading but YT not ready yet
        const existingCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (existingCallback) existingCallback();
          initPlayers();
        };

        if (!document.getElementById("youtube-api-script")) {
          const tag = document.createElement("script");
          tag.id = "youtube-api-script";
          tag.src = "https://www.youtube.com/iframe_api";
          document.body.appendChild(tag);
        }
      }
    }
  },
  mounted() {
    this.loadVideos();
  }
};
</script>


<template>
  <div class="container mt-4">
    <h2 class="mb-4">活動影片</h2>

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-success"></div>
      <p>載入影片中...</p>
    </div>

    <div v-else>
      <div class="row" v-if="videos.length > 0">
        <div class="col-md-6 mb-4" v-for="video in video in videos" :key="video._id">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">
                {{ video.title }}
              </h5>

              <div
                :id="'player-' + video._id"
                style="width: 100%; height: 200px"
              ></div>
              
              <button
                v-if="video.isClaimed"
                class="btn btn-outline-secondary w-100 mt-3"
                disabled
              >
                已領取
              </button>

              <button
                v-else-if="watched[video._id]"
                class="btn btn-success w-100 mt-3"
                @click="claimCoupon(video.rewardCoupon)"
              >
                領取優惠券
              </button>

              <button v-else class="btn btn-secondary w-100 mt-3" disabled>
                請觀看影片後領取
              </button>

              <button
                class="btn btn-sm btn-outline-primary w-100 mt-2"
                @click="markWatched(video._id)"
              >
                模擬看完影片
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center mt-5 text-muted">
        <h5>目前沒有活動影片</h5>
        <p>可以稍後再回來看看有沒有新的活動喔！</p>
      </div>
    </div>
  </div>
</template>