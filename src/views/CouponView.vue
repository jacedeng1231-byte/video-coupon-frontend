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

              <p class="card-text mb-3">
                <span class="fs-6 opacity-75">折扣碼</span><br/>
                <code class="fs-4 d-block mt-1 coupon-code">{{ c.couponId.code }}</code>
              </p>

              <p class="small mb-auto opacity-75">
                到期日：
                {{ new Date(c.couponId.expireDate).toLocaleDateString() }}
              </p>

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
                class="btn btn-success w-100 mt-4"
                @click="useCoupon(c.couponId._id)"
              >
                使用優惠券
              </button>
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
  position: relative;
  overflow: hidden;
  background-color: #fff !important;
  border: 4px dashed var(--retro-primary) !important;
}

.coupon-card::before {
  content: '';
  position: absolute;
  top: 0; left: -50%;
  width: 200%; height: 100%;
  background: repeating-linear-gradient(
    45deg,
    rgba(1, 138, 200, 0.05),
    rgba(1, 138, 200, 0.05) 10px,
    transparent 10px,
    transparent 20px
  );
  pointer-events: none;
}

.coupon-code {
  color: var(--retro-text-light);
  background: var(--retro-accent);
  padding: 8px 12px;
  border: 3px solid var(--retro-dark);
  box-shadow: 4px 4px 0px var(--retro-dark);
  font-family: var(--retro-font-mono);
  font-weight: 900;
  letter-spacing: 2px;
  width: 100%;
  text-align: center;
}
</style>