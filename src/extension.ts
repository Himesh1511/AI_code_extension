import * as vscode from 'vscode';
import fetch from 'node-fetch';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('codingHelper.showPanel', () => {
            const panel = vscode.window.createWebviewPanel(
                'codingHelper',
                'AI Code Chata
                vscode.ViewColumn.One,
                { enableScripts: true }
            );
            panel.webview.html = getWebviewContent();
            panel.webview.onDidReceiveMessage(
                async (message) => {
                    if (message.command === 'askGroq') {
                        try {
                            const answer = await callGroqApi(message.text);
                            panel.webview.postMessage({ command: 'groqResponse', text: answer });
                        } catch (e: any) {
                            panel.webview.postMessage({ command: 'groqResponse', text: "Error: " + (e.message || e.toString()) });
                        }
                    }
                },
                undefined,
                context.subscriptions
            );
        })
    );
}

type GroqCompletionResponse = {
    choices?: { message?: { content?: string } }[]
};

async function callGroqApi(prompt: string): Promise<string> {
    const apiKey = "YOUR_GROQ_API_KEY";
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama3-70b-8192',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 256
        })
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error("Groq API error: " + err);
    }
    const data = await response.json() as GroqCompletionResponse;
    return data.choices?.[0]?.message?.content?.trim() || "No response from Groq API.";
}

