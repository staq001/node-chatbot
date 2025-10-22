
const textarea = document.querySelector('.input-area textarea');
textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
});

const API_BASE = "http://localhost:3000/api/v1";

document.addEventListener("DOMContentLoaded", () => {
  const chatArea = document.getElementById("chat-area");
  const convoList = document.getElementById("conversation-list");
  const newChatBtn = document.getElementById("new-chat");
  const form = document.getElementById("input-area");
  const textarea = form.querySelector("textarea");
  const titleEl = document.getElementById("conversation-title");

  let currentConversationId = null;

  const scrollToBottom = () => (chatArea.scrollTop = chatArea.scrollHeight);

  const clearChat = () => (chatArea.innerHTML = "");

  const addMessage = (text, role) => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", role);

    const content = document.createElement("div");
    content.classList.add("message-content");
    content.innerHTML = `<p>${text}</p>`;
    msgDiv.appendChild(content);
    chatArea.appendChild(msgDiv);
  };

  async function loadConversations() {
    convoList.innerHTML = "";
    try {
      const res = await fetch(`${API_BASE}/conversations`);

      if (!res.ok) throw new Error("Failed to fetch conversations");
      const { data } = await res.json();


      data.conversation.forEach((convo) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.classList.add("sidebar-item");
        a.textContent = convo.title || "Untitled";
        a.href = "#";
        a.onclick = () => openConversation(convo._id, convo.title);
        li.appendChild(a);
        convoList.appendChild(li);
      });
    } catch (err) {
      console.error(err);
    }
  }

  newChatBtn.addEventListener("click", async () => {
    const firstMessage = prompt("Start the conversation:");
    if (!firstMessage) return;

    try {
      const res = await fetch(`${API_BASE}/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstMessage }),
      });
      const { data } = await res.json();
      currentConversationId = data.conversation._id;
      titleEl.textContent = data.conversation.title;
      clearChat();
      addMessage(firstMessage, "user");


      await sendMessage(firstMessage, currentConversationId);

      loadConversations();
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  });

  async function openConversation(convoId, title) {
    currentConversationId = convoId;
    titleEl.textContent = title || "Untitled";
    clearChat();

    try {
      const res = await fetch(`${API_BASE}/conversation/${convoId}`);
      if (!res.ok) throw new Error("Failed to load conversation");

      const { data } = await res.json();
      const { messages } = data;

      messages.forEach((m) => {
        addMessage(m.question, "user");
        addMessage(m.reply, "assistant");
      });
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  }

  async function sendMessage(userMessage, convoId) {
    try {
      const res = await fetch(`${API_BASE}/message/${convoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      const { data } = await res.json();
      const lastMsg = data.messages;

      addMessage(lastMsg.reply, "assistant");
      scrollToBottom();
    } catch (err) {
      console.error(err);
      addMessage("⚠️ Failed to get a reply.", "assistant");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = textarea.value.trim();
    if (!text || !currentConversationId) return;

    addMessage(text, "user");
    scrollToBottom();
    textarea.value = "";

    await sendMessage(text, currentConversationId);
  });

  // Delete conversation
  async function deleteConversation(convoId) {
    if (!confirm("Delete this conversation?")) return;
    try {
      const res = await fetch(`${API_BASE}/conversation/${convoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      loadConversations();
      clearChat();
      titleEl.textContent = "Select or start a conversation";
      currentConversationId = null;
    } catch (err) {
      console.error(err);
    }
  }

  // === Init ===
  loadConversations();
});
