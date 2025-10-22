const textarea = document.querySelector(".input-area textarea")
textarea.addEventListener("input", () => {
  textarea.style.height = "auto"
  textarea.style.height = `${textarea.scrollHeight}px`
})

const API_BASE = "http://localhost:3000/api/v1"

function initializeDarkMode() {
  const isDarkMode = localStorage.getItem("staq-dark-mode") === "true"
  const themeToggle = document.getElementById("theme-toggle")

  if (isDarkMode) {
    document.documentElement.classList.add("dark-mode")
  } else {
    document.documentElement.classList.remove("dark-mode")
  }

  themeToggle.addEventListener("click", () => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark-mode")

    if (isCurrentlyDark) {
      document.documentElement.classList.remove("dark-mode")
      localStorage.setItem("staq-dark-mode", "false")
    } else {
      document.documentElement.classList.add("dark-mode")
      localStorage.setItem("staq-dark-mode", "true")
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initializeDarkMode()

  const chatArea = document.getElementById("chat-area")
  const convoList = document.getElementById("conversation-list")
  const newChatBtn = document.getElementById("new-chat")
  const form = document.getElementById("input-area")
  const textarea = form.querySelector("textarea")
  const titleEl = document.getElementById("conversation-title")

  let currentConversationId = null

  const scrollToBottom = () => (chatArea.scrollTop = chatArea.scrollHeight)

  const clearChat = () => (chatArea.innerHTML = "")

  const addMessage = (text, role, isLoading = false) => {
    const msgDiv = document.createElement("div")
    msgDiv.classList.add("message", role)
    if (isLoading) msgDiv.classList.add("loading")

    const content = document.createElement("div")
    content.classList.add("message-content")
    content.innerHTML = isLoading ? `<p>...</p>` : `<p>${text}</p>`
    msgDiv.appendChild(content)
    chatArea.appendChild(msgDiv)

    return msgDiv
  }

  async function loadConversations() {
    convoList.innerHTML = ""
    try {
      const res = await fetch(`${API_BASE}/conversations`)

      if (!res.ok) throw new Error("Failed to fetch conversations")
      const { data } = await res.json()

      data.conversation.forEach((convo) => {
        const li = document.createElement("li")

        const itemContainer = document.createElement("div")
        itemContainer.style.display = "flex"
        itemContainer.style.alignItems = "center"
        itemContainer.style.justifyContent = "space-between"
        itemContainer.style.width = "100%"

        const a = document.createElement("a")
        a.classList.add("sidebar-item-text")
        a.textContent = convo.title || "Untitled"
        a.href = "#"
        a.style.flex = "1"
        a.onclick = (e) => {
          e.preventDefault()
          openConversation(convo._id, convo.title)
        }

        const deleteBtn = document.createElement("button")
        deleteBtn.classList.add("sidebar-item-delete")
        deleteBtn.textContent = "⋮"
        deleteBtn.title = "Delete conversation"
        deleteBtn.onclick = (e) => {
          e.preventDefault()
          e.stopPropagation()
          deleteConversation(convo._id)
        }

        const sidebarItem = document.createElement("a")
        sidebarItem.classList.add("sidebar-item")
        sidebarItem.href = "#"
        sidebarItem.onclick = (e) => {
          e.preventDefault()
          openConversation(convo._id, convo.title)
        }

        sidebarItem.appendChild(a)
        sidebarItem.appendChild(deleteBtn)
        li.appendChild(sidebarItem)
        convoList.appendChild(li)
      })
    } catch (err) {
      console.error(err)
    }
  }

  newChatBtn.addEventListener("click", async () => {
    window.location.reload()
  })

  async function openConversation(convoId, title) {
    currentConversationId = convoId
    titleEl.textContent = title || "Untitled"
    clearChat()

    try {
      const res = await fetch(`${API_BASE}/conversation/${convoId}`)
      if (!res.ok) throw new Error("Failed to load conversation")

      const { data } = await res.json()
      const { messages } = data

      messages.forEach((m) => {
        addMessage(m.question, "user")
        addMessage(m.reply, "assistant")
      })
      scrollToBottom()
    } catch (err) {
      console.error(err)
    }
  }

  async function sendMessage(userMessage, convoId) {
    const loadingMsg = addMessage("", "assistant", true)

    try {
      const res = await fetch(`${API_BASE}/message/${convoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!res.ok) throw new Error("Failed to send message")
      const { data } = await res.json()
      const lastMsg = data.messages

      loadingMsg.classList.remove("loading")
      const content = loadingMsg.querySelector(".message-content")
      content.innerHTML = `<p>${lastMsg.reply}</p>`
      scrollToBottom()
    } catch (err) {
      console.error(err)
      loadingMsg.classList.remove("loading")
      const content = loadingMsg.querySelector(".message-content")
      content.innerHTML = `<p>⚠️ Failed to get a reply.</p>`
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const text = textarea.value.trim()
    if (!text) return

    addMessage(text, "user")
    scrollToBottom()
    textarea.value = ""

    if (!currentConversationId) {
      try {
        const res = await fetch(`${API_BASE}/conversation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstMessage: text }),
        })
        const { data } = await res.json()
        currentConversationId = data.conversation._id
        titleEl.textContent = data.conversation.title

        sendMessage(text, currentConversationId)
        loadConversations()
      } catch (err) {
        console.error("Error creating conversation:", err)
      }
      return
    }

    sendMessage(text, currentConversationId)
  })

  async function deleteConversation(convoId) {
    if (!confirm("Delete this conversation?")) return
    try {
      const res = await fetch(`${API_BASE}/conversation/${convoId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
      loadConversations()
      clearChat()
      titleEl.textContent = "Select or start a conversation"
      currentConversationId = null
    } catch (err) {
      console.error(err)
    }
  }

  loadConversations()
})
