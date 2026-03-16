<template>
  <div class="container mt-4">
    <div v-if="user" class="text-center mb-5 p-4 card">
      <img
        v-if="user.pictureUrl"
        :src="user.pictureUrl"
        class="mb-3 retro-avatar"
        alt="User Avatar"
      />
      <h3 class="fw-bold mb-1">歡迎, {{ user.displayName }}!</h3>
      <p>很高興見到您來到 LINE 活動中心</p>
    </div>

    <PageTitle v-else title="LINE 活動中心" subtitle="LINE ACTIVITY CENTER" />

    <div v-if="latestVideo" class="mt-4 d-flex flex-column align-items-center">
      <h4 class="mb-4 text-center">🌟 最新主打影片</h4>
      <RetroTV
        :video="latestVideo"
        :watched="latestVideo.isWatched"
        @claim="claimCoupon(latestVideo.rewardCoupon, latestVideo._id)"
        @simulateWatch="markWatched(latestVideo._id)"
      />
      <!-- Player container for RetroTV -->
      <div class="d-none">
        <div :id="'player-' + latestVideo._id"></div>
      </div>
    </div>

    <!-- Actions -->
    <div class="row align-items-center justify-content-center g-3 mt-4 mb-5">
      <div class="col-12 col-md-5 text-center">
        <router-link to="/videos" class="btn btn-primary btn-lg w-100 py-3 text-white fw-bold d-flex align-items-center justify-content-center gap-2">
          <span>🎬</span> 查看更多影片活動
        </router-link>
      </div>
      <div class="col-12 col-md-5 text-center">
        <router-link to="/coupons" class="btn btn-outline-secondary btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
          <span>🎁</span> 我的專屬優惠券
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api";
import { initLiff } from "../liff/liffInit";
import RetroTV from "../components/RetroTV.vue";
import PageTitle from "../components/PageTitle.vue";

export default {
  data() {
    return {
      user: null,
      latestVideo: null,
      player: null,
      requiredWatchSeconds: 5, // 新增：設定觀看幾秒後即可領取
    };
  },
  components: { RetroTV, PageTitle },

  methods: {
    async fetchLatestVideo() {
      try {
        const userId = localStorage.getItem("userId") || "";
        const res = await api.get("/videos/latest", {
          params: { userId },
        });
        this.latestVideo = res.data;
        
        if (this.latestVideo) {
          this.$nextTick(() => {
            this.initYouTubeAPI();
          });
        }
      } catch (err) {
        console.error("HomeView fetch video error:", err);
      }
    },
    async claimCoupon(coupon, fromVideoId) {
      if (!coupon) return;
      
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("請先登入");
        return;
      }

      try {
        await api.post("/coupons/claim", {
          userId,
          couponId: coupon._id || coupon, // 處理 populated 或是 ObjectId 的兩種可能性
          fromVideoId,
        });
        alert("優惠券已領取");
        this.fetchLatestVideo(); // 重新載入以更新領取狀態
      } catch (err) {
        alert(err.response?.data?.message || "領取失敗");
        console.error("Failed to claim:", err);
      }
    },
    async markWatched(videoId) {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        await api.post("/videos/view", { userId, videoId });
        if (this.latestVideo && this.latestVideo._id === videoId) {
          this.latestVideo.isWatched = true;
        }
      } catch (err) {
        console.error("Failed to record view:", err);
      }
    },
    initYouTubeAPI() {
      const initPlayer = () => {
        if (!window.YT || !window.YT.Player || !this.latestVideo) return;
        
        const playerId = `player-${this.latestVideo._id}`;
        
        if (this.player && typeof this.player.destroy === "function") {
          this.player.destroy();
        }

        if (document.getElementById(playerId)) {
          this.player = new YT.Player(playerId, {
            videoId: this.latestVideo.youtubeId,
            events: {
              onStateChange: (event) => {
                const player = event.target;
                if (event.data === YT.PlayerState.PLAYING) {
                  player.timeChecker = setInterval(() => {
                    if (player.getCurrentTime() >= this.requiredWatchSeconds && !this.latestVideo.isWatched) {
                      this.markWatched(this.latestVideo._id);
                      clearInterval(player.timeChecker);
                    }
                  }, 1000);
                } else {
                  if (player.timeChecker) {
                    clearInterval(player.timeChecker);
                  }
                  if (event.data === YT.PlayerState.ENDED && !this.latestVideo.isWatched) {
                    this.markWatched(this.latestVideo._id);
                  }
                }
              },
            },
          });
        }
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        const existingCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (existingCallback) existingCallback();
          initPlayer();
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

  async mounted() {
    try {
      let profile;

      if (import.meta.env.DEV) {
        profile = {
          displayName: "Local User",
          pictureUrl:
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        };
      } else {
        profile = await initLiff();
      }

      this.user = profile;
      
      if (this.user && this.user.userId) {
        localStorage.setItem("userId", this.user.userId);
      }

      this.fetchLatestVideo();
    } catch (err) {
      console.error("HomeView error:", err);
    }
  },
};
</script>

<style scoped>
.retro-avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 4px 4px 0px var(--retro-dark);
}
</style>