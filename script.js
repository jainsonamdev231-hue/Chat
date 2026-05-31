/**
 * NEXUS: GLOBAL CHAT & GAME ENGINE
 * Uses MQTT over WebSockets for serverless global real-time networking.
 */

const ChatEngine = {
    // 1. Core State
    username: "",
    client: null,
    
    // This is our secret "room name". Anyone in the world subscribed to this exact string sees our chat.
    globalTopic: "nexus/global/chat/room/alpha/777", 

    // --- 1. LOGIN & INITIALIZATION ---
    login() {
        let inputEl = document.getElementById('username-input');
        let name = inputEl.value.trim();
        
        if (name.length < 2) {
            alert("Alias must be at least 2 characters.");
            return;
        }

        this.username = name.toUpperCase();
        document.getElementById('my-user-badge').innerText = this.username;
        
        // Hide login, show chat room
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('chat-screen').classList.add('active');

        // Start the global connection
        this.connectToGlobalServer();
        
        // Allow pressing 'Enter' to send messages
        document.getElementById('msg-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') ChatEngine.sendMessage();
        });
    },

    // --- 2. GLOBAL NETWORKING (MQTT) ---
    connectToGlobalServer() {
        let statusEl = document.getElementById('connection-status');
        statusEl.innerText = "🟡 Connecting...";

        // Connect to HiveMQ Public WebSocket Broker
        // This acts as our "free server" hosted on the cloud
        this.client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

        // Event: Successfully Connected
        this.client.on('connect', () => {
            statusEl.innerText = "🟢 GLOBAL LINK ACTIVE";
            statusEl.classList.add('status-connected');
            
            // Subscribe to our secret chat room
            this.client.subscribe(this.globalTopic);

            // Announce to the world that we joined
            this.publishSystemMessage(`${this.username} HAS JOINED THE SERVER.`);
        });

        // Event: Disconnected / Error
        this.client.on('error', (err) => {
            console.error("Connection Error:", err);
            statusEl.innerText = "🔴 ERROR: LINK LOST";
            statusEl.classList.remove('status-connected');
        });

        // Event: Received a Message from ANYONE in the world
        this.client.on('message', (topic, messageBytes) => {
            if (topic === this.globalTopic) {
                // Unpack the JSON data sent over the network
                const packet = JSON.parse(messageBytes.toString());
                this.renderMessage(packet);
            }
        });
    },

    // --- 3. SENDING MESSAGES & COMMANDS ---
    sendMessage() {
        let inputEl = document.getElementById('msg-input');
        let text = inputEl.value.trim();
        if (text === "") return;

        // Clear the input box immediately
        inputEl.value = "";

        // COMMAND CHECKER: Did the user type a game command?
        if (text.startsWith('/')) {
            this.handleCommand(text);
            return;
        }

        // Standard Message Payload
        const packet = {
            type: "chat",
            sender: this.username,
            text: text,
            timestamp: new Date().getTime()
        };

        // Broadcast to the world
        this.client.publish(this.globalTopic, JSON.stringify(packet));
    },

    // Helper to send yellow "System" messages (like join alerts)
    publishSystemMessage(textMsg) {
        const packet = {
            type: "system",
            text: textMsg,
            timestamp: new Date().getTime()
        };
        this.client.publish(this.globalTopic, JSON.stringify(packet));
    },

    // --- 4. THE CHAT GAME "FUNK" (COMMANDS) ---
    handleCommand(cmdText) {
        // Remove the slash and make lowercase
        let command = cmdText.substring(1).toLowerCase();

        if (command === "roll") {
            // Roll a random number between 1 and 100
            let roll = Math.floor(Math.random() * 100) + 1;
            let resultText = `🎲 ${this.username} rolled the dice and got: ${roll}/100`;
            
            // Broadcast the result to everyone as a system message
            this.publishSystemMessage(resultText);
        } 
        else {
            // Local error message (Only you see this)
            this.renderMessage({
                type: "system",
                text: `Unknown command: /${command}. Available: /roll`
            });
        }
    },

    // --- 5. UI RENDERING ---
    renderMessage(packet) {
        const chatBox = document.getElementById('chat-box');
        
        // Create the main wrapper div
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');

        // Logic for different message types
        if (packet.type === "system") {
            msgDiv.classList.add('system-msg');
            msgDiv.innerHTML = `<span class="msg-text">${packet.text}</span>`;
        } 
        else if (packet.type === "chat") {
            // Check if it's MY message or SOMEONE ELSE'S message
            if (packet.sender === this.username) {
                msgDiv.classList.add('my-msg');
                msgDiv.innerHTML = `<span class="msg-text">${packet.text}</span>`;
            } else {
                msgDiv.classList.add('other-msg');
                msgDiv.innerHTML = `
                    <span class="msg-sender">${packet.sender}</span>
                    <span class="msg-text">${packet.text}</span>
                `;
            }
        }

        // Append to DOM and auto-scroll to the bottom
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
};
