import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
const LayoutWrapper = styled.div``;


try {
	const response = await axios.post(
	‘https://api.openai.com/v1/engines/davinci/completions',
	{
	prompt: inputText,
	max_tokens: 100,
	},
{
	headers: {
		‘Content-Type’: ‘application/json’,
		‘Authorization’: `Bearer ${apiKey}`,
	},
}
);
setGeneratedText(response.data.choices[0].text);
} catch (error) {
console.error(‘Error generating text:’, error);
}


const ChatContainer = (props) => {
  const apiKEY = process.env.REACT_APP_CHAT_KEY;
  console.log("chatkey", CHATKEY);
  const [generatedText, setGeneratedText] = useState('');
  const [inputText, setInputText] = useState('');

  const getText = async()=>{
    try{
        const response = await axios.post(
            "https://api.openai.com/v1/engines/davinci/completions",
            {
                prompt: inputText,
                max_tokens: 100, // max character length
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKEY}`,
                }
            },
        );
        setGeneratedText(response.data.choices[0].text);
    } catch (error) 
    {
        console.error("ERROR getting text: ", error);
    };
    

    return<div></div>
  };

  return <div>Chat Container</div>;
};

export default ChatContainer;
