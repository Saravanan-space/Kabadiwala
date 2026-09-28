'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  MessageSquareText,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  TrendingUp,
  Volume2,
  Minimize2,
  Maximize2,
  RefreshCw,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    screen: string;
    icon?: string;
  };
  ratesTable?: Array<{ name: string; rate: string; trend: 'up' | 'stable' | 'down' }>;
}

interface AIChatbotProps {
  onNavigate: (screen: string) => void;
}

const PRE_TRAINED_QUESTIONS = [
  {
    id: 'rates_today',
    label: "📊 Today's E-Waste Rates",
    query: "What are today's e-waste scrap rates?",
  },
  {
    id: 'sell_process',
    label: '📸 How to Sell & Scan',
    query: 'How does AI photo scanning and selling work?',
  },
  {
    id: 'mobile_laptop',
    label: '📱 Phone & Laptop Price',
    query: 'What is the price for old smartphones, laptops, and cables?',
  },
  {
    id: 'pickup_drop',
    label: '🚚 Pickup & Drop Options',
    query: 'How does doorstep pickup vs center drop-off work?',
  },
  {
    id: 'epr_certificate',
    label: '📜 EPR Certificate Info',
    query: 'What is an EPR recycling certificate and how to get it?',
  },
  {
    id: 'view_earnings',
    label: '💵 Check My Earnings',
    query: 'Where can I see my total earnings and past payouts?',
  },
];

const mapLabelToScreen = (label: string): string | null => {
  const l = label.toLowerCase();
  if (l.includes('sell') || l.includes('scan') || l.includes('photo') || l.includes('camera') || l.includes('upload')) return 'sell';
  if (l.includes('rate') || l.includes('price') || l.includes('bhav') || l.includes('today')) return 'todays_rates';
  if (l.includes('recycler') || l.includes('center') || l.includes('facility') || l.includes('near')) return 'find_recycler';
  if (l.includes('earning') || l.includes('payout') || l.includes('wallet') || l.includes('paid')) return 'my_earnings';
  if (l.includes('lot') || l.includes('certificate') || l.includes('epr') || l.includes('manifest')) return 'my_lots';
  if (l.includes('help') || l.includes('support') || l.includes('contact') || l.includes('faq')) return 'help';
  return null;
};

