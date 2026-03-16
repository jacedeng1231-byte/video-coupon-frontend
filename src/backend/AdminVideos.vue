<script>
import api from "../api/api";
import PageTitle from "../components/PageTitle.vue";

export default {
  components: { PageTitle },
  data() {
    return {
      videos: [],
      coupons: [],
      newVideo: {
        title: "",
        youtubeId: "",
        rewardCoupon: "",
      },
      editingVideo: null,
      loading: true,
    };
  },
  methods: {
    async fetchVideos() {
      try {
        const res = await api.get("/videos");
        this.videos = res.data;
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    },
    async fetchCoupons() {
      try {
        const res = await api.get("/coupons");
        this.coupons = res.data;
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    },
    async createVideo() {
      try {
        await api.post("/videos", this.newVideo);
        alert("影片新增成功");
        this.resetForm();
        this.fetchVideos();
      } catch (err) {
        console.error("Error creating video:", err);
      }
    },
    editVideo(video) {
      this.editingVideo = { ...video };
      // Keep only ID for select binding if rewardCoupon is populated
      if (typeof this.editingVideo.rewardCoupon === "object") {
        this.editingVideo.rewardCoupon = this.editingVideo.rewardCoupon._id;
      }
    },
    async updateVideo() {
      try {
        await api.put(`/videos/${this.editingVideo._id}`, this.editingVideo);
        alert("影片更新成功");
        this.cancelEdit();
        this.fetchVideos();
      } catch (err) {
        console.error("Error updating video:", err);
      }
    },
    async deleteVideo(id) {
      if (!confirm("確定要刪除這段影片嗎？")) return;
      try {
        await api.delete(`/videos/${id}`);
        alert("影片已刪除");
        this.fetchVideos();
      } catch (err) {
        console.error("Error deleting video:", err);
      }
    },
    resetForm() {
      this.newVideo = {
        title: "",
        youtubeId: "",
        rewardCoupon: "",
      };
    },
    cancelEdit() {
      this.editingVideo = null;
    },
  },
  async mounted() {
    this.loading = true;
    await Promise.all([this.fetchVideos(), this.fetchCoupons()]);
    this.loading = false;
  },
};
</script>

<template>
  <div class="container mt-4">
    <PageTitle title="影片管理" subtitle="VIDEO MANAGEMENT" />

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted fw-bold">正在載入影片資料...</p>
    </div>

    <!-- 內容 -->
    <div v-else>
      <!-- 新增 / 修改 表單 -->
      <div class="card p-3 mb-4">
      <h5>{{ editingVideo ? "修改影片" : "新增影片" }}</h5>
      <div v-if="!editingVideo">
        <input
          class="form-control mb-2"
          placeholder="標題"
          v-model="newVideo.title"
        />
        <input
          class="form-control mb-2"
          placeholder="YouTube ID"
          v-model="newVideo.youtubeId"
        />
        <select class="form-control mb-2" v-model="newVideo.rewardCoupon">
          <option value="">選擇獎勵優惠券</option>
          <option v-for="c in coupons" :key="c._id" :value="c._id">
            {{ c.title }}
          </option>
        </select>
        <button class="btn btn-primary" @click="createVideo">新增影片</button>
      </div>
      <div v-else>
        <input
          class="form-control mb-2"
          placeholder="標題"
          v-model="editingVideo.title"
        />
        <input
          class="form-control mb-2"
          placeholder="YouTube ID"
          v-model="editingVideo.youtubeId"
        />
        <select class="form-control mb-2" v-model="editingVideo.rewardCoupon">
          <option value="">選擇獎勵優惠券</option>
          <option v-for="c in coupons" :key="c._id" :value="c._id">
            {{ c.title }}
          </option>
        </select>
        <div class="d-flex gap-2">
          <button class="btn btn-success" @click="updateVideo">儲存修改</button>
          <button class="btn btn-secondary" @click="cancelEdit">取消</button>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>標題</th>
            <th>YouTube ID</th>
            <th>行為統計</th>
            <th>獎勵優惠券</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in videos" :key="v._id">
            <td>{{ v.title }}</td>
            <td>
              <code>{{ v.youtubeId }}</code>
            </td>
            <td>
              <div class="small">
                <div>觀看：<strong>{{ v.totalViews || 0 }}</strong></div>
                <div>領取：<strong>{{ v.totalClaims || 0 }}</strong></div>
              </div>
            </td>
            <td>{{ v.rewardCoupon?.title || "無" }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="editVideo(v)"
              >
                修改
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteVideo(v._id)"
              >
                刪除
              </button>
            </td>
          </tr>
          <tr v-if="videos.length === 0">
            <td colspan="5" class="text-center opacity-75">目前無影片</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>