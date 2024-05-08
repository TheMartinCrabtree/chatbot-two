import React, { useState, useEffect } from "react";
import styled from "styled-components";

const secretKey = process.env.REACT_APP_CHAT_KEY;
const LayoutWrapper = styled.div`
  padding: 20px;
  min-height: 600px;
  width: 85%;
`;

const TextAreaWrapper = styled.div`
  padding: 2em 0;
`;

const StyledTextarea = styled.textarea`
  background-color: white;
  border-radius: 15px;
  color: black;
  min-width: 80vw;
  padding: 1em;
`;

const OutputContainer = styled.div`
  background-color: #fceaff;
  min-height: 5vh;
  max-height: 20vh;
  color: black;
  width: 80vw;
  padding: 1em;
`;

const CopyContainer = styled.div`
  font-size: 0.6em;
`;

const UserLabel = styled.span`
  ${({ $user }) => ($user === "system" ? "color: red;" : "color: blue;")}
`;
const UserText = styled.span`
  ${({ $user }) =>
    $user === "system" ? "color: #a34141;" : "color: #317fc5;"};
`;

const testChatLog = [
  {
    id: 12354 + "user",
    role: "user",
    content: "test user text one",
  },
  {
    id: 12354 + "system",
    role: "system",
    content: "test system text one",
  },
  {
    id: 12356 + "user",
    role: "user",
    content: "test user text two",
  },
  {
    id: 12356 + "system",
    role: "system",
    content: "test system text two",
  },
];

const ChatContainer = (props) => {
  // const [chatLog, setChatLog] = useState([]);
  const [chatLog, setChatLog] = useState(testChatLog);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  const _handleInputChange = (e) => {
    return e && e.target && setInputText(e.target.value ? e.target.value : "");
    // should set up a debounce input
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
    }
  };

  const _renderChat = () => {
    return (
      chatLog &&
      chatLog.map((chatData) => {
        const { id, role, content } = chatData;
        return (
          <div key={id}>
            <UserLabel $user={role}>
              {role === "system" ? "ChatBot: " : "You: "}
            </UserLabel>
            <UserText $user={role}>{content}</UserText>
          </div>
        );
      })
    );
  };

  const _getAPIResponse = async () => {
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

  useEffect(() => {
    isLoading && inputText && _getAPIResponse();
  }, [isLoading]);

  return (
    <LayoutWrapper>
      <div>
        <div>
          <h3>Chat with New Yorker Bot</h3>
          <OutputContainer>
            {_renderChat()}
            {isLoading && <div>Waiting for a response...</div>}
          </OutputContainer>
        </div>
        <TextAreaWrapper>
          <StyledTextarea
            id="textInput"
            rows={5}
            value={inputText}
            onChange={_handleInputChange}
            onKeyDown={_handleEnterKey}
            placeholder="Enter text here."
          />
        </TextAreaWrapper>
      </div>
      <CopyContainer>
        {" "}
        &copy; {new Date().getFullYear()} M.Crabtree
      </CopyContainer>
    </LayoutWrapper>
  );
};

export default ChatContainer;
