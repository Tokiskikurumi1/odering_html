/**
 * Chat Component Logic
 */
function initChatLogic() {
  const chatBubble = document.querySelector(".chat-bubble");
  const chatModal = document.getElementById("chat-modal");
  const closeChat = document.querySelector(".close-chat");
  const messageInput = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const chatMessages = document.getElementById("chat-messages");

  if (!chatBubble || !chatModal || !closeChat || !messageInput || !sendBtn || !chatMessages) {
    console.warn("Chat elements missing");
    return;
  }

  // Show chat modal
  chatBubble.addEventListener("click", () => {
    chatModal.classList.add("show");
  });

  // Close chat modal
  closeChat.addEventListener("click", () => {
    chatModal.classList.remove("show");
  });

  // Send message function
  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      // Add user message
      const userMessage = document.createElement("div");
      userMessage.className = "message user";
      userMessage.innerHTML = `<p>${message}</p>`;
      chatMessages.appendChild(userMessage);

      // Clear input
      messageInput.value = "";

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Simulate bot response
      setTimeout(() => {
        const botMessage = document.createElement("div");
        botMessage.className = "message bot";
        botMessage.innerHTML = `<p>Cảm ơn bạn đã nhắn! Chúng tôi sẽ trả lời sớm nhất có thể.</p>`;
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    }
  }

  // Send on button click
  sendBtn.addEventListener("click", sendMessage);

  // Send on Enter key
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
}
