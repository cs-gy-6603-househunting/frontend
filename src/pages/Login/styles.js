import styled from "styled-components";
import { verticalFlex } from "src/global-styles/utils";

export const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const LoginContainer = styled.div`
  ${verticalFlex}
  width: 30%;
  box-shadow: 0px 8px 32px 0px #0000001f;
  border-radius: 8px;
  overflow: hidden;
  height: 70%;
  border: 1px solid #d9d9d9;
`;

export const TitleContainer = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 30px;
  padding: 20px 0px;
  color: #fff1f1;
  background-color: black;
`;

export const TabPane = styled.div`
  padding: 16px;
`;
