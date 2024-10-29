import styled from "styled-components";

export const verticalFlex = {
  display: "flex",
  "flex-direction": "column",
};

export const horizontalFlex = {
  display: "flex",
  "flex-direction": "row",
};

export const FlexEnd = styled.div`
  ${verticalFlex}
  align-items: flex-end;
`;

export const FlexLinear = styled.div`
  ${horizontalFlex}
`;

export const CTAS = {
  marginRight: "10px",
};
