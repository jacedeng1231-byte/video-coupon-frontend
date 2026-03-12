<script setup>

import { ref, onMounted } from "vue"
import api from "../api/api"

const coupons = ref([])

const loadCoupons = async () => {

  const userId = localStorage.getItem("userId")

  const res = await api.get(`/coupons/my/${userId}`)

  coupons.value = res.data

}

onMounted(loadCoupons)

</script>

<template>

<h2>我的優惠券</h2>

<div v-for="c in coupons" :key="c._id">

  <p>{{ c.couponId.title }}</p>
  <p>{{ c.couponId.code }}</p>

</div>

</template>