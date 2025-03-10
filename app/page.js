'use client' 

import { Box, Button, Stack, TextField } from "@mui/material"; 
import { useState, useRef, useEffect } from 'react'; 
import Head from 'next/head'; 
import Footer from './footer'; 

export default function Home() {
  // State to store messages in the chat
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter Support Bot, how can I assist you today?",
    },
  ]);

  const [message, setMessage] = useState(""); // Stores the user input message

  // Refs for handling scrolling behavior
  const chatBoxRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Handles sending a message
  const sendMessage = async () => {
    if (message.trim() === '') return; // Prevents empty messages

    setMessage(''); 
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message }, // Adds user's message
      { role: "assistant", content: '' }, // Placeholder for assistant's response
    ]);

    // API request to backend to get AI response
    const response = await fetch('/api/chat', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Returns result from AI
      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) return result;

        // Decodes and updates assistant's message
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [...otherMessages, { ...lastMessage, content: lastMessage.content + text }];
        });

        return reader.read().then(processText);
      });
    });
  };

  // Detects when the user presses Enter to send a message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage();
    }
  };

  // Automatically scrolls the chat to the bottom when new messages arrive
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Runs when messages update

  return (
    <>
      <Head>
        <title>HeadStarter AI Support Bot</title>  
      </Head>
      <Box
        bgcolor="#050a1d"
        width="100%"
        height='100%'
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        paddingTop={2}
      >
        <Box fontSize={35} p={2} color='#00e3b2'> HeadStarter AI Support Bot </Box>

        <Stack
          className="chatBox"
          ref={chatBoxRef}
          direction="column"
          width="600px"
          height="550px"
          border="2px solid #222"
          bgcolor="#0c152b"
          borderRadius={7}
          p={2}
          spacing={3}
          mb={3}
          overflow="auto"
        >
          <Stack direction="column" spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
            {messages.map((message, index) => (
              <Box key={index} display='flex' justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                <Box
                  bgcolor={message.role === 'assistant' ? '#00e3b2' : '#333'}
                  color={message.role === 'assistant' ? 'black' : 'white'}
                  borderRadius={11}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button variant="contained" onClick={sendMessage} sx={{ bgcolor: '#00e3b2' }}>
              Send
            </Button>
          </Stack>
        </Stack>
        <Footer />
      </Box>
    </>
  );
}
