import liff from "@line/liff"

export const initLiff = async () => {

  try {

    await liff.init({
      liffId: "2009432073-PKc3QsvF"
    })

    if (!liff.isLoggedIn()) {
      liff.login()
      return null
    }

    const profile = await liff.getProfile()

    return profile

  } catch (error) {

    console.error("LIFF init error:", error)

  }

}