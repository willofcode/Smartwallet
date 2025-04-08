import React from 'react'
import ChatbotIcon from './ChatbotIcon'

const ChatbotMessage = ({chat}) => {
  return (
    // This will update class name based on the chat's role 
    <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message`}>
        {/* This will add the chat bot's icon only if the role is model*/}
        {chat.role === "model" && <ChatbotIcon />}
            <p className="messagetext">{chat.text}</p>
            </div>
  )
}

export default ChatbotMessage