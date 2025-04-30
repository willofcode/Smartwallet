import React, {useState} from 'react'
import axios from 'axios';
import ChatbotIcon from './ChatbotIcon'
import './Chatbot.css'
import ChatForm from './ChatForm'
import ChatbotMessage from './ChatbotMessage'

const Chatbot = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [showChat, setShowChat] = useState(false);
    
    //should be changed later
    const userId = 'defaultUser';
    
    const creatingAIResponse = async (history) => {
        const previousMessage = history[history.length - 1].text;

        try{
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, { // https://sd2-smartwallet.onrender.com/api/chat
                message: previousMessage,
                userId: userId,
            });
            

            const AIResponse =  res.data.response;

            //Outputs AI response-- replaces my previous processing placeholder message with actual response
            setChatHistory((previousHistory) => {
                const newHistory = [...previousHistory];
                newHistory[newHistory.length-1] = {role: "mode", text: AIResponse};
                return newHistory;
            });
        } catch(error) {
            console.error("Error when fetching AI response: ", error);
            setChatHistory((previousHistory) => {
                const newHistory = [...previousHistory];
                newHistory[newHistory.length - 1] = {
                    role: "mode", 
                    text: "Please try again. An error occurred."
                };
                return newHistory;
            });
        }
    };
  return (
    <div className={`container ${showChat ? "show-chat" : ""}`}>
        {/*Toggles the showChat value when button is clicked*/}
        <button onClick={() => setShowChat(prev => !prev)}
        id = "toggle">
            <span className='bx bxs-face text-3xl mr-.5'></span>
            <span className='bx bx-x  text-4xl mr-.5'></span>
        </button>
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
                    Hello! I'm FinBot, your financial advisor assistant. how can I help you today?
                </p>
            </div>

            {/* Chat history dynamically renders here */}
            {chatHistory.map((chat, index) => (
                <ChatbotMessage key={index} chat={chat}/>
            ))}
            
        </div>
        {/* Chatbot Footer */}
        <div className="footer">
            <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} creatingAIResponse={creatingAIResponse}/>
        </div>
    </div>
    </div>
  );
};

export default Chatbot
