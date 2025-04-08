import React from 'react'
import ChatbotIcon from './ChatbotIcon'
import './Chatbot.css'
import ChatForm from './ChatForm'
import ChatbotMessage from './ChatbotMessage'

const Chatbot = () => {
    const [chatHistory, setChatHistory] = useState([]);
  return (
    <div className='container'>
        <div className='popup'>
            {/*Header of Chatbot*/}
            <div className='header'>
                <div className="header-info">
                <ChatbotIcon />
                <h2 className='textLogo'>Chatbot</h2>
            </div>
            <button>
                <i className='bx bx-chevron-down'></i>
            </button>
            </div>

        {/* Body */}
        <div className='body'>
            <div className="message bot-message">
                <ChatbotIcon />
                <p className="messagetext">
                    Hey, how can I help you today!
                </p>
            </div>

            {/* Chat history dynamically renders here */}
            {chatHistory.map((chat, index) => (
                <ChatbotMessage key={index} chat={chat}/>
            ))}
            
        </div>
        {/* Chatbot Footer */}
        <div className="footer">
            <ChatForm setChatHistory={setChatHistory}/>
        </div>
    </div>
    </div>
  );
};

export default Chatbot