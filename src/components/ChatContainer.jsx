import React, { useState } from "react";
import styled from "styled-components";

const secretKey = process.env.REACT_APP_CHAT_KEY;
const LayoutWrapper = styled.div`
  padding: 20px;
  min-height: 600px;
  width: 100%;
`;
const StyledTextarea = styled.textarea`
  background-color: white;
  color: black;
  min-width: 80vw;
`;

const SubmitButton = styled.button`
  background-color: gray;
  color: black;
  border-radius: 15px;
  width: 150px;
  height: 60px;
`;

const OutputContainer = styled.p``;

const ChatContainer = (props) => {
  const [generatedText, setGeneratedText] = useState("");
  // const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  const _getText = async () => {
    console.log("hit async _getText");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    };
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Explain all concepts like a pirate.",
        },
        {
          role: "user",
          content: "Say hello to me.",
        },
      ],
    };
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log("Returned data from api: ", data);
        const apiReply = "";
        return apiReply;
      });
  };

  return (
    <LayoutWrapper>
      <div>
        <div>
          <h3>Generated Text</h3>
          <OutputContainer>{generatedText}</OutputContainer>
        </div>
        <div>
          <label>Input text here:</label>
        </div>
        <StyledTextarea
          id="textInput"
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text here."
        />
        <div>
          <SubmitButton onClick={_getText}>Submit</SubmitButton>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default ChatContainer;
