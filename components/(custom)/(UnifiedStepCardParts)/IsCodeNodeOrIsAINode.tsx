const IsCodeNodeOrIsAINode = ({isCodeNode}) => {
  return (
    <div>

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
                                {codeContent.language === "python"
                                  ? "Python"
                                  : "JavaScript"}
                              </h3>
                              <p className="text-neutral-400 text-sm">
                                Code execution
                              </p>
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
                                  {codeContent.paramKey}.
                                  {codeContent.language === "python"
                                    ? "py"
                                    : "js"}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    codeContent.code
                                  )
                                }
                                className="px-3 py-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded text-sm transition-colors"
                              >
                                Copy
                              </button>
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
                              <h3 className="text-white font-medium">
                                AI Configuration
                              </h3>
                              <p className="text-neutral-400 text-sm">
                                Model prompts and instructions
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* System prompt */}
                            {prompts.system && (
                              <div className="bg-neutral-900 border border-neutral-800 rounded overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 bg-neutral-800/30 border-b border-neutral-700/50">
                                  <div className="flex items-center gap-3">
                                    <Settings className="w-4 h-4 text-neutral-400" />
                                    <span className="text-neutral-200 font-medium text-sm">
                                      System
                                    </span>
                                    <span className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded text-xs">
                                      {prompts.system.length.toLocaleString()}{" "}
                                      chars
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        prompts.system
                                      )
                                    }
                                    className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
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
                                    <span className="text-blue-200 font-medium text-sm">
                                      User
                                    </span>
                                    <span className="px-2 py-1 bg-blue-800/40 text-blue-200 rounded text-xs">
                                      {prompts.user.length.toLocaleString()}{" "}
                                      chars
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        prompts.user
                                      )
                                    }
                                    className="p-1 text-blue-400 hover:text-blue-200 hover:bg-blue-800/30 rounded transition-colors"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
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
                                    <span className="text-emerald-200 font-medium text-sm">
                                      Content
                                    </span>
                                    <span className="px-2 py-1 bg-emerald-800/40 text-emerald-200 rounded text-xs">
                                      {prompts.text.length.toLocaleString()}{" "}
                                      chars
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        prompts.text
                                      )
                                    }
                                    className="p-1 text-emerald-400 hover:text-emerald-200 hover:bg-emerald-800/30 rounded transition-colors"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
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
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        JSON.stringify(
                                          prompts.messages,
                                          null,
                                          2
                                        )
                                      )
                                    }
                                    className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                                <ScrollArea className="h-48">
                                  <div className="p-4 space-y-3">
                                    {prompts.messages.map(
                                      (message: AIMessage, index: number) => {
                                        const role =
                                          message.role ||
                                          message.type ||
                                          "unknown";
                                        const content =
                                          message.content ||
                                          message.text ||
                                          message.message ||
                                          String(message);

                                        return (
                                          <div
                                            key={index}
                                            className={cn(
                                              "p-3 rounded border",
                                              {
                                                "bg-neutral-800/50 border-neutral-700":
                                                  role === "system",
                                                "bg-blue-900/20 border-blue-800/40":
                                                  role === "user",
                                                "bg-emerald-900/20 border-emerald-800/40":
                                                  role === "assistant",
                                                "bg-neutral-800/30 border-neutral-700":
                                                  ![
                                                    "system",
                                                    "user",
                                                    "assistant",
                                                  ].includes(role),
                                              }
                                            )}
                                          >
                                            <div className="flex items-center gap-2 mb-2">
                                              {role === "system" && (
                                                <Settings className="w-3 h-3 text-neutral-400" />
                                              )}
                                              {role === "user" && (
                                                <User className="w-3 h-3 text-blue-400" />
                                              )}
                                              {role === "assistant" && (
                                                <Bot className="w-3 h-3 text-emerald-400" />
                                              )}
                                              <span className="text-xs font-medium text-neutral-300 capitalize">
                                                {role}
                                              </span>
                                              <span className="text-xs text-neutral-500">
                                                #{index + 1}
                                              </span>
                                            </div>
                                            <pre className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                                              {formatAIPrompt(
                                                typeof content === "string"
                                                  ? content
                                                  : JSON.stringify(content)
                                              )}
                                            </pre>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </ScrollArea>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    );
                  })()}
    </div>
  )
}
export default IsCodeNodeOrIsAINode