function getWebviewContent() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>AI Code Chat</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                background: linear-gradient(135deg, #232526 0%, #414345 100%);
                color: #e5e7eb;
                display: flex;
                flex-direction: column;
                height: 100vh;
                overflow: hidden;
            }
            .chat-header {
                background: rgba(30,34,45,0.95);
                color: #fff;
                font-size: 1.5em;
                font-weight: bold;
                letter-spacing: 1px;
                padding: 22px 0 20px 0;
                text-align: center;
                position: relative;
                box-shadow: 0 4px 24px 0 rgba(0,0,0,0.2);
                z-index: 2;
                border-bottom: 1px solid #2a2d34;
                background-image: linear-gradient(90deg, #005a9e 0%, #007acc 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .messages {
                flex: 1;
                overflow-y: auto;
                padding: 30px 18px 18px 18px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                background: rgba(24,26,27,0.9);
                backdrop-filter: blur(3px);
                animation: fadeIn 1s;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .bubble {
                max-width: 72%;
                padding: 13px 18px 13px 18px;
                border-radius: 22px;
                word-break: break-word;
                white-space: pre-wrap;
                font-size: 1.08em;
                font-family: 'Inter', sans-serif;
                box-shadow: 0 2px 16px 0 rgba(0,0,0,0.13);
                opacity: 0;
                transform: translateY(16px) scale(0.97);
                animation: bubbleIn 0.5s forwards;
            }
            @keyframes bubbleIn {
                to { opacity: 1; transform: none; }
            }
            .bubble.user {
                align-self: flex-end;
                background: linear-gradient(135deg, #007acc 0%, #00e6d0 100%);
                color: #fff;
                box-shadow: 0 2px 18px 0 rgba(0,122,204,0.13);
                border-bottom-right-radius: 6px;
            }
            .bubble.assistant {
                align-self: flex-start;
                background: linear-gradient(135deg, #282a36 60%, #232526 100%);
                color: #e5e7eb;
                border-bottom-left-radius: 6px;
                box-shadow: 0 2px 18px 0 rgba(40,42,54,0.09);
            }
            .chat-input-area {
                display: flex;
                align-items: center;
                padding: 18px 20px 18px 20px;
                background: rgba(34,39,46,0.90);
                border-top: 1px solid #2a2d34;
                position: relative;
                z-index: 2;
                box-shadow: 0 -3px 16px 0 rgba(0,0,0,0.07);
            }
            .chat-input {
                flex: 1;
                background: rgba(24,26,27,0.91);
                color: #e5e7eb;
                border: none;
                border-radius: 14px;
                padding: 14px 14px 14px 16px;
                font-size: 1.09em;
                outline: none;
                resize: none;
                min-height: 44px;
                max-height: 110px;
                margin-right: 12px;
                box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08) inset;
                transition: box-shadow 0.2s, background 0.2s;
            }
            .chat-input:focus {
                box-shadow: 0 0 0 2px #00e6d0 inset, 0 2px 8px 0 rgba(0,0,0,0.08) inset;
                background: rgba(30,34,45,0.98);
            }
            .send-btn {
                background: linear-gradient(90deg, #00e6d0 0%, #007acc 100%);
                color: #fff;
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5em;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 18px 0 rgba(0,122,204,0.19);
                transition: background 0.22s, box-shadow 0.22s, transform 0.16s;
                position: relative;
                outline: none;
            }
            .send-btn:active {
                transform: scale(0.93);
                background: linear-gradient(90deg, #007acc 0%, #00e6d0 100%);
            }
            .send-btn:disabled {
                background: #444;
                cursor: not-allowed;
                box-shadow: none;
            }
            .send-btn svg {
                width: 28px;
                height: 28px;
                pointer-events: none;
            }
            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 1.03em;
                color: #00e6d0;
                margin-left: 2px;
                margin-bottom: 4px;
                min-height: 32px;
                font-weight: 600;
                animation: fadeIn 0.45s;
                letter-spacing: 0.02em;
            }
            .typing-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #00e6d0;
                opacity: 0.7;
                margin-right: 2px;
                animation: blink 1.3s infinite both;
            }
            .typing-dot:nth-child(2) {
                animation-delay: 0.17s;
            }
            .typing-dot:nth-child(3) {
                animation-delay: 0.34s;
            }
            @keyframes blink {
                0% { opacity: 0.2; }
                18% { opacity: 0.6; }
                35% { opacity: 1; }
                60% { opacity: 0.2; }
                100% { opacity: 0.2; }
            }
            ::-webkit-scrollbar {
                width: 8px;
                background: #23272e;
            }
            ::-webkit-scrollbar-thumb {
                background: #35383e;
                border-radius: 6px;
            }
        </style>
    </head>
    <body>
        <div class="chat-header">AI Code Chat</div>
        <div id="messages" class="messages"></div>
        <div class="chat-input-area">
            <textarea id="chat-input" class="chat-input" rows="1" placeholder="Ask me anything about code... (Ctrl+Enter to send)"></textarea>
            <button id="send-btn" class="send-btn" title="Send">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 20L21 12L3 4V10L17 12L3 14V20Z" fill="white"/>
                </svg>
            </button>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            const messagesDiv = document.getElementById('messages');
            const input = document.getElementById('chat-input');
            const sendBtn = document.getElementById('send-btn');
            let isAssistantTyping = false;

            function addMessage(text, sender) {
                const bubble = document.createElement('div');
                bubble.className = 'bubble ' + sender;
                bubble.textContent = text;
                messagesDiv.appendChild(bubble);
                setTimeout(() => {
                    bubble.style.opacity = '1';
                    bubble.style.transform = 'none';
                }, 22);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }

            function addTypingIndicator() {
                if (document.getElementById('typing-ind')) return;
                const typing = document.createElement('div');
                typing.id = 'typing-ind';
                typing.className = 'typing-indicator';
                typing.innerHTML = \`
                    <span>AI is thinking</span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                \`;
                messagesDiv.appendChild(typing);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }

            function removeTypingIndicator() {
                const typing = document.getElementById('typing-ind');
                if (typing) typing.remove();
            }

            async function handleSend() {
                const question = input.value.trim();
                if (!question || isAssistantTyping) return;
                addMessage(question, 'user');
                input.value = '';
                input.style.height = '44px';
                isAssistantTyping = true;
                addTypingIndicator();

                vscode.postMessage({ command: 'askGroq', text: question });
            }

            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'groqResponse') {
                    removeTypingIndicator();
                    addMessage(message.text, 'assistant');
                    isAssistantTyping = false;
                }
            });

            sendBtn.onclick = handleSend;
            input.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                }
            });

            input.addEventListener('input', () => {
                input.style.height = '44px';
                input.style.height = (input.scrollHeight) + 'px';
            });

            window.onload = () => {
                setTimeout(() => {
                    addMessage("👋 Hi! I'm your AI code assistant. Ask me anything about code, errors, or best practices.", 'assistant');
                }, 300);
                input.focus();
            };
        </script>
    </body>
    </html>
    `;
}

export function deactivate() {}
