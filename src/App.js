import React, { useState } from "react";
import styled from "styled-components";
import ChatContainer from "./components/ChatContainer";

const MainContainer = styled.div`
  background-color: black;
  color: white;
`;

function App() {
  return (
    <MainContainer>
      <ChatContainer />
    </MainContainer>
  );
}

export default App;
