import { useState, useEffect } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/storage")
      .then(res => res.json())
      .then(data => {
        if (data.messages) setMessages(data.messages);
      })
      .catch(() => {});
  }, []);

  const saveMemory = (msgs) => {
    fetch("http://localhost:3001/api/storage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs }),
    });
  };

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a senior Amazon SEO and PPC expert." },
            ...newMessages,
          ],
        }),
      });

      const data = await res.json();

      let reply =
        data?.choices?.[0]?.message?.content ||
        data?.content?.[0]?.text ||
        "No response";

      const updatedMessages = [...newMessages, { role: "assistant", content: reply }];
      setMessages(updatedMessages);
      saveMemory(updatedMessages);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1>🚀 Project Cloud AI Agent</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={styles.message}>
            <b>{msg.role}:</b> {msg.content}
          </div>
        ))}
        {loading && <p>Thinking...</p>}
      </div>

      <div style={styles.inputContainer}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20 },
  chatBox: { height: 400, overflowY: "auto" },
  message: { marginBottom: 10 },
  inputContainer: { display: "flex", gap: 10 },
};
