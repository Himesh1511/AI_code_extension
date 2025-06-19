# AI Code Chat VS Code Extension

AI Code Chat is a Visual Studio Code extension that provides an interactive, animated chat interface for AI-assisted coding support. Users can ask questions about code, errors, or programming practices, and receive answers powered by Groq's language model API.

---

## Features

- **Animated, Modern Chat UI**  
  A visually enhanced chat interface with animated bubbles, gradient backgrounds, and a refined send button.

- **AI-Powered Coding Assistance**  
  Pose questions related to code, error messages, or software development, and receive responses from a state-of-the-art language model.

- **Integrated Editor Experience**  
  Access the chat panel directly from the Command Palette, ensuring a seamless workflow within Visual Studio Code.

- **Typing Indicator and Auto-Scroll**  
  Real-time feedback on response generation and automatic scrolling to the latest message.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Himesh1511/AI_code_extension.git
cd AI_code_extension
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Groq API Key

In `extension.ts`, replace the placeholder in the `apiKey` variable with your Groq API Key. You can obtain an API key from the [Groq Console](https://console.groq.com/):

```typescript
const apiKey = "YOUR_GROQ_API_KEY";
```

### 4. Build and Launch the Extension

- Press `F5` in Visual Studio Code to open an Extension Development Host.
- Open the Command Palette (`Ctrl+Shift+P`), and run:
  ```
  Show Coding Helper Panel
  ```
- The AI chat panel will appear; you may now interact with the assistant.

---

## Architectural Overview

- The **backend** (Node.js) manages command registration, API communication, and message handling.
- The **frontend** is a custom webview (HTML, CSS, JavaScript) that renders the animated chat interface.
- Messages are exchanged between the webview and the backend; the backend fetches responses from the Groq API and relays them to the UI.

---

## Project Structure

| File/Folder      | Purpose                                         |
|------------------|-------------------------------------------------|
| `src/extension.ts`  | Main extension logic (backend and webview setup) |
| `package.json`   | Extension configuration, commands, dependencies  |
| `tsconfig.json`  | TypeScript configuration                         |
| `README.md`      | Project documentation                            |

---

## Customization

- **User Interface:**  
  The look and feel of the chat UI can be modified in the `getWebviewContent()` function in `extension.ts`.

- **AI Model Selection:**  
  The model used for AI responses can be changed by updating the `model` property in the API request within the `callGroqApi()` function.

---

## Frequently Asked Questions

**Q: Is any code or message sent to an external server?**  
A: Yes. User prompts are transmitted to Groq's servers for AI processing. Users should avoid sharing sensitive or confidential information.

**Q: Can I use a different AI provider?**  
A: Yes. You may modify the logic in the `callGroqApi()` function to interact with a different API or service.

---

## License

MIT License


This extension is intended to improve productivity and provide code-related assistance directly within Visual Studio Code. For questions, suggestions, or contributions, please refer to the repository or contact the maintainer.
