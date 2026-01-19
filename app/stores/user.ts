import type { fontSizeType, userConfigType } from "~/types/userConfig/userConfigType";

export const useUserStore = defineStore("user", () => {
  const nickname = ref("默认昵称");
  const avatarPath = ref("/imgs/OIP-C.webp");
  const age = ref(18);
  const id = ref(100000001);
  const getNickname = () => nickname;
  const getAvatarPath = () => avatarPath;
  const getId = () => id;
  const getAge = () => age;

  const userConfig = ref<userConfigType>({
    fontSize: "16px",
  });
  const editNickname = (name: string) => {
    nickname.value = name;
  };
  const editAge = (newAge: number) => {
    age.value = newAge;
  };
  const getUserConfig = () => userConfig.value;
  const setFontSize = (size:fontSizeType)=>{
    userConfig.value.fontSize = size;
  }
  const logout = () => {
    // 清除用户信息
  };
  return { getNickname, getAvatarPath, getId, getAge, editNickname, editAge, getUserConfig, setFontSize };
});
