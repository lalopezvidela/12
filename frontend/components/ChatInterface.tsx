import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  isCompleted: boolean;
  inputPlaceholder: string;
  completedPlaceholder: string;
}

interface ChatMessageProps {
  message: Message;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  isLastBotMessageWithOptions: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSendMessage, isLoading, isLastBotMessageWithOptions }) => {
  const isBot = message.sender === 'bot';

  const { mainText, suggestions } = useMemo(() => {
    const buttonRegex = /👉\s*\[([^\]]+)\]/g;
    const text = typeof message.text === 'string' ? message.text : '';
    const suggestions = [...text.matchAll(buttonRegex)].map(match => match[1]);
    const mainText = text.replace(buttonRegex, '').trim();
    return { mainText, suggestions };
  }, [message.text]);

  const handleSuggestionClick = (text: string) => {
    if (!isLoading && isLastBotMessageWithOptions) {
      onSendMessage(text);
    }
  };

  return (
    <div className="my-4">
      <div className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
        <div
          className={`px-5 py-3 rounded-3xl max-w-md md:max-w-lg lg:max-w-xl break-words shadow-md backdrop-blur-sm transition-opacity duration-500 ease-in opacity-100 ${
            isBot
              ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white rounded-bl-none'
              : 'bg-gradient-to-br from-pink-600 via-pink-500 to-pink-400 text-white rounded-br-none'
          }`}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
              em: ({node, ...props}) => <em className="italic" {...props} />,
            }}
          >
            {mainText}
          </ReactMarkdown>

          {isBot && suggestions.length > 0 && (
            <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={!isLastBotMessageWithOptions || isLoading}
                  className="px-4 py-2 text-sm text-white bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 rounded-xl shadow hover:scale-105 transition-all duration-200 ease-out focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-400 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="my-2">
    <div className="flex items-end gap-2 justify-start">
      <div className="px-3 py-2 rounded-xl bg-black text-white rounded-bl-none shadow-sm">
        <div className="flex items-center justify-center space-x-1">
          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  </div>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, isCompleted, inputPlaceholder, completedPlaceholder }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !isCompleted) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const lastBotMessageWithOptionsIndex = useMemo(() => {
    if (isCompleted) return -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'bot' && /👉\s*\[([^\]]+)\]/g.test(messages[i].text)) {
        return i;
      }
    }
    return -1;
  }, [messages, isCompleted]);

  const isFormDisabled = isLoading || isCompleted;

  return (
    <div 
      className="flex flex-col h-full"
      style={{
        minHeight: 0,
        maxHeight: 600,
        borderRadius: 24,
        background: 'linear-gradient(145deg, #0f0f0f 0%, #1a1a1a 100%)',
        boxShadow: '0 0 30px rgba(255, 105, 180, 0.2)'
      }}
      ref={containerRef}
    >
      <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0, scrollBehavior: 'smooth' }}>
        {messages.map((msg, idx) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            isLastBotMessageWithOptions={idx === lastBotMessageWithOptionsIndex}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-pink-700 bg-pink-900 flex-shrink-0">
        <form onSubmit={handleSend} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isCompleted ? completedPlaceholder : inputPlaceholder}
            aria-label="Chat input"
            className="flex-1 w-full px-4 py-3 bg-zinc-900 border border-pink-700 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-pink-300 transition disabled:cursor-not-allowed"
            disabled={isFormDisabled}
          />
          <button
            type="submit"
            aria-label="Send message"
            className="bg-pink-500 text-white rounded-full p-3 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-500 transition-transform transform hover:scale-110 disabled:bg-pink-200 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isFormDisabled || !input.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;