import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const ChatContainer = (props) => {
  const CHATKEY = process.env.REACT_APP_CHAT_KEY;
  console.log("chatkey", CHATKEY);
  return <div>Chat Container</div>;
};

export default ChatContainer;
