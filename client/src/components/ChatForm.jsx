import React, {useRef} from 'react'

const ChatForm = () => {
const referenceInput = useRef();

const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = referenceInput.current.value.trim();
    if (!userMessage) return;

    console.log(userMessage);
}

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