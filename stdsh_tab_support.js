/**
 * Customer Support Tab Logic
 */
function initSupportTab() {
    console.log("Initializing Support Tab...");
    
    const chatItems = document.querySelectorAll('.kurumi-chat-item');
    const messagesList = document.getElementById('kurumi-messages-list');
    const chatInput = document.getElementById('kurumi-chat-input');
    const sendBtn = document.querySelector('.kurumi-send-btn');
    const activeName = document.getElementById('kurumi-active-name');
    const activeAvatar = document.getElementById('kurumi-active-avatar');

    // Scroll to bottom initially
    scrollToBottom();

    // Handle chat item switching
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            chatItems.forEach(i => i.classList.remove('active'));
            // Add to clicked
            item.classList.add('active');

            // Update header info (mock)
            const name = item.querySelector('.kurumi-chat-name').textContent;
            const avatarSrc = item.querySelector('.kurumi-chat-avatar img').src;
            
            if (activeName) activeName.textContent = name;
            if (activeAvatar) activeAvatar.src = avatarSrc;

            // Clear unread badge if exists
            const badge = item.querySelector('.kurumi-unread-badge');
            if (badge) badge.remove();

            // Mock: Load different messages (in real app, this would be a fetch)
            loadMessages(name);
        });
    });

    // Send message logic
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        const messageHtml = `
            <div class="kurumi-message outgoing">
                <div class="kurumi-message-bubble">
                    ${text}
                </div>
                <span class="kurumi-message-time">${timeStr}</span>
            </div>
        `;

        messagesList.insertAdjacentHTML('beforeend', messageHtml);
        chatInput.value = '';
        scrollToBottom();

        // Mock auto-reply
        setTimeout(() => {
            const replyHtml = `
                <div class="kurumi-message incoming">
                    <div class="kurumi-message-bubble">
                        Cảm ơn bạn đã nhắn tin. Chúng tôi sẽ phản hồi sớm nhất có thể.
                    </div>
                    <span class="kurumi-message-time">${timeStr}</span>
                </div>
            `;
            messagesList.insertAdjacentHTML('beforeend', replyHtml);
            scrollToBottom();
        }, 1500);
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function scrollToBottom() {
        if (messagesList) {
            messagesList.scrollTop = messagesList.scrollHeight;
        }
    }

    function loadMessages(name) {
        // Just a mock to clear and add a couple of messages
        if (!messagesList) return;
        
        messagesList.innerHTML = `
            <div class="kurumi-message-divider"><span>Hôm nay</span></div>
            <div class="kurumi-message incoming">
                <div class="kurumi-message-bubble">
                    Chào bạn, tôi là ${name}. Tôi có thắc mắc về đơn hàng của mình.
                </div>
                <span class="kurumi-message-time">09:00 AM</span>
            </div>
            <div class="kurumi-message outgoing">
                <div class="kurumi-message-bubble">
                    Chào ${name}, Kurumi BBQ sẵn sàng hỗ trợ bạn ạ!
                </div>
                <span class="kurumi-message-time">09:05 AM</span>
            </div>
        `;
        scrollToBottom();
    }
}

// Export to window
window.initSupportTab = initSupportTab;
