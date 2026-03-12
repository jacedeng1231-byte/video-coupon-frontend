<script setup>

import { ref, onMounted } from "vue"
import api from "../api/api"

const videos = ref([])

const loadVideos = async () => {

  const res = await api.get("/videos")

  videos.value = res.data

}

onMounted(loadVideos)

</script>


<template>

<h2>影片列表</h2>

<div v-for="video in videos" :key="video._id">

  <h3>{{ video.title }}</h3>

  <iframe
    width="300"
    height="200"
    :src="`https://www.youtube.com/embed/${video.youtubeId}`"
  ></iframe>

  <button @click="claim(video.rewardCoupon._id)">
    領取獎勵
  </button>

</div>

</template>