<template>
  <div class="container mt-4">
    <PageTitle title="我的優惠券" subtitle="MY COUPONS" />

    <div v-if="loading" class="text-center mt-5 py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted fw-bold">載入優惠券中...</p>
    </div>

    <div v-else>
      <div class="row g-3" v-if="coupons.length > 0">
        <div
          v-for="c in coupons"
          :key="c._id"
          class="col-12 col-md-6"
        >
          <div class="coupon-ticket h-100" :class="{ 'is-used': c.isUsed || isExpired(c) || isSoldOut(c) }">
            <div class="coupon-ticket-main">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h5 class="coupon-title">{{ c.couponId.title }}</h5>
                <span v-if="c.isUsed" class="badge bg-secondary">已使用</span>
                <span v-else-if="isExpired(c)" class="badge bg-danger">已過期</span>
                <span v-else-if="isSoldOut(c)" class="badge bg-danger">已用完</span>
                <span v-else class="badge bg-primary">未使用</span>
              </div>

              <div class="coupon-code-box">
                <span class="coupon-code-label">折扣碼</span>
                <code class="coupon-code-value">{{ c.couponId.code }}</code>
              </div>
            </div>

            <div class="coupon-ticket-divider">
              <div class="dot-left"></div>
              <div class="dot-right"></div>
            </div>

            <div class="coupon-ticket-footer">
              <div class="coupon-meta">
                <span class="coupon-expiry">效期至 {{ formatDate(c.couponId.expireDate) }}</span>
              </div>

              <button
                v-if="!c.isUsed && !isExpired(c) && !isSoldOut(c)"
                class="btn btn-primary w-100 mt-3"
                @click="useCoupon(c.couponId._id)"
              >
                立即使用
              </button>
              <button
                v-else
                class="btn btn-outline-secondary w-100 mt-3 disabled-btn"
                disabled
              >
                {{ getDisabledText(c) }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center mt-5 py-5 opacity-75">
        <div class="fs-1 mb-3">🎫</div>
        <h5>目前還沒有優惠券喔</h5>
        <p class="text-muted">快去參加看片活動領取吧！</p>
        <router-link to="/" class="btn btn-outline-primary mt-3">前往看片</router-link>
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
    isExpired(c) {
      return new Date(c.couponId.expireDate) < new Date();
    },
    isSoldOut(c) {
      return c.couponId.maxUse > 0 && c.couponId.usedCount >= c.couponId.maxUse;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getDisabledText(c) {
      if (c.isUsed) return "已使用完畢";
      if (this.isExpired(c)) return "票券已過期";
      if (this.isSoldOut(c)) return "名額已用完";
      return "無法使用";
    }
  },
  mounted() {
    this.loadCoupons();
  },
};
</script>

<style scoped>
.coupon-ticket {
  background-color: var(--app-surface);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
  border: 1px solid var(--app-border);
}

.coupon-ticket.is-used {
  opacity: 0.7;
  filter: grayscale(0.5);
  box-shadow: none;
}

.coupon-ticket-main {
  padding: 20px;
  flex: 1;
}

.coupon-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--app-text-main);
  line-height: 1.4;
}

.coupon-code-box {
  background-color: #F8F9FA;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px dashed var(--app-border);
}

.coupon-code-label {
  font-size: 0.7rem;
  color: var(--app-text-muted);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.coupon-code-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--app-primary);
  margin-top: 4px;
}

/* Divider with punch-out holes */
.coupon-ticket-divider {
  height: 2px;
  border-top: 2px dashed var(--app-border);
  position: relative;
  margin: 0 12px;
}

.dot-left, .dot-right {
  position: absolute;
  top: -10px;
  width: 20px;
  height: 20px;
  background-color: var(--app-bg);
  border-radius: 50%;
  border: 1px solid var(--app-border);
}

.dot-left { left: -24px; }
.dot-right { right: -24px; }

.coupon-ticket-footer {
  padding: 16px 20px 20px 20px;
}

.coupon-meta {
  display: flex;
  justify-content: center;
}

.coupon-expiry {
  font-size: 0.75rem;
  color: var(--app-text-muted);
  font-weight: 500;
}

.disabled-btn {
  background-color: #F2F2F7 !important;
  color: #AEAEB2 !important;
  border-color: transparent !important;
  opacity: 1 !important;
}
</style>
