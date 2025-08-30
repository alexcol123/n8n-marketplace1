"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Bot, Plus, Trash2 } from "lucide-react";

export interface SimpleChatConfig {
  title: string;
  description: string;
  welcomeMessage: string;
  quickMessages: string[];
}

interface SimpleChatBuilderProps {
  siteName: string;
  workflowTitle: string;
  onSave: (config: SimpleChatConfig) => void;
  onCancel: () => void;
  initialConfig?: SimpleChatConfig;
}

export default function SimpleChatBuilder({ 
  siteName, 
  workflowTitle, 
  onSave, 
  onCancel, 
  initialConfig 
}: SimpleChatBuilderProps) {
  const [config, setConfig] = useState<SimpleChatConfig>(
    initialConfig || {
      title: `${workflowTitle || siteName} Chat Assistant`,
      description: `AI-powered chat interface for ${workflowTitle || siteName}`,
      welcomeMessage: `Hello! I'm here to help you with ${workflowTitle || siteName}. How can I assist you today?`,
      quickMessages: [
        "How does this work?",
        "Show me an example",
        "What can you help me with?"
      ]
    }
  );

  const addQuickMessage = () => {
    if (config.quickMessages.length < 5) {
      setConfig(prev => ({
        ...prev,
        quickMessages: [...prev.quickMessages, "New quick message"]
      }));
    }
  };

  const updateQuickMessage = (index: number, message: string) => {
    setConfig(prev => ({
      ...prev,
      quickMessages: prev.quickMessages.map((msg, i) => i === index ? message : msg)
    }));
  };

  const removeQuickMessage = (index: number) => {
    setConfig(prev => ({
      ...prev,
      quickMessages: prev.quickMessages.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat Interface for: {workflowTitle || siteName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="chat-title">Chat Title</Label>
              <Input
                id="chat-title"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter chat title..."
              />
            </div>

            <div>
              <Label htmlFor="chat-description">Description</Label>
              <Input
                id="chat-description"
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="welcome-message">Welcome Message</Label>
            <Textarea
              id="welcome-message"
              value={config.welcomeMessage}
              onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
              placeholder="Enter the initial greeting message..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Quick Message Suggestions (Optional)
            </div>
            <Button
              onClick={addQuickMessage}
              disabled={config.quickMessages.length >= 5}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Message
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {config.quickMessages.map((message, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={message}
                  onChange={(e) => updateQuickMessage(index, e.target.value)}
                  placeholder="Enter a quick message suggestion..."
                  className="flex-1"
                />
                <Button
                  onClick={() => removeQuickMessage(index)}
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {config.quickMessages.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No quick messages added. Students will only have a text input to chat.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200/50">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 How it works:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Students will see this chat interface on their portfolio site</li>
          <li>• Students must configure their own webhook in the credentials panel</li>
          <li>• Messages are sent to their webhook - no webhook = no chat functionality</li>
          <li>• Their n8n workflow handles AI responses and business logic</li>
          <li>• You don't need to configure AI models - that's done in n8n</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(config)}>
          Create Chat Interface
        </Button>
      </div>
    </div>
  );
}