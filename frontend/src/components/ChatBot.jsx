import { useState, useEffect, useRef } from 'react';
import { getBackendUrl } from '../utils/api';

const BACKEND = getBackendUrl();

const ChatBot = ({ chatOpen, setChatOpen }) => {
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: "Hello! I'm the Hadescore Apex & Technologies Assistant. How can I help with your technology and training strategy today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Scroll chat window to bottom on new messages
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen, isTyping]);

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const updatedMsgs = [...chatMessages, { sender: 'user', text: userMsg }];
    setChatMessages(updatedMsgs);
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${BACKEND}/api/chatbot/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { sender: 'assistant', text: data.reply, isError: data.is_error }]);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      // Fallback: Generate automated replies based on keywords if backend is offline
      setTimeout(() => {
        let replyText = "That sounds interesting! Let's connect you with one of our technology advisors. Please send a message via our Contact page, and we will set up a detailed planning session.";
        const lowerMsg = userMsg.toLowerCase();
        let isError = false;

        if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('rate') || lowerMsg.includes('fee')) {
          replyText = "Learning Hub features transparent course pricing packages. You can explore standard online and offline fees on the 'Learning Hub' page using our dynamic catalog calculator, or send an inquiry for custom technology services pricing.";
        } else if (lowerMsg.includes('course') || lowerMsg.includes('program') || lowerMsg.includes('learning') || lowerMsg.includes('learn')) {
          replyText = "Learning Hub features 8 tracks: MERN Fullstack Development, Kotlin/Flutter Mobile Dev, AI & Prompt Engineering, Cybersecurity SOC, Mechatronics & Robotics, Drone Design, Biotech, and Startup Bootcamps. Curriculums and pricing are available on the 'Learning Hub' tab!";
        } else if (lowerMsg.includes('about') || lowerMsg.includes('hadescore') || lowerMsg.includes('who are you')) {
          replyText = "Hadescore Apex & Technologies is a multi-domain technology startup and talent acceleration ecosystem. We combine software development, mobile apps, UI/UX design, AI integrations, digital marketing, and incubation programs.";
        } else if (lowerMsg.includes('career') || lowerMsg.includes('job') || lowerMsg.includes('work')) {
          replyText = "We are always looking for talented developers, designers, and mentors. Check out our open positions on the 'Careers' tab and apply directly!";
        } else {
          // If no keywords matched, show the polite off-topic / query boundary message
          replyText = "I can only assist with questions regarding Hadescore Apex & Technologies services, courses, careers, and contact info. Please let me know how I can help you with these topics!";
          isError = true;
        }

        setChatMessages(prev => [...prev, { sender: 'assistant', text: replyText, isError: isError }]);
      }, 600);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button className="chatbot-toggle-btn" aria-label="Toggle Chat" onClick={() => setChatOpen(!chatOpen)}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98 1 4.28L2 22l5.72-1c1.3.64 2.74 1 4.28 1 5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
        </svg>
      </button>

      {chatOpen && (
        <div className="chatbot-pane">
          <div className="chatbot-header">
            <div className="chatbot-title-area">
              <div className="chatbot-status-icon"></div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'white' }}>Hadescore Apex & Technologies</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)' }}>Online</div>
              </div>
            </div>
            <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setChatOpen(false)}>×</button>
          </div>

          <div className="chatbot-history">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chatbot-msg-bubble ${msg.sender} ${msg.isError ? 'error-bubble' : ''}`}>
                {msg.isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontWeight: '800', marginBottom: '6px', fontSize: '0.72rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Topic Limitation Notice
                  </div>
                )}
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chatbot-msg-bubble assistant typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={chatBottomRef}></div>
          </div>

          <form onSubmit={handleSendChatMessage} className="chatbot-input-area">
            <input
              type="text"
              placeholder="Ask anything"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              required
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
