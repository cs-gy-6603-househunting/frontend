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
      console.log(response)
      return response
    } catch (error) {
      return error.data
    }
  },
  getAllPropertyListings: async () => {
    try {
      console.log("getAllPropertyListings")
      const response = await api.get(API_URLS?.get_all_property_listing_api)
      console.log("hi")
      console.log(response)
      console.log("bye")
      return response
    } catch (error) {
      return error.data
    }
  },
  submitPropertyForVerification: async (propertyId) => {
    try {
      const response = await api.post(API_URLS?.submit_property_verification_api, {
        property_id: propertyId,
      });
      return response;
    } catch (error) {
      return error.data;
    }
  },
  searchProperties: async (requestObj) => {
    try {
      const response = await api.get(`${API_URLS.search_properties_api}?location=${requestObj.location}&radius=${requestObj.radius}&page=1`);
      console.info(response);
      return response;
    } catch (error) {
      return error.data;
    }
  },
  validateAddress: async (requestObj) => {
    try {
      return await api.post(API_URLS?.validate_address, requestObj)
    } catch (error) {
      return error.data
    }
  },
}
