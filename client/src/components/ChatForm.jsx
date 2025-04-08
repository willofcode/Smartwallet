import React, {useRef} from 'react'

const ChatForm = ({setChatHistory}) => {
const referenceInput = useRef();

const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = referenceInput.current.value.trim();
    referenceInput.current.value = "";

    if (!userMessage) return;

    //This will update the chat history with the user's message that was typed
    setChatHistory((history) => [...history, {role: "user", text: userMessage}]);
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
