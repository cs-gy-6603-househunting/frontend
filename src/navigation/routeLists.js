import * as AllNavigation from 'src/utils/routes'
import * as AllPages from 'src/pages'

export const openRouteList = [
  {
    key: 'login-route',
    component: AllPages.Login,
    path: AllNavigation.LOGIN,
    props: { newAccount: false },
  },
  {
    key: 'register-route',
    component: AllPages.Login,
    path: AllNavigation.NEW_ACCOUNT,
    props: { newAccount: true },
  },
  {
    key: 'verify-email',
    component: AllPages.VerfiyEmail,
    path: AllNavigation.VERIFY_EMAIL,
  },
]

export const routeLists = [
  {
    key: 'root',
    component: AllPages.Dashboard,
    path: AllNavigation.ROOT,
  },
  {
    key: 'home',
    component: AllPages.Dashboard,
    path: AllNavigation.HOME,
  },
  {
    key: 'property',
    component: AllPages.AddProperty,
    path: AllNavigation.ADD_PROPERTY,
  },
]
