<template>
  <div class="container mt-4">
    <PageTitle title="會員管理" subtitle="USER MANAGEMENT (TEST)" />

    <div class="card p-3 mb-4">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>姓名</th>
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
                    style="width: 32px; height: 32px; object-fit: cover"
                  />
                  <span class="fw-bold">{{ u.name }}</span>
                </div>
              </td>
              <td>{{ new Date(u.createdAt).toLocaleString() }}</td>
              <td>
                <button
                  class="btn btn-sm btn-warning me-2"
                  @click="resetUser(u._id)"
                >
                  <i class="bi bi-arrow-counterclockwise"></i> 重置紀錄
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteUser(u._id)"
                >
                  <i class="bi bi-trash"></i> 徹底刪除
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="3" class="text-center opacity-75 py-5">
                <div class="mb-2 fs-2">📭</div>
                目前暫無會員資料
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
import PageTitle from "../components/PageTitle.vue";

export default {
  components: { PageTitle },
  data() {
    return {
      users: [],
    };
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
    async resetUser(id) {
      if (
        !confirm("確定要重置該用戶的所有觀看與領取紀錄嗎？\n(用戶帳號會保留)")
      )
        return;
      try {
        await api.post(`/users/${id}/reset`);
        alert("紀錄已重置");
      } catch (err) {
        console.error("Error resetting user:", err);
        alert("重置失敗");
      }
    },
    async deleteUser(id) {
      if (
        !confirm("確定要『徹底刪除』此會員及其所有紀錄嗎？\n刪除後無法復原。")
      )
        return;
      try {
        await api.delete(`/users/${id}`);
        alert("會員已徹底刪除");
        this.fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("刪除失敗");
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>
