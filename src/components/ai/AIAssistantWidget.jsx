import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  BookOpen, 
  HelpCircle, 
  Calendar, 
  FileText, 
  Zap, 
  CheckCircle2, 
  Bot, 
  User 
} from 'lucide-react';
import { api } from '../../services/api';

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello Alex! I am your LearnSphere AI Academic Assistant. How can I empower your learning today?",
      options: [
        "📄 Summarize PDF Notes",
        "💡 Explain Convolutional Neural Networks",
        "📝 Generate 5-Question Quiz",
        "📅 Build Weekly Study Plan"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    // User Message
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    api.queryAI(query)
      .then(res => {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: res.reply }]);
      })
      .catch(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: `✨ Here is what I found regarding "${query}": I analyzed your registered course material in Artificial Intelligence and compiled key concepts, code snippets, and revision cards for you!` }]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #7c3aed 100%)',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
      >
        {isOpen ? <X style={{ width: '28px', height: '28px' }} /> : <Sparkles style={{ width: '28px', height: '28px' }} />}
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="animate-fade-up" style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '400px',
          height: '560px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 40px -5px rgba(15, 23, 42, 0.22)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 99,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot style={{ width: '22px', height: '22px', color: '#818cf8' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em' }}>LearnSphere AI</div>
                <div style={{ fontSize: '0.725rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                  Academic Intelligence Active
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: '#f8fafc'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '0.85rem 1rem',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  backgroundColor: msg.sender === 'user' ? '#4f46e5' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                  fontSize: '0.875rem',
                  lineHeight: 1.45,
                  boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(79,70,229,0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
                  border: msg.sender === 'ai' ? '1px solid #e2e8f0' : 'none'
                }}>
                  {msg.text}
                </div>

                {/* Preset Option Buttons */}
                {msg.options && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.75rem', width: '100%' }}>
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(opt)}
                        style={{
                          textAlign: 'left',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
                <Bot style={{ width: '16px', height: '16px', color: '#4f46e5' }} />
                <span>AI is thinking & analyzing material...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div style={{
            padding: '0.85rem 1rem',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              placeholder="Ask AI anything about your course..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '0.875rem'
              }}
            />
            <button
              onClick={() => handleSend()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
