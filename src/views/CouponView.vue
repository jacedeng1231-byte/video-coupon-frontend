<template>
  <div class="container mt-4">
    <PageTitle title="我的優惠券" subtitle="MY COUPONS" />

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
          <div class="card coupon-card h-100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold">
                {{ c.couponId.title }}
              </h5>

              <p class="card-text mb-1">
                <span class="fs-6 text-muted">折扣碼</span><br/>
                <code class="fs-4 d-block mt-2 coupon-code">{{ c.couponId.code }}</code>
              </p>

              <p class="small mb-3 text-muted">
                到期日：
                {{ new Date(c.couponId.expireDate).toLocaleDateString() }}
              </p>

              <div class="ticket-divider"></div>

              <div class="mt-auto">

              <!-- 已使用狀態 -->
              <button
                v-if="c.isUsed"
                class="btn btn-secondary w-100 mt-4"
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
                class="btn btn-success w-100"
                @click="useCoupon(c.couponId._id)"
              >
                使用優惠券
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="coupons.length === 0" class="text-center mt-5 opacity-75">
        <h5>尚未獲得任何折價券</h5>
        <p>可以前往影片中心觀看影片來獲得優惠券喔！</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api";
import PageTitle from "../components/PageTitle.vue";

export default {
  components: { PageTitle },
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
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--app-surface) !important;
  box-shadow: var(--shadow-md);
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.coupon-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-title {
  color: var(--app-text-main);
  font-size: 1.1rem;
}

.coupon-code {
  color: var(--app-primary);
  background: #F8F9FA;
  padding: 12px;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-weight: 700;
  letter-spacing: 1px;
  width: 100%;
  text-align: center;
  border: 1px dashed var(--app-border);
}

/* Add a subtle visual divider to mimic a ticket */
.coupon-card .card-body {
  position: relative;
}

.ticket-divider {
  border-top: 2px dashed var(--app-border);
  margin: 16px -16px;
  position: relative;
}

.ticket-divider::before, .ticket-divider::after {
  content: '';
  position: absolute;
  top: -10px;
  width: 20px;
  height: 20px;
  background-color: var(--app-bg);
  border-radius: 50%;
}

.ticket-divider::before {
  left: -26px;
  box-shadow: inset -1px 0 0 rgba(0,0,0,0.02);
}

.ticket-divider::after {
  right: -26px;
  box-shadow: inset 1px 0 0 rgba(0,0,0,0.02);
}
</style>