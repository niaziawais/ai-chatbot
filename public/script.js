const messagesEl = document.getElementById("messages");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const backBtn = document.getElementById("backBtn");
const chatListEl = document.getElementById("chatList");

// Load sessions
let chatSessions = JSON.parse(localStorage.getItem("chatSessions") || "[]");
let currentChatId = parseInt(localStorage.getItem("currentChatId") || 0);
let currentChat = chatSessions[currentChatId] || {name:"Chat", messages:[]};

// Render chat list (left panel)
function renderChatList(){
  chatListEl.innerHTML="";
  chatSessions.forEach((chat,idx)=>{
    const div = document.createElement("div");
    div.className="chat-item";
    div.innerText=chat.name;
    div.addEventListener("click",()=>{
      localStorage.setItem("currentChatId",idx);
      location.reload();
    });
    chatListEl.appendChild(div);
  });
}
renderChatList();

// Display previous messages
currentChat.messages.forEach(msg=>addMessage(msg.text,msg.type));

// Save message
function saveMessage(text,type){
  currentChat.messages.push({text,type});
  chatSessions[currentChatId]=currentChat;
  localStorage.setItem("chatSessions",JSON.stringify(chatSessions));
}

// Add message
function addMessage(text,type){
  const msg=document.createElement("div");
  msg.className="msg "+type;
  const bubble=document.createElement("div");
  bubble.className="bubble";
  bubble.innerText=text;
  msg.appendChild(bubble);
  messagesEl.appendChild(msg);
  messagesEl.scrollTop=messagesEl.scrollHeight;
  if(type==="user"||type==="bot") saveMessage(text,type);
}

// Send message with API fetch
sendBtn.addEventListener("click",async()=>{
  const text=input.value.trim();
  if(!text) return;
  addMessage(text,"user");
  input.value="";
  addMessage("Thinking...","bot");

  try{
    // Replace this URL with your real API
    const res = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text})});
    const data = await res.json();
    document.querySelectorAll(".msg.bot")[document.querySelectorAll(".msg.bot").length-1].remove();
    addMessage(data.reply || "No response","bot");
  }catch(err){
    document.querySelectorAll(".msg.bot")[document.querySelectorAll(".msg.bot").length-1].remove();
    addMessage("Error: "+err.message,"bot");
  }
});

// Enter key send
input.addEventListener("keydown",e=>{
  if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendBtn.click(); }
});

// Back button
backBtn.addEventListener("click",()=>{window.location.href="index.html";});
