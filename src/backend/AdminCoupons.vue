<script>
import api from "../api/api";
import PageTitle from "../components/PageTitle.vue";

export default {
  components: { PageTitle },
  data() {
    return {
      coupons: [],
      newCoupon: {
        title: "",
        code: "",
        expireDate: "",
        maxUse: 0,
      },
      editingCoupon: null,
      loading: true,
    };
  },
  methods: {
    async fetchCoupons() {
      try {
        const res = await api.get("/coupons");
        this.coupons = res.data;
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    },
    async createCoupon() {
      try {
        await api.post("/coupons", this.newCoupon);
        alert("優惠券新增成功");
        this.resetForm();
        this.fetchCoupons();
      } catch (err) {
        console.error("Error creating coupon:", err);
      }
    },
    editCoupon(coupon) {
      this.editingCoupon = { ...coupon };
      // Format date for input type="date"
      if (this.editingCoupon.expireDate) {
        this.editingCoupon.expireDate = new Date(this.editingCoupon.expireDate)
          .toISOString()
          .split("T")[0];
      }
    },
    async updateCoupon() {
      try {
        await api.put(`/coupons/${this.editingCoupon._id}`, this.editingCoupon);
        alert("優惠券更新成功");
        this.cancelEdit();
        this.fetchCoupons();
      } catch (err) {
        console.error("Error updating coupon:", err);
      }
    },
    async deleteCoupon(id) {
      if (!confirm("確定要刪除此優惠券嗎？")) return;
      try {
        await api.delete(`/coupons/${id}`);
        alert("優惠券已刪除");
        this.fetchCoupons();
      } catch (err) {
        console.error("Error deleting coupon:", err);
      }
    },
    resetForm() {
      this.newCoupon = {
        title: "",
        code: "",
        expireDate: "",
        maxUse: 0,
      };
    },
    cancelEdit() {
      this.editingCoupon = null;
    },
  },
  async mounted() {
    this.loading = true;
    await this.fetchCoupons();
    this.loading = false;
  },
};
</script>

<template>
  <div class="container mt-4">
    <PageTitle title="優惠券管理" subtitle="COUPON MANAGEMENT" />

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted fw-bold">正在載入優惠券資料...</p>
    </div>

    <!-- 內容 -->
    <div v-else>
      <!-- 新增 / 修改 表單 -->
      <div class="card p-3 mb-4">
      <h5>{{ editingCoupon ? "修改優惠券" : "新增優惠券" }}</h5>
      <div v-if="!editingCoupon">
        <input
          class="form-control mb-2"
          placeholder="標題"
          v-model="newCoupon.title"
        />
        <input
          class="form-control mb-2"
          placeholder="優惠碼"
          v-model="newCoupon.code"
        />
        <label class="form-label small opacity-75">到期日</label>
        <input
          type="date"
          class="form-control mb-2"
          v-model="newCoupon.expireDate"
        />
        <input
          type="number"
          class="form-control mb-2"
          placeholder="最大使用次數"
          v-model="newCoupon.maxUse"
        />
        <button class="btn btn-primary" @click="createCoupon">
          新增優惠券
        </button>
      </div>
      <div v-else>
        <input
          class="form-control mb-2"
          placeholder="標題"
          v-model="editingCoupon.title"
        />
        <input
          class="form-control mb-2"
          placeholder="優惠碼"
          v-model="editingCoupon.code"
        />
        <label class="form-label small opacity-75">到期日</label>
        <input
          type="date"
          class="form-control mb-2"
          v-model="editingCoupon.expireDate"
        />
        <input
          type="number"
          class="form-control mb-2"
          placeholder="最大使用次數"
          v-model="editingCoupon.maxUse"
        />
        <div class="d-flex gap-2">
          <button class="btn btn-success" @click="updateCoupon">
            儲存修改
          </button>
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
            <th>代碼</th>
            <th>到期日</th>
            <th>發放次數</th>
            <th>使用進度</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in coupons" :key="c._id">
            <td>{{ c.title }}</td>
            <td>
              <code>{{ c.code }}</code>
            </td>
            <td>{{ new Date(c.expireDate).toLocaleDateString() }}</td>
            <td>{{ c.issuedCount || 0 }}</td>
            <td>
              <span
                :class="
                  c.usedCount >= c.maxUse && c.maxUse > 0
                    ? 'text-danger fw-bold'
                    : ''
                "
              >
                {{ c.usedCount || 0 }} / {{ c.maxUse }}
              </span>
            </td>
            <td>
              <div class="d-flex flex-column flex-sm-row gap-2">
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="editCoupon(c)"
                >
                  修改
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteCoupon(c._id)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="coupons.length === 0">
            <td colspan="6" class="text-center opacity-75">目前無優惠券</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>