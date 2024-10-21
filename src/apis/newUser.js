import api from "src/utils/api";

export const registerUser = async (requestObj) => {
  return await api.post("/register", requestObj);
};
