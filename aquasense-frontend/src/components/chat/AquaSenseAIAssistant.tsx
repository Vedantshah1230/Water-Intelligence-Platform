import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Maximize2,
  Minimize2,
  Copy,
  RefreshCw,
  Search,
  Sliders,
  MessageSquare,
  Check,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Database,
  UploadCloud
} from 'lucide-react';
import { aiAssistantApi, type ChatMessage, type UserRole, type Language, type SimulationResult } from '@/services/aiAssistantApi';
import { ragApi, type VectorChunk, type KnowledgeStats } from '@/services/ragApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const DEFAULT_SUGGESTED_QUESTIONS = [
  'Which reservoir is currently most critical?',
  'Show top active leak anomalies in the network',
  'What is our 30-day SDG 6 sustainability index?',
  'Simulate a 30% reduction in monsoon rainfall',
  'What are the BIS 10500 water quality standards?'
];

export function AquaSenseAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'simulator' | 'knowledge'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('WATER_OFFICER');
  const [language, setLanguage] = useState<Language>('en');
  const [feedbackState, setFeedbackState] = useState<Record<string, 'UP' | 'DOWN'>>({});

  // History & Pinning
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Voice AI
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Digital Twin Simulator
  const [simParams, setSimParams] = useState({
    populationChangePct: 20,
    rainfallChangePct: -30,
    reservoirLossPct: -40,
    industrialDemandPct: 100
  });
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // RAG Knowledge Store & Ingestion
  const [knowledgeStats, setKnowledgeStats] = useState<KnowledgeStats | null>(null);
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [searchResults, setSearchResults] = useState<VectorChunk[]>([]);
  const [ingestDoc, setIngestDoc] = useState({ title: '', category: 'Water Policy', content: '', source: '' });
  const [isIngesting, setIsIngesting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load chat history & RAG stats
  useEffect(() => {
    const saved = localStorage.getItem('aquasense_ai_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages(getInitialWelcomeMessages());
      }
    } else {
      setMessages(getInitialWelcomeMessages());
    }
    fetchKnowledgeStats();
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aquasense_ai_chat_history', JSON.stringify(messages.slice(-30)));
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchKnowledgeStats = async () => {
    try {
      const stats = await ragApi.getStats();
      setKnowledgeStats(stats);
    } catch (e) {
      console.warn('Failed to load knowledge stats');
    }
  };

  function getInitialWelcomeMessages(): ChatMessage[] {
    return [
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: `### 🌊 Welcome to AquaSense AI Assistant\n` +
          `*Your Intelligent Water Management Expert*\n\n` +
          `I am directly connected to live telemetry sensors, reservoir levels, groundwater tables, and a **15-Domain Vector RAG Knowledge Base**.\n\n` +
          `How can I assist your operations today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  }

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: userRole,
      language
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiAssistantApi.sendMessage(query, userRole, language);
      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      toast.error('Failed to communicate with AI Assistant backend');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Feedback (Continuous Learning)
  const handleFeedback = async (messageId: string, rating: 'UP' | 'DOWN') => {
    setFeedbackState((prev) => ({ ...prev, [messageId]: rating }));
    try {
      await ragApi.submitFeedback(messageId, rating);
      toast.success(rating === 'UP' ? 'Feedback recorded! Response upvoted 👍' : 'Feedback recorded for RAG tuning 👎');
      fetchKnowledgeStats();
    } catch (e) {
      toast.error('Failed to record feedback');
    }
  };

  // Voice Speech-to-Text (STT)
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast('Listening to your voice command...');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
      handleSendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice input error. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Text-to-Speech (TTS)
  const speakMessage = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech is not supported.');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`>]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US';

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy Message Text
  const copyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Download Report Action
  const handleDownloadReport = async () => {
    try {
      const blob = await aiAssistantApi.downloadReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AquaSense_Executive_Report_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      toast.success('Executive Report downloaded successfully');
    } catch (err: any) {
      toast.error('Failed to download report');
    }
  };

  // Action Button Handler
  const handleActionClick = (action: NonNullable<ChatMessage['actions']>[0]) => {
    if (action.type === 'NAVIGATE') {
      navigate(action.payload.path);
      setIsOpen(false);
    } else if (action.type === 'HIGHLIGHT_MAP') {
      navigate('/dashboard/map');
      toast.success('Navigated to GIS Map with active leaks highlighted');
      setIsOpen(false);
    } else if (action.type === 'DOWNLOAD_REPORT') {
      handleDownloadReport();
    } else if (action.type === 'SIMULATE_SCENARIO') {
      setActiveTab('simulator');
    }
  };

  // Digital Twin Simulation Execution
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const result = await aiAssistantApi.runSimulation(simParams);
      setSimResult(result);
      toast.success('Digital Twin simulation completed');
    } catch (err: any) {
      toast.error('Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  // Search RAG Knowledge Store
  const handleKnowledgeSearch = async (query: string) => {
    setKnowledgeSearch(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await ragApi.searchVectorKnowledge(query);
      setSearchResults(results);
    } catch (e) {
      console.warn('Vector search failed');
    }
  };

  // Ingest Document into RAG Vector Store
  const handleIngestDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingestDoc.title.trim() || !ingestDoc.content.trim()) {
      toast.error('Document title and content are required');
      return;
    }
    setIsIngesting(true);
    try {
      await ragApi.ingestDocument(ingestDoc);
      toast.success(`Ingested "${ingestDoc.title}" into RAG Vector Store!`);
      setIngestDoc({ title: '', category: 'Water Policy', content: '', source: '' });
      fetchKnowledgeStats();
    } catch (e) {
      toast.error('Failed to ingest document');
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group border border-white/20 backdrop-blur-md"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="font-semibold text-sm tracking-wide hidden sm:inline">AquaSense AI Assistant</span>
        </button>
      )}

      {/* Main Chat Assistant Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/30 dark:border-slate-800 rounded-2xl overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-8'
              : 'bottom-4 right-4 w-[95vw] sm:w-[540px] h-[670px] max-h-[88vh]'
          }`}
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary text-white rounded-xl shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-on-surface dark:text-white">AquaSense AI</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">v4.2 PRO RAG</span>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-slate-400">Your Intelligent Water Management Expert</p>
              </div>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-1.5">
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="text-xs bg-white/80 dark:bg-slate-800 border border-outline-variant/40 rounded-lg px-2 py-1 text-on-surface dark:text-slate-200"
                title="Switch Persona Role"
              >
                <option value="WATER_OFFICER">Water Officer</option>
                <option value="ENGINEER">Engineer</option>
                <option value="DATA_ANALYST">Data Analyst</option>
                <option value="FIELD_WORKER">Field Worker</option>
                <option value="CITIZEN">Citizen</option>
                <option value="ADMINISTRATOR">Administrator</option>
              </select>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="text-xs bg-white/80 dark:bg-slate-800 border border-outline-variant/40 rounded-lg px-2 py-1 text-on-surface dark:text-slate-200"
                title="Switch Language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-on-surface-variant dark:text-slate-300"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-on-surface-variant dark:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Header Tabs */}
          <div className="flex border-b border-outline-variant/20 bg-surface-container-low/50 px-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Conversational RAG
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition-colors ${
                activeTab === 'simulator'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Digital Twin Simulator
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition-colors ${
                activeTab === 'knowledge'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Vector Memory ({knowledgeStats?.totalChunks || 15})
            </button>
          </div>

          {/* TAB 1: Conversational Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-primary text-white rounded-br-none shadow-md'
                            : 'bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-outline-variant/30 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                        {msg.dataCard && (
                          <div className="mt-3 p-3 bg-surface-container-lowest dark:bg-slate-900/80 rounded-xl border border-outline-variant/30 space-y-2">
                            <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5" />
                              {msg.dataCard.title}
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {msg.dataCard.metrics.map((m, idx) => (
                                <div key={idx} className="p-2 bg-surface-container-low/50 dark:bg-slate-800 rounded-lg">
                                  <p className="text-[10px] text-on-surface-variant dark:text-slate-400">{m.label}</p>
                                  <p className="font-bold text-xs text-on-surface dark:text-slate-100">{m.value}</p>
                                </div>
                              ))}
                            </div>
                            {msg.dataCard.recommendation && (
                              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium italic">
                                💡 {msg.dataCard.recommendation}
                              </p>
                            )}
                          </div>
                        )}

                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-outline-variant/20">
                            {msg.actions.map((act, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleActionClick(act)}
                                className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                              >
                                <Sparkles className="w-3 h-3" />
                                {act.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Message Toolbar: Feedback Ratings & Audio Controls */}
                      {msg.sender === 'assistant' && (
                        <div className="flex items-center justify-between text-[10px] text-on-surface-variant/70 px-1 w-full">
                          <span>{msg.timestamp}</span>

                          <div className="flex items-center gap-2">
                            {/* Feedback Ratings */}
                            <button
                              onClick={() => handleFeedback(msg.id, 'UP')}
                              className={`p-1 hover:text-emerald-500 transition-colors ${
                                feedbackState[msg.id] === 'UP' ? 'text-emerald-500 font-bold' : ''
                              }`}
                              title="Upvote response (Tuning Memory)"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.id, 'DOWN')}
                              className={`p-1 hover:text-rose-500 transition-colors ${
                                feedbackState[msg.id] === 'DOWN' ? 'text-rose-500 font-bold' : ''
                              }`}
                              title="Downvote response"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>

                            {/* Copy & Voice */}
                            <button
                              onClick={() => copyText(msg.id, msg.text)}
                              className="p-1 hover:text-primary transition-colors"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => speakMessage(msg.id, msg.text)}
                              className="p-1 hover:text-primary transition-colors"
                              title="Read aloud"
                            >
                              {speakingMsgId === msg.id ? <VolumeX className="w-3 h-3 text-amber-500" /> : <Volume2 className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 items-center text-primary text-xs font-medium animate-pulse">
                    <Bot className="w-4 h-4 animate-spin" />
                    <span>Executing Cosine Similarity Vector RAG Retrieval & Telemetry Analysis...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Contextual Suggested Questions Bar */}
              <div className="px-4 py-2 bg-surface-container-lowest/50 dark:bg-slate-900/50 border-t border-outline-variant/20 overflow-x-auto flex gap-2 no-scrollbar">
                {DEFAULT_SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="whitespace-nowrap px-3 py-1 bg-surface-container-low dark:bg-slate-800 hover:bg-primary/10 hover:text-primary rounded-full text-xs text-on-surface-variant transition-colors flex-shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-outline-variant/30 flex items-center gap-2">
                <button
                  onClick={toggleVoiceInput}
                  className={`p-2.5 rounded-xl transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
                  }`}
                  title="Speech-to-Text Voice Query"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask AquaSense AI anything about water policies, leaks, CGWB rules..."
                  className="flex-1 px-4 py-2.5 text-sm bg-surface-container-low/60 dark:bg-slate-800 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary text-on-surface dark:text-white"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2.5 bg-primary text-white rounded-xl hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Digital Twin Simulator */}
          {activeTab === 'simulator' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-6">
              <div>
                <h3 className="font-bold text-base text-primary flex items-center gap-2">
                  <Sliders className="w-5 h-5" />
                  Digital Twin Scenario Stress Test
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">
                  Adjust environmental parameters below to simulate municipal supply risk & shortage projections in real time.
                </p>
              </div>

              <div className="space-y-4 bg-surface-container-low/50 dark:bg-slate-800/50 p-4 rounded-xl border border-outline-variant/30">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Population Growth (%)</span>
                    <span className="text-primary">+{simParams.populationChangePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={simParams.populationChangePct}
                    onChange={(e) => setSimParams({ ...simParams, populationChangePct: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Monsoon Rainfall Change (%)</span>
                    <span className="text-amber-500">{simParams.rainfallChangePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="20"
                    value={simParams.rainfallChangePct}
                    onChange={(e) => setSimParams({ ...simParams, rainfallChangePct: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Bhatsa Dam Capacity Loss (%)</span>
                    <span className="text-rose-500">{simParams.reservoirLossPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="0"
                    value={simParams.reservoirLossPct}
                    onChange={(e) => setSimParams({ ...simParams, reservoirLossPct: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isSimulating ? 'Simulating Digital Twin...' : 'Execute Digital Twin Simulation'}
              </button>

              {simResult && (
                <div className="p-4 bg-surface-container-lowest dark:bg-slate-800 rounded-xl border border-primary/30 space-y-3">
                  <h4 className="font-bold text-sm text-primary">Simulation Results</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-surface-container-low rounded-lg">
                      <p className="text-on-surface-variant">Simulated Risk Score</p>
                      <p className="font-bold text-lg text-rose-500">{simResult.simulatedRiskScore}/100 ({simResult.simulatedCategory})</p>
                    </div>
                    <div className="p-2.5 bg-surface-container-low rounded-lg">
                      <p className="text-on-surface-variant">Projected Deficit</p>
                      <p className="font-bold text-lg text-amber-500">{simResult.projectedDeficitMld} MLD</p>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-700 dark:text-amber-300 font-medium">
                    ⚠️ <strong>Recommended Action:</strong> {simResult.mitigationStrategy}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RAG Vector Knowledge Base & Document Ingestion */}
          {activeTab === 'knowledge' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-6">
              <div>
                <h3 className="font-bold text-base text-primary flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  RAG Vector Knowledge Base & Continuous Learning
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">
                  Explore indexed water engineering domains or upload custom policy manuals into vector memory.
                </p>
              </div>

              {/* Stats Overview Grid */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-center">
                  <p className="text-on-surface-variant">Indexed Chunks</p>
                  <p className="font-bold text-lg text-primary">{knowledgeStats?.totalChunks || 15}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                  <p className="text-on-surface-variant">User Upvotes</p>
                  <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">👍 {knowledgeStats?.upvotes || 0}</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
                  <p className="text-on-surface-variant">Domains</p>
                  <p className="font-bold text-lg text-amber-600 dark:text-amber-400">{knowledgeStats?.categoriesCount || 15}</p>
                </div>
              </div>

              {/* Vector Knowledge Search */}
              <div className="space-y-3">
                <h4 className="font-semibold text-xs text-on-surface dark:text-white flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  Search Indexed Vector Memory
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={knowledgeSearch}
                    onChange={(e) => handleKnowledgeSearch(e.target.value)}
                    placeholder="Search CGWB drawdown, BIS standards, leak SOPs..."
                    className="flex-1 px-3 py-2 text-xs bg-surface-container-low/60 dark:bg-slate-800 rounded-lg border border-outline-variant/30 text-on-surface dark:text-white"
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {searchResults.map((item) => (
                      <div key={item.id} className="p-2.5 bg-surface-container-lowest dark:bg-slate-800/80 rounded-lg border border-outline-variant/30 text-xs">
                        <div className="flex justify-between font-bold text-primary">
                          <span>{item.title}</span>
                          <span className="text-[10px] text-amber-500 font-normal">Score: {item.similarityScore}</span>
                        </div>
                        <p className="text-on-surface-variant dark:text-slate-300 text-[11px] mt-1">{item.content}</p>
                        <p className="text-[9px] text-on-surface-variant/70 mt-1 italic">Source: {item.source}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ingest Custom Document Form */}
              <form onSubmit={handleIngestDocument} className="p-4 bg-surface-container-low/50 dark:bg-slate-800/50 rounded-xl border border-outline-variant/30 space-y-3">
                <h4 className="font-semibold text-xs text-primary flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4" />
                  Continuous Learning: Ingest Custom Document / Policy
                </h4>
                <input
                  type="text"
                  placeholder="Document Title (e.g. Ward 4 Maintenance SOP 2026)"
                  value={ingestDoc.title}
                  onChange={(e) => setIngestDoc({ ...ingestDoc, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 rounded-lg border border-outline-variant/30 text-on-surface dark:text-white"
                  required
                />
                <textarea
                  placeholder="Paste document text, guidelines, or policy rules here..."
                  value={ingestDoc.content}
                  onChange={(e) => setIngestDoc({ ...ingestDoc, content: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 rounded-lg border border-outline-variant/30 text-on-surface dark:text-white"
                  required
                />
                <button
                  type="submit"
                  disabled={isIngesting}
                  className="w-full py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  {isIngesting ? 'Ingesting into Vector Memory...' : 'Ingest Document into AI Memory'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
