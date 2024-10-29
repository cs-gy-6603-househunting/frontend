import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { increment } from "src/utils/redux/counterSlice";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const App = () => {
  const count = useSelector((state) => state.counter.count);
  const authInfo = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(authInfo);
  }, [authInfo]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button type="primary" onClick={() => dispatch(increment())}>
          Count is {count}
        </Button>
        <Button type="primary" onClick={() => navigate(`/login/${count}`)}>
          Go to Login
        </Button>
      </div>
    </>
  );
};

export default App;
