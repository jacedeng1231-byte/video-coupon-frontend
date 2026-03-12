<script setup>

import { onMounted } from "vue"
import api from "./api/api"
import { initLiff } from "./liff/liffInit"

onMounted(async () => {

  const profile = await initLiff()

  const res = await api.post("/users/login", {
    lineUserId: profile.userId,
    name: profile.displayName
  })

  localStorage.setItem("userId", res.data._id)

})

</script>

<template>
  <router-view />
</template>