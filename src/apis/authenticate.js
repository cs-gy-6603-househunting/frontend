import api from "src/utils/api";

export const authenticateUser = async (requestObj) => {
  return await api.post("/authenticate", requestObj);
};
