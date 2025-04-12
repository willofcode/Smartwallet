import React, {useRef} from 'react'

const ChatForm = ({chatHistory, setChatHistory, creatingAIResponse}) => {
const referenceInput = useRef();

const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = referenceInput.current.value.trim();
    referenceInput.current.value = "";

    if (!userMessage) return;

    //This will update the chat history with the user's message that was typed
    setChatHistory((history) => [...history, {role: "user", text: userMessage}]);

    // Delays by 600ms before showing the Processing message and then creates the response
    setTimeout(() => {
      //Shows thinking message while chatbot is typing
      setChatHistory((history) => [...history, {role: "mode", text: "Processing..."}]);
      
      //This function call generates the bot's response
    creatingAIResponse([...chatHistory, {role: "user", text: userMessage}]);
 },  600);

};

  return (
    <form action="#" className="ChatbotForm" onSubmit={handleFormSubmit}>
                <input ref={referenceInput} type="text" placeholder='Ask your question...' className='input-messages' required/>
                <button>
                <i className='bx bx-chevron-up'></i>
            </button>
            </form>
  )
}

export default ChatForm
