"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  User,
  Send,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Compass,
  Calendar,
  Users,
  BellRing,
  LifeBuoy,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "cn";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  relatedLinks?: Array<{ title: string; href: string }>;
  suggestions?: string[];
  timestamp: string;
}

const INITIAL_SUGGESTIONS = [
  "Where is the AI & Robotics Lab located?",
  "What classes do I have scheduled for Monday?",
  "Who is the Head of the Computer Science Department?",
  "What are the Central Digital Library timings?",
  "When is the Hackathon 2026 registration deadline?",
  "How do I submit a ticket for hostel Wi-Fi issues?",
];

const TOPIC_SHORTCUTS = [
  {
    title: "Campus Locations & Navigation",
    icon: Compass,
    query: "Show me all major academic blocks and campus facilities",
  },
  {
    title: "Timetable & Classes",
    icon: Calendar,
    query: "What is the schedule for Monday classes?",
  },
  {
    title: "Faculty & Office Hours",
    icon: Users,
    query: "Show the engineering faculty directory and office hours",
  },
  {
    title: "Notices & Circulars",
    icon: BellRing,
    query: "Show me the latest exam and academic notices",
  },
  {
    title: "Help Desk Support",
    icon: LifeBuoy,
    query: "How does the student help desk ticket system work?",
  },
];

export function AiChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: `👋 **Welcome to CampusLens AI!**\n\nI am your intelligent 24/7 campus concierge. You can ask me anything about your class timetable, finding rooms in Turing Block or the Central Library, professor consultation hours, mid-term circulars, or raising IT help requests.\n\n*Choose a prompt below or type your question!*`,
      suggestions: INITIAL_SUGGESTIONS.slice(0, 4),
      relatedLinks: [
        { title: "Explore Campus Map", href: "/map" },
        { title: "Check Timetable", href: "/timetable" },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    setInput("");
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to receive response");
      }

      const data = await res.json();
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Sorry, I couldn't process your request.",
        relatedLinks: data.relatedLinks || [],
        suggestions: data.suggestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: `bot-err-${Date.now()}`,
        role: "assistant",
        content: "⚠️ I encountered a temporary connection issue. Please try again or select one of the suggested campus topics.",
        suggestions: INITIAL_SUGGESTIONS.slice(0, 3),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: `Conversation restarted! How can I assist with your campus queries today?`,
        suggestions: INITIAL_SUGGESTIONS.slice(0, 4),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Header line with emoji or bold
          if (line.startsWith("• ")) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(line.substring(2)) }} />
              </div>
            );
          }

          if (line.match(/^\d+\.\s/)) {
            return (
              <div key={idx} className="pl-2" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
            );
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline font-medium hover:text-primary/80">$1</a>');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
      {/* Left Sidebar Panel - Quick Knowledge Categories */}
      <div className="hidden lg:flex lg:col-span-1 flex-col justify-between p-4 rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">CampusLens AI</h3>
                <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  RAG Knowledge Online
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetChat}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2">
              Quick Knowledge Topics
            </span>
            {TOPIC_SHORTCUTS.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <button
                  key={i}
                  onClick={() => sendMessage(topic.query)}
                  className="w-full text-left p-2.5 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-all flex items-center gap-3 group text-xs"
                >
                  <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors flex-1 truncate">
                    {topic.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Info Box */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-indigo-500/5 border border-primary/10 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-primary text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Grounded AI</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Answers are grounded in Apex Institute database records: timetable, notices, faculty, and locations.
          </p>
        </div>
      </div>

      {/* Main Chat Canvas */}
      <div className="lg:col-span-3 flex flex-col rounded-2xl border bg-card/90 backdrop-blur-sm shadow-sm overflow-hidden h-full">
        {/* Chat Header Bar */}
        <div className="px-5 py-3.5 border-b bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-primary flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground">CampusLens Virtual Assistant</h2>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-primary/5 text-primary border-primary/20">
                  Campus Guide v2.4
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Ask questions regarding academics, faculty rooms, events, or student services
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetChat}
            className="rounded-xl text-xs h-8 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Chat
          </Button>
        </div>

        {/* Messages Feed Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => {
            const isBot = msg.role === "assistant";

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 max-w-3xl",
                  isBot ? "items-start" : "items-start ml-auto flex-row-reverse"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm",
                    isBot
                      ? "bg-gradient-to-br from-indigo-600 to-primary text-white"
                      : "bg-slate-800 text-white"
                  )}
                >
                  {isBot ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Content Bubble */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div
                    className={cn(
                      "p-4 rounded-2xl shadow-sm text-foreground",
                      isBot
                        ? "bg-muted/40 border border-border/80 rounded-tl-sm"
                        : "bg-primary text-primary-foreground rounded-tr-sm ml-auto"
                    )}
                  >
                    {isBot ? (
                      renderFormattedContent(msg.content)
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    )}
                  </div>

                  {/* Related Action Link Chips */}
                  {isBot && msg.relatedLinks && msg.relatedLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 pl-1">
                      {msg.relatedLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.href}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-primary/50 text-xs font-semibold text-foreground hover:text-primary transition-all shadow-xs group"
                        >
                          <span>{link.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Suggested Follow-ups */}
                  {isBot && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="space-y-1.5 pt-1 pl-1">
                      <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        Suggested questions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendMessage(sug)}
                            className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-[11px] text-muted-foreground hover:text-foreground border border-border/60 transition-colors text-left"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-primary text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 rounded-tl-sm space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                </div>
                <span className="text-xs text-muted-foreground block">
                  CampusLens AI is querying institutional databases...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Box Footer */}
        <div className="p-4 border-t bg-card/60 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="relative flex items-center"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything: Where is Turing block, what classes do I have, who is HOD... (Press Enter to send)"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 pr-24 resize-none leading-relaxed"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="sm"
              className="absolute right-2.5 rounded-xl h-8 px-3 gap-1.5 shadow-sm text-xs font-semibold"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>

          <p className="text-[11px] text-center text-muted-foreground/80 mt-2">
            CampusLens AI answers are grounded in Apex Institute schemas. For urgent grade queries, contact the academic dean.
          </p>
        </div>
      </div>
    </div>
  );
}
