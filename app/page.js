'use client'
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head'; 
import Footer from './footer';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter Support Bot, how can I assist you today?",
    },
  ]);

  const [message, setMessage] = useState("");

  const chatBoxRef = useRef(null);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (message.trim() === '') {
      return;
    }

    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' },
    ]);
    const response = await fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return ([
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]);
        });
        return reader.read().then(processText);
      });
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        <Box
          fontSize={35}
          p={2}
          color='#00e3b2'
        >
          HeadStarter AI Support Bot
        </Box>
        <Stack
          className="chatBox"
          ref={chatBoxRef} // Attach ref to chatBox
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
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {
              messages.map((message, index) => (
                <Box key={index} display='flex' justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }>
                  <Box
                    bgcolor={
                      message.role === 'assistant' ? '#00e3b2' : '#333'
                    }
                    color={
                      message.role === 'assistant' ? 'black' : 'white'
                    }
                    borderRadius={11}
                    p={3}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))
            }
            <div ref={messagesEndRef} />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              label="message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                input: {
                  color: '#00e3b2',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#222',
                  },
                  '&:hover fieldset': {
                    borderColor: '#222',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00e3b2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#555',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00e3b2',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              sx={{
                color: 'black',
                bgcolor: '#00e3b2',
                '&:hover': {
                  bgcolor: '#008f76',
                },
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
        <Footer />
      </Box>
    </>
  );
}
