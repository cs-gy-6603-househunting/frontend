import * as AllNavigation from "src/utils/routes";
import Login from "src/pages/Login";
export const openRouteList = [
  {
    key: "login-route",
    component: Login,
    path: AllNavigation.LOGIN,
    props: { newAccount: false },
  },
  {
    key: "register-route",
    component: Login,
    path: AllNavigation.NEW_ACCOUNT,
    props: { newAccount: true },
  },
];
