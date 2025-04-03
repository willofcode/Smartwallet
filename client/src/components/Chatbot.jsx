import React from 'react'
import ChatbotIcon from './ChatbotIcon'
import './Chatbot.css'
import ChatForm from './ChatFr'

const Chatbot = () => {
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
            <div className="message user-message">
            <p className="messagetext">
                    blah blah
            </p>
            </div>
        </div>
        {/* Chatbot Footer */}
        <div className="footer">
            <ChatForm />
        </div>
    </div>
    </div>
  );
};

export default Chatbot