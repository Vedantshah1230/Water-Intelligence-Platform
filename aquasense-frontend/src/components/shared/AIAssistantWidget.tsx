import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hello! I am AquaSense AI. How can I assist you with water management today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const currentInput = input;
    setInput('');
    
    // Mock AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `Based on current analytics, "${currentInput}" could relate to recent turbidity spikes in Reservoir A. Would you like me to generate a full diagnostic report?`
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-24 md:bottom-8 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      {/* Chat Window */}
      <div className={cn(
        "fixed bottom-24 md:bottom-8 right-6 w-[350px] md:w-[400px] h-[500px] z-50 transition-all duration-300 origin-bottom-right shadow-2xl rounded-2xl flex flex-col bg-surface border border-outline-variant",
        isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
      )}>
        <div className="bg-primary text-on-primary p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-headline-sm">AquaSense AI</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-primary-container hover:text-on-primary-container p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-container-lowest">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] p-3 rounded-2xl font-body-sm shadow-sm",
                msg.role === 'user' ? "bg-primary text-on-primary rounded-br-sm" : "bg-surface-container text-on-surface rounded-bl-sm"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-surface border-t border-outline-variant rounded-b-2xl">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask AquaSense AI..." 
              className="flex-1 !bg-surface-container-lowest"
            />
            <Button type="submit" size="sm" className="h-10 w-10 p-0 rounded-xl">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