function FormattedText({
  text,
  isUser,
  onActionClick,
}: {
  text: string;
  isUser: boolean;
  onActionClick: (screen: string) => void;
}) {
  const parseInline = (str: string) => {
    const parts: React.ReactNode[] = [];
    // Matches **bold text**, [Action button/screen], or `code`
    const regex = /(\*\*[^*]+\*\*|\[[a-zA-Z0-9\s&–—'’/→\-]+\]|`[^`]+`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      const token = match[0];

      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong
            key={`bold_${match.index}`}
            className={`font-bold ${isUser ? 'text-white' : 'text-slate-900 font-semibold'}`}
          >
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={`code_${match.index}`}
            className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
              isUser ? 'bg-emerald-900 text-emerald-100' : 'bg-slate-100 text-slate-800'
            }`}
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('[') && token.endsWith(']')) {
        const actionLabel = token.slice(1, -1).trim();
        const screenKey = mapLabelToScreen(actionLabel);

        if (screenKey) {
          parts.push(
            <button
              key={`act_${match.index}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onActionClick(screenKey);
              }}
              className="inline-flex items-center gap-1 my-1 mx-1 px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          );
        } else {
          parts.push(
            <span
              key={`pill_${match.index}`}
              className={`inline-block font-semibold px-1.5 py-0.5 rounded ${
                isUser ? 'bg-emerald-900 text-emerald-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {actionLabel}
            </span>
          );
        }
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }
    return parts.length > 0 ? parts : str;
  };

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Check if line is a header (### or ##)
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <h5
              key={idx}
              className={`font-bold text-xs sm:text-sm pt-1 pb-0.5 ${
                isUser ? 'text-emerald-100' : 'text-slate-900'
              }`}
            >
              {parseInline(headerText)}
            </h5>
          );
        }

        // Check if bullet point (* or - or •)
        const bulletMatch = trimmed.match(/^(\*|\-|\u2022)\s+(.*)/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  isUser ? 'bg-emerald-200' : 'bg-emerald-700'
                }`}
              />
              <div className="flex-1">{parseInline(bulletMatch[2])}</div>
            </div>
          );
        }

        // Check if numbered item (1. 2. etc.)
        const numMatch = trimmed.match(/^([0-9]+\.)\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 py-0.5">
              <span
                className={`font-bold text-xs shrink-0 ${
                  isUser ? 'text-emerald-200' : 'text-emerald-800'
                }`}
              >
                {numMatch[1]}
              </span>
              <div className="flex-1">{parseInline(numMatch[2])}</div>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
}

export function AIChatbot({ onNavigate }: AIChatbotProps) {
  const { t, speakText, isSpeaking } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'bot',
      text: "Namaste! 🙏 I am your Kabadiwala AI Assistant. Ask me anything about live scrap rates, instant AI photo scanning, pickup options, or navigation!",
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: text,
          messages: [...messages, userMsg],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const botMsg: ChatMessage = {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsTyping(false);
          return;
        }
      }
      // If server responded with error or missing key, use local domain response
      const fallbackResponse = generateAIResponse(text);
      setMessages((prev) => [...prev, fallbackResponse]);
    } catch {
      // Offline / network failure fallback
      const fallbackResponse = generateAIResponse(text);
      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Rates Query
    if (q.includes('rate') || q.includes('price') || q.includes('bhav') || q.includes('cost') || q.includes('worth') || q.includes('value')) {
      if (q.includes('phone') || q.includes('mobile') || q.includes('laptop')) {
        return {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: "📱 High-Value Electronics Rates:\n• Smartphones / Mobile: ₹420–₹480/kg (Offer: ₹450/kg)\n• Laptops / Computers: ₹500–₹550/kg (Offer: ₹520/kg)\n• Printed Circuit Boards (PCB): ₹340–₹370/kg (Offer: ₹380/kg)\n• Copper Cables: ₹180–₹240/kg (Offer: ₹220/kg)\n\nYou can sell individual items or mixed scrap batches with instant AI photo recognition!",
          timestamp,
          actionButton: {
            label: "Sell Electronics Now →",
            screen: 'sell',
          },
        };
      }

      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "📈 Here are today's verified market rates across verified recyclers in your area:\n\n• Laptops: ₹520/kg (High Demand)\n• Smartphones: ₹450/kg (Rising ↑)\n• Circuit Boards (PCB): ₹380/kg (Rising ↑)\n• Copper Cables / Wire: ₹220/kg (Stable)\n• Copper Motors: ₹170/kg\n• Keyboards & Mice: ₹120/kg\n• Lithium Batteries: ₹100/kg\n• Monitors & Screens: ₹85/kg",
        timestamp,
        ratesTable: [
          { name: 'Laptop Computers', rate: '₹520/kg', trend: 'up' },
          { name: 'Smartphones & Mobile', rate: '₹450/kg', trend: 'up' },
          { name: 'PCBs & Motherboards', rate: '₹380/kg', trend: 'up' },
          { name: 'Copper Cables', rate: '₹220/kg', trend: 'stable' },
          { name: 'Lithium Battery Packs', rate: '₹100/kg', trend: 'stable' },
        ],
        actionButton: {
          label: "View Full Rates Board →",
          screen: 'todays_rates',
        },
      };
    }

    // 2. Sell / Scan Process
    if (q.includes('sell') || q.includes('scan') || q.includes('photo') || q.includes('camera') || q.includes('process') || q.includes('upload')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "📸 Selling e-waste takes under 60 seconds with AI:\n1. Open 'Sell Material' and snap or choose a photo of your scrap (or try the 1-click demo image).\n2. AI detects all materials with bounding boxes & estimates total weight and value.\n3. Enter/adjust weight for each material individually.\n4. Pick Home Pickup, Self Drop-off, or Both.\n5. Confirm fair price & match with authorized recyclers for instant digital payout!",
        timestamp,
        actionButton: {
          label: "Start AI Material Scan →",
          screen: 'sell',
        },
      };
    }

    // 3. Pickup vs Drop
    if (q.includes('pickup') || q.includes('drop') || q.includes('delivery') || q.includes('home') || q.includes('transport')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "🚚 We offer 3 flexible logistics options:\n• Home Pickup: Recycler picks up from your doorstep at your chosen time.\n• Self Drop-off: Drop your scrap at the nearest verified collection center.\n• Both (Flexible): Allow doorstep pickup or center drop-off based on mutual convenience.",
        timestamp,
        actionButton: {
          label: "Create a Pickup Lot →",
          screen: 'sell',
        },
      };
    }

    // 4. EPR Certificate
    if (q.includes('epr') || q.includes('certificate') || q.includes('invoice') || q.includes('cpcb') || q.includes('legal') || q.includes('compliance')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "📜 EPR (Extended Producer Responsibility) Compliance:\nEvery completed scrap batch receives an official Form 6 EPR Manifest & Recycling Certificate in PDF format.\n\nIt includes:\n• CPCB Registration & SPCB Consent references\n• Itemized weight, material code & HSN details\n• Quantified environmental mass balance (CO₂ saved, toxics diverted)\n• Authorized recycler digital stamp & signature.",
        timestamp,
        actionButton: {
          label: "View My Lots & Certificates →",
          screen: 'my_lots',
        },
      };
    }

    // 5. Earnings / Payout
    if (q.includes('earning') || q.includes('money') || q.includes('payout') || q.includes('paid') || q.includes('wallet') || q.includes('bank') || q.includes('history')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "💵 Payouts & Earnings:\nAll payouts are disbursed immediately upon digital handover verification via instant UPI or IMPS. You can track your total earnings, monthly trends, and transaction history in 'My Earnings'.",
        timestamp,
        actionButton: {
          label: "Open My Earnings →",
          screen: 'my_earnings',
        },
      };
    }

    // 6. Recycler Search
    if (q.includes('recycler') || q.includes('center') || q.includes('near') || q.includes('facility') || q.includes('authorized')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "🏢 Authorized Recycler Network:\nWe connect you exclusively with CPCB-authorized, R2v3-certified recyclers offering above-market fair rates and authorized digital handover.",
        timestamp,
        actionButton: {
          label: "Find Recycler →",
          screen: 'find_recycler',
        },
      };
    }

    // Fallback response
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: "I can help you check live scrap prices, sell materials using AI photo scan, schedule pickups, download official EPR certificates, or navigate the platform.",
      timestamp,
      actionButton: {
        label: "Check Today's Rates →",
        screen: 'todays_rates',
      },
    };
  };

  const handleActionClick = (screen: string) => {
    onNavigate(screen);
    // On mobile, collapse chat when navigating
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Bottom Trigger Button (Visible when chat is closed) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-5 right-5 z-40 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 border-2 border-emerald-400/80 group hover:shadow-emerald-900/40"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-emerald-900" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-black uppercase tracking-wider block text-emerald-200">
              Kabadiwala AI
            </span>
            <span className="text-sm font-bold text-white leading-none">
              Ask Rates & Help ✨
            </span>
          </div>
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-5 right-5 w-72 h-14 rounded-2xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] md:w-[450px] h-[580px] max-h-[85vh] rounded-3xl'
          } bg-white border border-slate-300 shadow-2xl flex flex-col overflow-hidden text-slate-900 font-sans`}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between gap-2 shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                    Kabadiwala AI Sahayak
                  </h4>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
                </div>
                <p className="text-[10px] text-emerald-300 font-medium truncate">
                  Live Scrap Rates & Smart Navigation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message History Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 text-xs sm:text-sm">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.sender === 'user'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[82%] rounded-2xl p-3 shadow-xs space-y-2 ${
                        msg.sender === 'user'
                          ? 'bg-emerald-800 text-white rounded-tr-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      <FormattedText
                        text={msg.text}
                        isUser={msg.sender === 'user'}
                        onActionClick={handleActionClick}
                      />

                      {/* Optional Rates Snippet */}
                      {msg.ratesTable && (
                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          {msg.ratesTable.map((r, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded-lg font-semibold"
                            >
                              <span className="text-slate-700">{r.name}</span>
                              <span className="text-emerald-800 font-bold">{r.rate}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Interactive Navigation Action Button */}
                      {msg.actionButton && (
                        <div className="pt-1">
                          <button
                            onClick={() => handleActionClick(msg.actionButton!.screen)}
                            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                          >
                            <span>{msg.actionButton.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div
                        className={`text-[9px] text-right font-medium ${
                          msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pl-9">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span>AI is finding verified scrap rates...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Pre-trained Quick Question Chips */}
              <div className="p-2.5 bg-white border-t border-slate-200 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {PRE_TRAINED_QUESTIONS.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleSendMessage(q.query)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap transition-all active:scale-95 shrink-0"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about scrap rates, photo scan, or pickup..."
                    className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-10 h-10 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
