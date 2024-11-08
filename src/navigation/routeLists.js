import * as AllNavigation from "src/utils/routes";
import Login from "src/pages/Login";
import AddProperty from "src/pages/AddProperty";
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
  {
    key: "properties-route",
    component: AddProperty,
    path: AllNavigation.ADD_PROPERTY,
  },
];
