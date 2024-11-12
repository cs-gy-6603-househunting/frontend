import api from 'src/utils/api'

import { API_URLS } from 'src/utils/constants'

export default {
  listPropertyApi: async function (requestObj) {
    try {
      const response = api.post(API_URLS?.list_property_api, requestObj)

      return response
    } catch (error) {
        
      return error.data
    }
  },
}
