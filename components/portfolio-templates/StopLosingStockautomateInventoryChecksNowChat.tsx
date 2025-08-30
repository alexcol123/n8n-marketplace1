"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PortfolioShell from "@/components/portfolio-templates/PortfolioShell";
import { usePortfolioSubmit } from "@/hooks/usePortfolioSubmit";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export default function StopLosingStockautomateInventoryChecksNowChat({ siteName }: { siteName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: 'Hello! I\'m here to help you with Stop Losing Stock—Automate Inventory Checks Now! 📉. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const { submit, loading } = usePortfolioSubmit(siteName);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Send to n8n webhook via portfolio API
    const response = await submit({
      type: 'chat',
      message: inputValue,
      timestamp: new Date().toISOString()
    });

    if (response.success) {
      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.message || response.data?.response || 'I received your message and processed it successfully.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } else {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'system',
        content: response.error || 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <PortfolioShell 
      siteName={siteName}
      title="Stop Losing Stock—Automate Inventory Checks Now! 📉 Chat Assistant"
      description="AI-powered chat interface for Stop Losing Stock—Automate Inventory Checks Now! 📉"
    >
      <Card className="w-full max-w-2xl bg-card shadow-2xl border-primary/20 mx-auto h-[70vh] flex flex-col">
        <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-primary/5 p-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Stop Losing Stock—Automate Inventory Checks Now! 📉 Chat Assistant
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            AI-powered chat interface for Stop Losing Stock—Automate Inventory Checks Now! 📉
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type !== 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`flex flex-col max-w-[70%] ${
                    message.type === 'user' ? 'items-end' : 'items-start'
                  }`}>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : message.type === 'system'
                          ? 'bg-muted text-muted-foreground italic'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  {message.type === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSubmit} className="p-4 border-t bg-background/50">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about this workflow..."
                disabled={loading}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                disabled={loading || !inputValue.trim()}
                size="icon"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Quick suggestion buttons */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {[
                "How does this work?",
                "Show me an example",
                "What can you help me with?"
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(suggestion)}
                  disabled={loading}
                  className="text-xs bg-background/50 hover:bg-background/80"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </form>
        </CardContent>
      </Card>
    </PortfolioShell>
  );
}