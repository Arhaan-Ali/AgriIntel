"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------- Types -------------------- */

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/* -------------------- Component -------------------- */

const FarmerChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your farming assistant. Ask me about crops, soil, pests, irrigation, or farming practices.",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* -------------------- Speech Recognition -------------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, []);

  /* -------------------- Auto Scroll -------------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------- Send Message -------------------- */

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const FASTAPI_URL =
        process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

      const history = [...messages, userMessage]
        .filter((m) => m.role !== "assistant" || m !== messages[0])
        .map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }));

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(`${FASTAPI_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          conversation_history: history,
        }),
        signal: controller.signal,
      }).catch((fetchError) => {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          throw new Error("Request timeout: The server took too long to respond. Please try again.");
        }
        throw new Error(
          `Cannot connect to backend at ${FASTAPI_URL}. ` +
          `Make sure the backend server is running.`
        );
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content:
          data.message ||
          "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- Handlers -------------------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }

    setIsListening(!isListening);
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="flex flex-col h-full w-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌾 Farming Assistant
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="whitespace-pre-wrap space-y-1.5">
                    {msg.content.split('\n').map((line, idx) => {
                      const trimmedLine = line.trim();
                      // Format bullet points
                      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                        return (
                          <div key={idx} className="flex items-start gap-2">
                            <span className={cn(
                              "mt-0.5 shrink-0",
                              msg.role === "user" ? "text-primary-foreground" : "text-primary"
                            )}>•</span>
                            <span>{trimmedLine.substring(1).trim()}</span>
                          </div>
                        );
                      }
                      // Format numbered lists
                      if (trimmedLine.match(/^\d+[\.\)]\s/)) {
                        return (
                          <div key={idx} className="ml-1">
                            {trimmedLine}
                          </div>
                        );
                      }
                      // Empty lines
                      if (trimmedLine === '') {
                        return <div key={idx} className="h-1" />;
                      }
                      // Regular text
                      return <div key={idx}>{line}</div>;
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t p-4 flex gap-2"
          >
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about crops, soil, irrigation..."
                disabled={isLoading}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={toggleListening}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerChatbot;