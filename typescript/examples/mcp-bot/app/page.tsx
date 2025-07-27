'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect } from 'react';

const CATEGORY_BUTTONS = [
  { label: '카카오페이로 결제하기', text: '5000원짜리 커피 결제 링크 생성해 줘' },
  { label: '카카오페이로 결제 상태 확인하기', text: '모든 결제 상태 확인해 줘' },
  { label: '카카오페이로 취소하기', text: '결제 취소해 줘' },
];

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function formatMessage(content: string) {
    const urlPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    return content.replace(urlPattern, (match, text, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">${text}</a>`;
    });
  }

  function handleCategoryClick(text: string) {
    handleInputChange({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>);
  }

  return (
    <div className="bg-[#181818] min-h-screen flex flex-col font-sans text-white">
      {/* 상단바 */}
      <div className="sticky top-0 z-20 flex flex-col items-center bg-[#181818] border-b border-[#222]">
        <div className="h-14 flex items-center justify-center w-full">
          <span className="text-lg font-bold">KakaoPay MCP Bot</span>
        </div>
      </div>

      {/* 카테고리 버튼 */}
      <div className="flex flex-col gap-3 px-5 mt-5 items-start">
        {CATEGORY_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            className="bg-[#232526] text-[#e0e0e0] text-base px-5 py-2 rounded-full font-medium border border-[#444] shadow-none hover:bg-[#232526] transition-all inline-flex justify-start self-start"
            type="button"
            onClick={() => handleCategoryClick(btn.text)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 flex flex-col justify-end max-w-2xl mx-auto w-full px-2 pb-28 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-base whitespace-pre-wrap break-words
                  ${message.role === 'user'
                    ? 'bg-[#FEE500] text-[#232526] rounded-br-2xl rounded-tl-2xl rounded-bl-2xl'
                    : 'bg-[#232526] text-white rounded-bl-2xl rounded-tr-2xl rounded-br-2xl'}
                `}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: message.role === 'assistant'
                      ? formatMessage(message.content)
                      : message.content
                  }}
                />
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* 입력창 */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 w-full bg-[#181818] px-4 py-3 flex items-center gap-2 z-10 border-t border-[#222]"
        style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.08)' }}
      >
        <span className="text-xl mr-2">💬</span>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="메시지를 입력해 주세요."
          className="flex-1 bg-[#232526] text-white rounded-full px-4 py-2 text-base border-none focus:outline-none focus:ring-2 focus:ring-[#FEE500]"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="ml-2 px-5 py-2 rounded-full bg-[#FEE500] text-[#232526] text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow"
        >
          전송
        </button>
      </form>
    </div>
  );
} 