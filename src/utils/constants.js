export const API_URLS = {
  list_property_api: '/api/properties/add/',
  update_property_api: '/api/properties/update/',
  get_property_listing_api: '/api/properties/',
  property_upload_image_api: '/api/properties/upload-image/',
  login_api: '/api/auth/login/',
  register_api: '/api/auth/register/',
  verify_email_api: '/api/auth/verify/',
  request_new_verify_link: '/api/auth/verify/generatenew/',
  lessee_profile: '/api/auth/lessee_setup',
}

export const AUTH_NOT_REQUIRED_APIS = [
  API_URLS.login_api,
  API_URLS.register_api,
  API_URLS.verify_email_api,
  API_URLS.request_new_verify_link,
]
