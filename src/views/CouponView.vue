<template>
  <div class="container mt-4">
    <h2 class="mb-4">我的優惠券</h2>

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-success"></div>
      <p>載入優惠券中...</p>
    </div>

    <div v-else>
      <div class="row">
        <div
          v-for="c in coupons"
          :key="c._id"
          class="col-12 col-md-6 col-lg-4 mb-4"
        >
          <div class="card h-100 border-success shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold">
                {{ c.couponId.title }}
              </h5>

              <p class="card-text">
                折扣碼：
                <code class="fs-5">{{ c.couponId.code }}</code>
              </p>

              <p class="text-muted small mb-auto">
                到期日：
                {{ new Date(c.couponId.expireDate).toLocaleDateString() }}
              </p>

              <!-- 已使用狀態 -->
              <button
                v-if="c.isUsed"
                class="btn btn-secondary w-100 mt-3"
                disabled
              >
                已使用
              </button>

              <!-- 已過期狀態 -->
              <button
                v-else-if="new Date(c.couponId.expireDate) < new Date()"
                class="btn btn-danger w-100 mt-3"
                disabled
              >
                已過期
              </button>

              <!-- 已用完狀態 (次數上限) -->
              <button
                v-else-if="
                  c.couponId.maxUse > 0 &&
                  c.couponId.usedCount >= c.couponId.maxUse
                "
                class="btn btn-danger w-100 mt-3"
                disabled
              >
                已被用完
              </button>

              <!-- 可使用狀態 -->
              <button
                v-else
                class="btn btn-success w-100 mt-3 shadow-sm"
                @click="useCoupon(c.couponId._id)"
              >
                使用優惠券
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="coupons.length === 0" class="text-center mt-5 text-muted">
        <h5>尚未獲得任何折價券</h5>
        <p>可以前往影片中心觀看影片來獲得優惠券喔！</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api";

export default {
  data() {
    return {
      coupons: [],
      loading: true,
    };
  },
  methods: {
    async loadCoupons() {
      this.loading = true;
      try {
        const userId = localStorage.getItem("userId");
        const res = await api.get(`/coupons/my/${userId}`);
        this.coupons = res.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async useCoupon(couponId) {
      if (!confirm("確定要使用這張優惠券嗎？使用後將無法復原。")) return;
      try {
        const userId = localStorage.getItem("userId");
        await api.post("/coupons/use", { userId, couponId });
        alert("優惠券使用成功！");
        this.loadCoupons();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "使用失敗");
      }
    },
  },
  mounted() {
    this.loadCoupons();
  },
};
</script>

<style scoped>
.coupon-card {
  border: 2px dashed #06c755;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 10px;
  background: #f6fff8;
}
</style>