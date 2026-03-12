import liff from "@line/liff"

export const initLiff = async () => {

  await liff.init({
    liffId: "YOUR_LIFF_ID"
  })

  if (!liff.isLoggedIn()) {
    liff.login()
  }

  const profile = await liff.getProfile()

  return profile
}