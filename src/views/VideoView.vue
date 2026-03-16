<template>
  <div class="container mt-4">
    <PageTitle title="影片中心" subtitle="VIDEO CENTER" />

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-success"></div>
      <p>載入影片中...</p>
    </div>

    <div v-else>
      <div class="row" v-if="videos.length > 0">
        <div class="col-12 col-xl-6 mb-5" v-for="video in videos" :key="video._id">
          <RetroTV
            :video="video"
            :watched="watched[video._id]"
            @claim="claimCoupon(video.rewardCoupon, video._id)"
            @simulateWatch="markWatched(video._id)"
          />
        </div>
      </div>

      <div v-else class="text-center mt-5 opacity-75">
        <h5>目前沒有活動影片</h5>
        <p>可以稍後再回來看看有沒有新的活動喔！</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api";
import RetroTV from "../components/RetroTV.vue";
import PageTitle from "../components/PageTitle.vue";

export default {
  data() {
    return {
      videos: [],
      watched: {},
      loading: true,
      players: {},
      requiredWatchSeconds: 5, // 新增：設定觀看幾秒後即可領取
    };
  },
  components: { RetroTV, PageTitle },
  methods: {
    async loadVideos() {
      // 0. 清理舊的播放器實例，避免重整後容器抓不到
      Object.values(this.players).forEach((player) => {
        if (player && typeof player.destroy === "function") {
          player.destroy();
        }
      });
      this.players = {};

      this.loading = true;
      try {
        const userId = localStorage.getItem("userId");
        const res = await api.get("/videos", {
          params: { userId },
        });
        this.videos = res.data;

        // Initialize watched status from backend
        this.videos.forEach((video) => {
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
    async claimCoupon(couponId, fromVideoId) {
      const userId = localStorage.getItem("userId");
      await api.post("/coupons/claim", {
        userId,
        couponId,
        fromVideoId,
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
          if (
            document.getElementById(`player-${video._id}`) &&
            !this.players[video._id]
          ) {
            this.players[video._id] = new YT.Player(`player-${video._id}`, {
              videoId: video.youtubeId,
              width: "100%",
              height: "100%",
              playerVars: {
                rel: 0,
                playsinline: 1
              },
              events: {
                onStateChange: (event) => {
                  const player = event.target;
                  if (event.data === YT.PlayerState.PLAYING) {
                    // Start checking time every second
                    player.timeChecker = setInterval(() => {
                      if (player.getCurrentTime() >= this.requiredWatchSeconds && !this.watched[video._id]) {
                        this.markWatched(video._id);
                        clearInterval(player.timeChecker);
                      }
                    }, 1000);
                  } else {
                    // Clear interval if paused, ended, or buffering
                    if (player.timeChecker) {
                      clearInterval(player.timeChecker);
                    }
                    // Fallback: If it somehow reached the end without triggering the interval
                    if (event.data === YT.PlayerState.ENDED && !this.watched[video._id]) {
                      this.markWatched(video._id);
                    }
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
    },
  },
  mounted() {
    this.loadVideos();
  },
};
</script>
