import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "src/utils/redux/store.js";
import { BrowserRouter } from "react-router-dom";
import RouterConfig from "src/navigation/RouterConfig";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <RouterConfig/>
    </BrowserRouter>
  </Provider>
);
