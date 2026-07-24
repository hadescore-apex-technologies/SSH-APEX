import { useState, useEffect, useRef } from 'react';
import { getBackendUrl } from '../utils/api';

const QUICK_REPLIES = [
  { text: "📚 View courses", query: "What courses do you offer?" },
  { text: "💰 Check pricing", query: "What is your pricing?" },
  { text: "💼 Browse careers", query: "Are you hiring?" },
  { text: "📞 Contact info", query: "How can I contact you?" },
  { text: "🛠️ Your services", query: "What services do you provide?" },
];

const ChatBotEnhanced = ({ chatOpen, setChatOpen }) => {
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'assistant', 
      text: "Hello! I'm the Hadescore Apex & Technologies Assistant. How can I help with your technology and training strategy today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messageFeedback, setMessageFeedback] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const chatBottomRef = useRef(null);
  const recognitionRef = useRef(null);

  // Generate or retrieve session ID
  useEffect(() => {
    let storedSessionId = localStorage.getItem('chatbot_session_id');
    if (!storedSessionId) {
      storedSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatbot_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('chatbot_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 1) {
          setChatMessages(parsed);
          setShowQuickReplies(false);
        }
      } catch (error) {
        console.error('Failed to load chat history');
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatMessages.length > 1) {
      localStorage.setItem('chatbot_history', JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen, isTyping]);

  // Simulate typing delay based on text length
  const simulateTyping = (text) => {
    const wordsPerMinute = 180;
    const wordCount = text.split(' ').length;
    const delay = (wordCount / wordsPerMinute) * 60 * 1000;
    return Math.min(Math.max(delay, 600), 2500); // Between 0.6s and 2.5s
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const userMessage = {
      sender: 'user',
      text: userMsg,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    setShowQuickReplies(false);

    try {
      const res = await fetch(`${getBackendUrl()}/api/chatbot/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: userMsg,
          session_id: sessionId
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Simulate realistic typing delay
        setTimeout(() => {
          const assistantMessage = {
            sender: 'assistant',
            text: data.reply,
            isError: data.is_error,
            timestamp: data.timestamp || new Date().toISOString(),
            actions: data.actions || []
          };
          setChatMessages(prev => [...prev, assistantMessage]);
          setIsTyping(false);
        }, simulateTyping(data.reply));
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Fallback responses
      setTimeout(() => {
        let replyText = "That sounds interesting! Let's connect you with one of our technology advisors. Please send a message via our Contact page.";
        const lowerMsg = userMsg.toLowerCase();
        let isError = false;

        if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('fee')) {
          replyText = "Learning Hub features transparent course pricing packages. You can explore fees on the 'Learning Hub' page, or send an inquiry for custom services pricing.";
        } else if (lowerMsg.includes('course') || lowerMsg.includes('program') || lowerMsg.includes('learn')) {
          replyText = "Learning Hub features 8 tracks: MERN Fullstack, Mobile Dev, AI Engineering, Cybersecurity, Mechatronics, Drone Design, Biotech, and Startup Bootcamp!";
        } else if (lowerMsg.includes('about') || lowerMsg.includes('hadescore')) {
          replyText = "Hadescore Apex & Technologies is a multi-domain technology startup and talent acceleration ecosystem combining software services, education, and incubation.";
        } else if (lowerMsg.includes('career') || lowerMsg.includes('job')) {
          replyText = "We're hiring developers, designers, and mentors. Check out our open positions on the 'Careers' page!";
        } else {
          replyText = "I can only assist with questions regarding Hadescore Apex services, courses, careers, and contact info. How can I help?";
          isError = true;
        }

        setChatMessages(prev => [...prev, {
          sender: 'assistant',
          text: replyText,
          isError: isError,
          timestamp: new Date().toISOString()
        }]);
        setIsTyping(false);
      }, 600);
    }
  };

  const handleQuickReply = (query) => {
    setChatInput(query);
    setTimeout(() => {
      document.querySelector('.chatbot-input-area button[type="submit"]')?.click();
    }, 100);
  };

  const handleFeedback = async (messageIndex, feedback, messageText, userQuery) => {
    setMessageFeedback(prev => ({ ...prev, [messageIndex]: feedback }));
    
    try {
      await fetch(`${getBackendUrl()}/api/chatbot/feedback/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: messageText,
          user_query: userQuery || '',
          feedback: feedback,
        }),
      });
    } catch (error) {
      console.error('Feedback submission failed:', error);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const clearChatHistory = () => {
    if (confirm('Clear all chat history?')) {
      localStorage.removeItem('chatbot_history');
      setChatMessages([{
        sender: 'assistant',
        text: "Hello! I'm the Hadescore Apex & Technologies Assistant. How can I help?",
        timestamp: new Date().toISOString()
      }]);
      setShowQuickReplies(true);
      setMessageFeedback({});
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button 
        className="chatbot-toggle-btn" 
        aria-label="Toggle Chat" 
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f9cff 0%, #00e5ff 100%)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(79, 156, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(79, 156, 255, 0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(79, 156, 255, 0.4)';
        }}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98 1 4.28L2 22l5.72-1c1.3.64 2.74 1 4.28 1 5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
        </svg>
      </button>

      {chatOpen && (
        <div className="chatbot-pane">
          <div className="chatbot-header">
            <div className="chatbot-title-area">
              <div className="chatbot-status-icon"></div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'white' }}>
                  Hadescore Apex & Technologies
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)' }}>
                  Online
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: '0.75rem', 
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'background 0.2s ease'
                }}
                onClick={clearChatHistory}
                title="Clear chat history"
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                🗑️
              </button>
              <button 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: '1.2rem', 
                  cursor: 'pointer' 
                }} 
                onClick={() => setChatOpen(false)}
              >
                ×
              </button>
            </div>
          </div>

          <div className="chatbot-history">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chatbot-msg-bubble ${msg.sender}`}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                
                {/* Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="message-actions" style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px', 
                    marginTop: '12px' 
                  }}>
                    {msg.actions.map((action, actionIdx) => (
                      <a
                        key={actionIdx}
                        href={action.url}
                        className="action-btn"
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          background: 'var(--primary)',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease'
                        }}
                        target={action.url.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                      >
                        {action.label} →
                      </a>
                    ))}
                  </div>
                )}

                {/* Feedback Buttons */}
                {msg.sender === 'assistant' && !msg.isError && idx > 0 && (
                  <div className="message-feedback" style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    marginTop: '8px', 
                    fontSize: '0.85rem' 
                  }}>
                    <button
                      className={`feedback-btn ${messageFeedback[idx] === 'helpful' ? 'active' : ''}`}
                      onClick={() => handleFeedback(idx, 'helpful', msg.text, chatMessages[idx-1]?.text)}
                      title="Helpful"
                      style={{
                        background: messageFeedback[idx] === 'helpful' ? '#10b981' : 'transparent',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: messageFeedback[idx] ? 1 : 0.6
                      }}
                    >
                      👍
                    </button>
                    <button
                      className={`feedback-btn ${messageFeedback[idx] === 'not_helpful' ? 'active' : ''}`}
                      onClick={() => handleFeedback(idx, 'not_helpful', msg.text, chatMessages[idx-1]?.text)}
                      title="Not helpful"
                      style={{
                        background: messageFeedback[idx] === 'not_helpful' ? '#ef4444' : 'transparent',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: messageFeedback[idx] ? 1 : 0.6
                      }}
                    >
                      👎
                    </button>
                  </div>
                )}
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

          {/* Quick Replies */}
          {showQuickReplies && chatMessages.length === 1 && (
            <div className="chatbot-quick-replies" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '12px',
              borderTop: '1px solid var(--border)',
              background: 'rgba(11, 15, 30, 0.45)'
            }}>
              {QUICK_REPLIES.map((reply, idx) => (
                <button
                  key={idx}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply.query)}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    color: '#ffffff',
                    fontWeight: '600',
                    boxShadow: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #4f9cff, #00e5ff)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 229, 255, 0.25)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {reply.text}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSendChatMessage} className="chatbot-input-area">
            <input
              type="text"
              placeholder="Ask about pricing, courses, services..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className={`voice-input-btn ${isListening ? 'listening' : ''}`}
              onClick={startVoiceInput}
              title="Voice input"
              style={{
                background: isListening ? '#ef4444' : 'transparent',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                transition: 'all 0.2s ease'
              }}
            >
              🎤
            </button>
            <button type="submit" style={{ padding: '8px 16px' }}>Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBotEnhanced;
