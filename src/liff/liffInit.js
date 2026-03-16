import liff from "@line/liff"
import api from "../api/api"

let authPromise = null;

export const getAuth = () => {
  if (authPromise) return authPromise;

  authPromise = (async () => {
    try {
      if (import.meta.env.DEV) {
        const mockProfile = {
          userId: "test-user-v2",
          displayName: "Local User",
          pictureUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        };
        const res = await api.post("/users/login", {
          lineUserId: mockProfile.userId,
          name: mockProfile.displayName,
          pictureUrl: mockProfile.pictureUrl
        });
        localStorage.setItem("userId", res.data._id);
        return { profile: mockProfile, dbUser: res.data };
      }

      await liff.init({
        liffId: "2009432073-PKc3QsvF"
      });

      if (!liff.isLoggedIn()) {
        liff.login();
        return null;
      }

      const profile = await liff.getProfile();

      const res = await api.post("/users/login", {
        lineUserId: profile.userId,
        name: profile.displayName,
        pictureUrl: profile.pictureUrl
      });

      localStorage.setItem("userId", res.data._id);

      return { profile, dbUser: res.data };
    } catch (error) {
      console.error("Auth init error:", error);
      return null;
    }
  })();

  return authPromise;
};