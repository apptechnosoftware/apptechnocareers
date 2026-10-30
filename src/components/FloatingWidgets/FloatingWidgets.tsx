import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import './FloatingWidgets.css';

const FloatingWidgets = () => {
  const { chatConversations, sendVisitorMessage, refreshChats } = useDataContext();

  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Restore session state
  useEffect(() => {
    const storedName = sessionStorage.getItem('appteknow_visitor_name');
    const storedPhone = sessionStorage.getItem('appteknow_visitor_phone');
    const storedConvoId = sessionStorage.getItem('appteknow_convo_id');
    if (storedName && storedPhone) {
      setVisitorName(storedName);
      setVisitorPhone(storedPhone);
      setNameSubmitted(true);
    }
    if (storedConvoId) {
      setConversationId(storedConvoId);
    }
  }, []);

  // Polling for new messages every 2 seconds when chat is open
  useEffect(() => {
    if (!chatOpen) return;
    const interval = setInterval(() => {
      refreshChats();
    }, 2000);
    return () => clearInterval(interval);
  }, [chatOpen, refreshChats]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatConversations, chatOpen]);

  // Get current conversation
  const currentConvo = conversationId
    ? chatConversations.find(c => c.id === conversationId)
    : null;

  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (visitorName.trim() && visitorPhone.trim()) {
      const name = visitorName.trim();
      const phone = visitorPhone.trim();
      setVisitorName(name);
      setVisitorPhone(phone);
      setNameSubmitted(true);
      sessionStorage.setItem('appteknow_visitor_name', name);
      sessionStorage.setItem('appteknow_visitor_phone', phone);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newConvoId = sendVisitorMessage(visitorName, visitorPhone, message.trim(), conversationId || undefined);
    
    if (!conversationId) {
      setConversationId(newConvoId);
      sessionStorage.setItem('appteknow_convo_id', newConvoId);
    }

    setMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="floating-widgets-container">
      
      {/* 1. WhatsApp Floating Widget (Bottom Left) */}
      <a 
        href="https://wa.me/917022928198" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float-btn"
        aria-label="Chat on WhatsApp"
      >
        <div className="pulse-ring"></div>
        <svg 
          viewBox="0 0 24 24" 
          className="whatsapp-svg-icon" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 6c-3.313 0-6 2.687-6 6 0 1.094.297 2.156.844 3.063l-.891 3.266 3.344-.875A5.96 5.96 0 0012.03 18c3.313 0 6-2.688 6-6s-2.687-6-6-6zm0 1c2.766 0 5 2.234 5 5s-2.234 5-5 5a4.976 4.976 0 01-2.547-.688l-.188-.109-1.906.5.516-1.859-.125-.203A4.963 4.963 0 017.03 12c0-2.766 2.234-5 5-5z" fill="none"/>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.709 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" fill="currentColor"/>
        </svg>
        <span className="whatsapp-tooltip">Chat on WhatsApp</span>
      </a>

      {/* 2. "We Are Here!" Chat Widget Container (Bottom Right) */}
      <div className="support-chat-wrapper">
        
        {/* Interactive Chat Panel */}
        <div className={`support-popup-panel ${chatOpen ? 'popup-active' : ''}`}>
          <div className="popup-header">
            <div className="popup-header-info">
              <span className="status-dot"></span>
              <div>
                <h4>AppTeknow Support</h4>
                <p>{currentConvo ? 'Chat active' : 'Typically replies instantly'}</p>
              </div>
            </div>
            <button className="popup-close-btn" onClick={() => setChatOpen(false)}>
              <X size={18} />
            </button>
          </div>
          
          <div className="popup-body">
            {/* Welcome message */}
            <div className="chat-bubble-incoming">
              Welcome to <strong>AppTeknow Careers</strong>! 💬
              <br /><br />
              Tell us which training or job guarantee support you're looking for! We are here to build your career.
            </div>

            {/* Name input phase */}
            {!nameSubmitted ? (
              <form className="visitor-name-form" onSubmit={handleIdentitySubmit}>
                <div className="name-prompt">
                  <User size={16} />
                  <span>Please provide your details to start:</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    required
                    className="visitor-name-input"
                    style={{ width: '100%' }}
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone Number"
                    value={visitorPhone}
                    onChange={(e) => {
                      const filtered = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setVisitorPhone(filtered);
                    }}
                    required
                    maxLength={10}
                    className="visitor-name-input"
                    style={{ width: '100%' }}
                  />
                  <button type="submit" className="name-submit-btn" style={{ width: '100%', marginLeft: 0 }}>
                    Start Professional Chat
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Message History */}
                {currentConvo && currentConvo.messages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`chat-msg ${msg.senderType === 'visitor' ? 'chat-msg-outgoing' : 'chat-msg-incoming'}`}
                  >
                    <div className="chat-msg-bubble">
                      <span className="chat-msg-sender">
                        {msg.senderType === 'admin' ? '🛡️ Support' : `👤 ${msg.senderName}`}
                      </span>
                      {msg.message}
                      <span className="chat-msg-time">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Message Input */}
          {nameSubmitted && (
            <form className="popup-footer" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <button type="submit" className="send-btn">
                <Send size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Floating Trigger Icon & Curved Arc */}
        <div className="support-trigger-area" onClick={() => setChatOpen(!chatOpen)}>
          
          {/* Curved "We Are Here!" Text SVG Overlay */}
          <div className="curved-text-container">
            <svg viewBox="0 0 100 32" className="curved-svg">
              <path id="text-curve" d="M 10,25 C 10,5 90,5 90,25" fill="none" />
              <text className="curved-text-node">
                <textPath href="#text-curve" startOffset="50%" textAnchor="middle">
                  We Are Here!
                </textPath>
              </text>
            </svg>
          </div>

          {/* The Round Green Bubble */}
          <button className={`chat-trigger-btn ${chatOpen ? 'active-pulse' : ''}`} aria-label="Support Chat">
            <MessageCircle size={28} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default FloatingWidgets;
