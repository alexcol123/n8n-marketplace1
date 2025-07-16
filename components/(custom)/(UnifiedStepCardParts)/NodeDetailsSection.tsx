"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Info,
  Settings,
  Code,
  Brain,
  FileText,
  MessageSquare,
  User,
  Bot,
  Check,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type OrderedWorkflowStep } from "@/utils/functions/WorkflowStepsInOrder";

// Types
interface AIMessage {
  role?: string;
  type?: string;
  content?: string;
  text?: string;
  message?: string;
}

interface NestedPrompt {
  path: string;
  content: string;
  type: "system" | "user" | "text";
}

interface NodeDetailsSectionProps {
  step: OrderedWorkflowStep;
  isAINode: () => boolean;
  isCodeNode: () => boolean;
  getCodeContent: () => {
    language: string;
    code: string;
    paramKey: string;
  } | null;
  getAIPrompts: () => {
    system: string;
    user: string;
    text: string;
    messages: AIMessage[];
    nestedPrompts: NestedPrompt[];
  } | null;
  formatAIPrompt: (text: string) => string;
}

export default function NodeDetailsSection({
  step,
  isAINode,
  isCodeNode,
  getCodeContent,
  getAIPrompts,
  formatAIPrompt,
}: NodeDetailsSectionProps) {
  const [showRawData, setShowRawData] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});






  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const CopyButton = ({ text, copyKey, className = "" }: { text: string; copyKey: string; className?: string }) => {
    const isCopied = copiedStates[copyKey];
    
    return (
      <button
        onClick={() => handleCopy(text, copyKey)}
        className={cn(
          "px-3 py-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded text-sm transition-colors",
          className
        )}
      >
        {isCopied ? <Check className="w-4 h-4 text-green-400" /> : "Copy"}
      </button>
    );
  };

  const CopyIconButton = ({ text, copyKey, className = "" }: { text: string; copyKey: string; className?: string }) => {
    const isCopied = copiedStates[copyKey];
    
    return (
      <button
        onClick={() => handleCopy(text, copyKey)}
        className={cn(
          "p-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors",
          className
        )}
      >
        {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
    );
  };

  const hasParameters = step.parameters && Object.keys(step.parameters).length > 0;
  const parameterCount = hasParameters && step.parameters ? Object.keys(step.parameters).length : 0;

  return (
    <div className="p-6  border rounded-2xl" >
      {/* Code section - GitHub-inspired */}
      {isCodeNode() &&
        (() => {
          const codeContent = getCodeContent();
          return (
            codeContent && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-600/20 rounded flex items-center justify-center">
                    <Code className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      {codeContent.language === "python" ? "Python" : "JavaScript"}
                    </h3>
                    <p className="text-neutral-400 text-sm">Code execution</p>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-md overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-neutral-800/50 border-b border-neutral-700">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-neutral-400 text-sm font-mono">
                        {codeContent.paramKey}.{codeContent.language === "python" ? "py" : "js"}
                      </span>
                    </div>
                    <CopyButton text={codeContent.code} copyKey="code-main" />
                  </div>
                  <ScrollArea className="h-64">
                    <pre className="p-4 text-neutral-100 text-sm font-mono leading-6 overflow-x-auto">
                      <code>{codeContent.code}</code>
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            )
          );
        })()}

      {/* AI prompts section - Netflix card style */}
      {isAINode() &&
        (() => {
          const prompts = getAIPrompts();
          return (
            prompts &&
            (prompts.system ||
              prompts.user ||
              prompts.text ||
              prompts.messages.length > 0 ||
              prompts.nestedPrompts.length > 0) && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-purple-600/20 rounded flex items-center justify-center">
                    <Brain className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">AI Configuration</h3>
                    <p className="text-neutral-400 text-sm">Model prompts and instructions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* System prompt */}
                  {prompts.system && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-neutral-800/30 border-b border-neutral-700/50">
                        <div className="flex items-center gap-3">
                          <Settings className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-200 font-medium text-sm">System</span>
                          <span className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded text-xs">
                            {prompts.system.length.toLocaleString()} chars
                          </span>
                        </div>
                        <CopyIconButton text={prompts.system} copyKey="system-prompt" />
                      </div>
                      <ScrollArea className="h-32">
                        <div className="p-4">
                          <pre className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {formatAIPrompt(prompts.system)}
                          </pre>
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {/* User prompt */}
                  {prompts.user && (
                    <div className="bg-blue-900/10 border border-blue-800/30 rounded overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-blue-900/20 border-b border-blue-800/30">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-200 font-medium text-sm">User</span>
                          <span className="px-2 py-1 bg-blue-800/40 text-blue-200 rounded text-xs">
                            {prompts.user.length.toLocaleString()} chars
                          </span>
                        </div>
                        <CopyIconButton 
                          text={prompts.user} 
                          copyKey="user-prompt" 
                          className="p-1 text-blue-400 hover:text-blue-200 hover:bg-blue-800/30 rounded transition-colors"
                        />
                      </div>
                      <ScrollArea className="h-32">
                        <div className="p-4">
                          <pre className="text-blue-200 text-sm leading-relaxed whitespace-pre-wrap">
                            {formatAIPrompt(prompts.user)}
                          </pre>
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {/* Text field */}
                  {prompts.text && (
                    <div className="bg-emerald-900/10 border border-emerald-800/30 rounded overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-emerald-900/20 border-b border-emerald-800/30">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-200 font-medium text-sm">Content</span>
                          <span className="px-2 py-1 bg-emerald-800/40 text-emerald-200 rounded text-xs">
                            {prompts.text.length.toLocaleString()} chars
                          </span>
                        </div>
                        <CopyIconButton 
                          text={prompts.text} 
                          copyKey="text-prompt" 
                          className="p-1 text-emerald-400 hover:text-emerald-200 hover:bg-emerald-800/30 rounded transition-colors"
                        />
                      </div>
                      <ScrollArea className="h-32">
                        <div className="p-4">
                          <pre className="text-emerald-200 text-sm leading-relaxed whitespace-pre-wrap">
                            {formatAIPrompt(prompts.text)}
                          </pre>
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {/* Messages array */}
                  {prompts.messages.length > 0 && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-neutral-800/30 border-b border-neutral-700/50">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-200 font-medium text-sm">
                            Messages ({prompts.messages.length})
                          </span>
                        </div>
                        <CopyIconButton 
                          text={JSON.stringify(prompts.messages, null, 2)} 
                          copyKey="messages-array" 
                        />
                      </div>
                      <ScrollArea className="h-48">
                        <div className="p-4 space-y-3">
                          {prompts.messages.map((message: AIMessage, index: number) => {
                            const role = message.role || message.type || "unknown";
                            const content =
                              message.content || message.text || message.message || String(message);

                            return (
                              <div
                                key={index}
                                className={cn("p-3 rounded border", {
                                  "bg-neutral-800/50 border-neutral-700": role === "system",
                                  "bg-blue-900/20 border-blue-800/40": role === "user",
                                  "bg-emerald-900/20 border-emerald-800/40": role === "assistant",
                                  "bg-neutral-800/30 border-neutral-700": !["system", "user", "assistant"].includes(role),
                                })}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {role === "system" && <Settings className="w-3 h-3 text-neutral-400" />}
                                  {role === "user" && <User className="w-3 h-3 text-blue-400" />}
                                  {role === "assistant" && <Bot className="w-3 h-3 text-emerald-400" />}
                                  <span className="text-xs font-medium text-neutral-300 capitalize">
                                    {role}
                                  </span>
                                  <span className="text-xs text-neutral-500">#{index + 1}</span>
                                </div>
                                <pre className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                                  {formatAIPrompt(typeof content === "string" ? content : JSON.stringify(content))}
                                </pre>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>
            )
          );
        })()}

      {/* Parameters section */}
      {hasParameters && (
        <div>
          <div className="flex items-center justify-between my-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-700 rounded flex items-center justify-center">
                <Settings className="w-4 h-4 text-neutral-300" />
              </div>
              <div>
                <h3 className="text-white font-medium">
                  {isAINode() ? "Configuration" : "Parameters"}
                </h3>
                <p className="text-neutral-400 text-sm">
                  {parameterCount} parameter{parameterCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded text-sm transition-colors"
            >
              {showRawData ? "Pretty" : "Raw"}
            </button>
          </div>

          {/* Parameters Content */}
          {(() => {
            let filteredParams = step.parameters;

            if (isAINode()) {
              const promptKeys = [
                "systemMessage",
                "system_message",
                "systemPrompt",
                "system",
                "instructions",
                "prompt",
                "userMessage",
                "user_message",
                "input",
                "query",
                "text",
                "messages",
                "conversation",
                "chat_history",
              ];
              filteredParams = Object.fromEntries(
                Object.entries(step.parameters || {}).filter(([key]) =>
                  !promptKeys.some((promptKey) =>
                    key.toLowerCase().includes(promptKey.toLowerCase())
                  )
                )
              );
            } else if (isCodeNode()) {
              const codeKeys = [
                "jsCode",
                "code",
                "script",
                "pythonCode",
                "javascript",
                "workflowCode",
                "functionCode",
              ];
              filteredParams = Object.fromEntries(
                Object.entries(step.parameters || {}).filter(([key]) =>
                  !codeKeys.some((codeKey) =>
                    key.toLowerCase().includes(codeKey.toLowerCase())
                  )
                )
              );
            }

            const filteredParamCount = Object.keys(filteredParams || {}).length;

            if (filteredParamCount === 0) {
              return (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Info className="h-5 w-5 text-neutral-400" />
                  </div>
                  <p className="text-neutral-400 text-sm">
                    {isAINode()
                      ? "Configuration shown in AI section above"
                      : isCodeNode()
                      ? "Configuration shown in code section above"
                      : "No additional configuration required"}
                  </p>
                </div>
              );
            }

            return showRawData ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-neutral-800/50 border-b border-neutral-700">
                  <span className="text-neutral-300 text-sm font-medium">JSON</span>
                  <CopyButton 
                    text={JSON.stringify(isAINode() ? filteredParams : step.parameters, null, 2)} 
                    copyKey="raw-params" 
                  />
                </div>
                <ScrollArea className="h-48">
                  <pre className="p-4 text-neutral-200 text-sm font-mono leading-6">
                    {JSON.stringify(isAINode() ? filteredParams : step.parameters, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(filteredParams || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="group bg-neutral-900 border border-neutral-800 rounded p-4 hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <code className="px-2 py-1 bg-neutral-800 text-neutral-200 rounded text-sm font-mono">
                          {key}
                        </code>
                        <span className="px-2 py-1 bg-neutral-700 text-neutral-400 rounded text-xs">
                          {typeof value}
                        </span>
                      </div>
                      <CopyIconButton 
                        text={typeof value === "string" ? value : JSON.stringify(value, null, 2)} 
                        copyKey={`param-${key}`} 
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-all"
                      />
                    </div>
                    <div className="bg-neutral-800/50 rounded p-3">
                      {typeof value === "object" && value !== null ? (
                        <ScrollArea className="h-20">
                          <pre className="text-xs text-neutral-400 font-mono leading-5">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        </ScrollArea>
                      ) : (
                        <p className="text-sm text-neutral-300 font-mono break-all">{String(value)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* No parameters section */}
      {!hasParameters && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Ready to use</h4>
          <p className="text-neutral-400 text-sm max-w-sm mx-auto">
            This node is configured and ready to execute.
          </p>
        </div>
      )}
    </div>
  )
}