import React, { useMemo, useState } from 'react';
import { Search, SendHorizonal, Phone, Video } from 'lucide-react';

const demoChats = [
  {
    id: '1',
    name: 'Frontend Team',
    avatar: '🧩',
    lastMessage: 'Релиз в пятницу, проверьте чат-бот.',
    time: '09:32',
    unread: 3,
    messages: [
      { id: 'm1', fromMe: false, text: 'Всем привет! Как статус по UI?', time: '09:20' },
      { id: 'm2', fromMe: true, text: 'Почти готово, осталось подключить уведомления.', time: '09:24' },
      { id: 'm3', fromMe: false, text: 'Релиз в пятницу, проверьте чат-бот.', time: '09:32' },
    ],
  },
  {
    id: '2',
    name: 'Alex Dev',
    avatar: '👨‍💻',
    lastMessage: 'Скинул тебе фиксы в личку',
    time: 'Вчера',
    unread: 0,
    messages: [
      { id: 'm1', fromMe: false, text: 'Глянь, пожалуйста, PR #82', time: 'Вчера' },
      { id: 'm2', fromMe: true, text: 'Супер, сейчас посмотрю.', time: 'Вчера' },
      { id: 'm3', fromMe: false, text: 'Скинул тебе фиксы в личку', time: 'Вчера' },
    ],
  },
  {
    id: '3',
    name: 'Design',
    avatar: '🎨',
    lastMessage: 'Обновили иконки для мобильной версии.',
    time: 'Вт',
    unread: 1,
    messages: [
      { id: 'm1', fromMe: false, text: 'Обновили иконки для мобильной версии.', time: 'Вт' },
    ],
  },
];

export function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChatId, setActiveChatId] = useState(demoChats[0].id);
  const [chatMessages, setChatMessages] = useState(
    Object.fromEntries(demoChats.map((chat) => [chat.id, chat.messages]))
  );
  const [messageInput, setMessageInput] = useState('');

  const filteredChats = useMemo(
    () =>
      demoChats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const activeChat = demoChats.find((chat) => chat.id === activeChatId) ?? demoChats[0];
  const activeMessages = chatMessages[activeChat.id] || [];

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    setChatMessages((prev) => ({
      ...prev,
      [activeChat.id]: [
        ...(prev[activeChat.id] || []),
        {
          id: `m-${Date.now()}`,
          fromMe: true,
          text: messageInput.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }));

    setMessageInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <div className="h-full border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/80 shadow-2xl grid grid-cols-1 md:grid-cols-[320px_1fr]">
        <aside className="border-r border-zinc-800 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-3">
              Messenger
            </h1>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Поиск диалогов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-3 text-sm text-zinc-200 outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="overflow-y-auto">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full text-left px-4 py-3 border-b border-zinc-900 hover:bg-zinc-900/70 transition-colors ${
                  chat.id === activeChat.id ? 'bg-zinc-900' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 grid place-items-center text-lg">{chat.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-zinc-100 truncate">{chat.name}</p>
                      <span className="text-xs text-zinc-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-zinc-400 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-black text-xs font-bold grid place-items-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex flex-col">
          <header className="h-16 border-b border-zinc-800 px-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-800 grid place-items-center">{activeChat.avatar}</div>
              <div>
                <p className="font-semibold text-zinc-100 leading-tight">{activeChat.name}</p>
                <p className="text-xs text-emerald-400">online</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <button className="p-2 hover:bg-zinc-800 rounded-lg"><Phone className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-zinc-800 rounded-lg"><Video className="w-4 h-4" /></button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_45%)]">
            {activeMessages.map((message: any) => (
              <div key={message.id} className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    message.fromMe
                      ? 'bg-emerald-500 text-black rounded-br-sm'
                      : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-[11px] mt-1 ${message.fromMe ? 'text-black/70' : 'text-zinc-400'}`}>{message.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-2">
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Написать сообщение..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-2"
              >
                <SendHorizonal className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
