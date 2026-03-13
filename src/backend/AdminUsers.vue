<template>
  <div class="container mt-4">
    <div class="d-flex align-items-center mb-4">
      <router-link to="/dashboard" class="btn btn-outline-secondary me-3">
        <i class="bi bi-arrow-left"></i> 返回
      </router-link>
      <h2 class="mb-0">👥 會員管理 (測試工具)</h2>
    </div>

    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>姓名</th>
              <th>LINE User ID</th>
              <th>加入時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u._id">
              <td>
                <div class="d-flex align-items-center">
                  <img 
                    v-if="u.pictureUrl" 
                    :src="u.pictureUrl" 
                    class="rounded-circle me-2" 
                    style="width: 32px; height: 32px; object-fit: cover;"
                  />
                  <span class="fw-bold">{{ u.name }}</span>
                </div>
              </td>
              <td><small class="text-muted">{{ u.lineUserId }}</small></td>
              <td>{{ new Date(u.createdAt).toLocaleString() }}</td>
              <td>
                <button 
                  class="btn btn-sm btn-outline-danger" 
                  @click="deleteUser(u._id)"
                >
                  刪除 / 重置
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="4" class="text-center text-muted py-5">
                <div class="mb-2 fs-2">📭</div>
                目前表格尚無會員資料
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api";

export default {
  data() {
    return {
      users: []
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await api.get("/users");
        this.users = res.data;
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    },
    async deleteUser(id) {
      if (!confirm("確定要刪除此會員及其所有領取、觀看紀錄嗎？\n這通常用於測試重置。")) return;
      try {
        await api.delete(`/users/${id}`);
        alert("會員資料已清除");
        this.fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("刪除失敗");
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
}
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
