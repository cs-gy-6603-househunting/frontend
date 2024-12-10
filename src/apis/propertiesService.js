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
  updatePropertyApi: async (requestObj) => {
    try {
      const response = api.post(API_URLS?.update_property_api, requestObj)

      return response
    } catch (error) {
      return error.data
    }
  },
  propertyUploadImage: async (requestObj) => {
    try {
      const response = await api.post(
        API_URLS?.property_upload_image_api,
        requestObj,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response
    } catch (error) {
      return error.data
    }
  },
  getPropertyListings: async () => {
    try {
      const response = await api.get(API_URLS?.get_property_listing_api)
      return response
    } catch (error) {
      return error.data
    }
  },
}
