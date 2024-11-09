import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "src/utils/redux/store.js";
import { BrowserRouter } from "react-router-dom";
import RouterConfig from "src/navigation/RouterConfig";
import { ConfigProvider } from "antd";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      token: {
        fontFamily: "poppins",
        colorPrimary: "#DE7272",
        colorLink: "#DE7272",
      },
    }}
  >
    <Provider store={store}>
      <BrowserRouter>
        <RouterConfig />
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
);
