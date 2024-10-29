import styled from "styled-components";
import { horizontalFlex } from "src/global-styles/utils";

export const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const LoginContainer = styled.div`
  display: flex;
  width: 80%;
  height: 35em;
  box-shadow: 0px 8px 32px 0px #0000001f;
  border-radius: 8px;
  overflow: hidden;
`;

export const LoginFormWrapper = styled.div`
  width: 50%;
  ${horizontalFlex}
  align-items: center;
  justify-content: center;
`;

export const LogoWrapper = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  background-color: lightblue;
  color: #f4f4f4;
  font-size: 40px;
`;

export const TitleContainer = styled.div`
  text-align: center;
  font-weight: 700;
  padding: 20px 0px;
`;