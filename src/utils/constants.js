export const API_URLS = {
  list_property_api: '/api/properties/add/',
  login_api: '/api/auth/login/',
  register_api: '/api/auth/register/',
  verify_email_api: '/api/auth/verify/',
}

export const AUTH_NOT_REQUIRED_APIS = [
  API_URLS.login_api,
  API_URLS.register_api,
  API_URLS.verify_email_api,
]
