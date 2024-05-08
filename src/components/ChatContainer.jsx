import React, { useState, useEffect } from "react";
import styled from "styled-components";

const secretKey = process.env.REACT_APP_CHAT_KEY;
const LayoutWrapper = styled.div`
  padding: 20px;
  min-height: 600px;
  width: 100%;
`;
const StyledTextarea = styled.textarea`
  background-color: white;
  border-radius: 15px;
  color: black;
  min-width: 80vw;
  padding: 1em;
`;

// const SubmitButton = styled.button`
//   background-color: gray;
//   color: black;
//   border-radius: 15px;
//   width: 150px;
//   height: 60px;
// `;

const OutputContainer = styled.div`
  background-color: white;
  min-height: 5vh;
  max-height: 20vh;
  color: black;
  width: 80vw;
  padding: 1em;
`;

const ChatContainer = (props) => {
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  console.log("chatLog", chatLog);

  useEffect(() => {
    console.log("hit useEffect isloading");
    isLoading && inputText && _getAPIResponse();
  }, [isLoading]);

  const _handleInputChange = (e) => {
    return e && e.target && setInputText(e.target.value ? e.target.value : "");
    // debounce input
    // return setTimeout(
    //   (e) => e && e.target && e.target.value && setInputText(e.target.value),
    //   50
    // );
  };

  const _handleEnterKey = (e) => {
    if (e.key === "Enter" && inputText) {
      const userMessage = {
        id: new Date().getTime() + "user",
        role: "user",
        content: inputText,
      };
      setIsLoading(true);
      setChatLog([...chatLog, userMessage]);
      // _getAPIResponse();
    }
  };

  const _renderChat = () => {
    return (
      chatLog &&
      chatLog.map((chatData) => {
        const { id, role, content } = chatData;
        return (
          <div key={id}>
            <span>{role === "system" ? "ChatBot: " : "You: "}</span>
            {content}
          </div>
        );
      })
    );
  };

  const _getAPIResponse = async () => {
    console.log("hit async _getAPIResponse");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    };
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Reply in less than 15 words.",
        },
        { role: "user", content: inputText },
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
        setIsLoading(false);
        setInputText("");
        const apiReply =
          data &&
          data.choices &&
          data.choices[0] &&
          data.choices[0].message &&
          data.choices[0].message.content
            ? data.choices[0].message.content
            : "Sorry! There was an issue contacting ChatGPT";
        const systemMessage = {
          id: new Date().getTime() + "system",
          role: "system",
          content: apiReply,
        };
        setChatLog([...chatLog, systemMessage]);
      });
  };

  return (
    <LayoutWrapper>
      <div>
        <div>
          <h3>Generated Text</h3>
          <OutputContainer>
            {_renderChat()}
            {isLoading && <div>Waiting for a response...</div>}
          </OutputContainer>
        </div>
        <div>
          <label>Input text here:</label>
        </div>
        <StyledTextarea
          id="textInput"
          rows={5}
          value={inputText}
          onChange={_handleInputChange}
          onKeyDown={_handleEnterKey}
          placeholder="Enter text here."
        />
      </div>
    </LayoutWrapper>
  );
};

export default ChatContainer;
