import axios from "axios"

const api = axios.create({
  baseURL: "https://video-coupon-backend.onrender.com/api"
})

export default api