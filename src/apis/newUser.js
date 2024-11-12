import api from 'src/utils/api'

export const registerUser = async (requestObj) => {
  return await api.post('api/auth/register/', requestObj)
}

export const verfiyEmail = async (requestObj) => {
  return await api.post('api/auth/verify/', requestObj)
}
