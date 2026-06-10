import { useMemo, useState } from 'react';
import {
  BriefcaseMedical,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Home,
  Image,
  Inbox,
  MessageCircle,
  Mic,
  Send,
  Stethoscope,
  Tag,
  X,
} from 'lucide-react';
import { serviceCategories } from '../data/vetService';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

type VetTab = 'home' | 'offer' | 'inbox' | 'schedule';
type ChatStatus = 'active' | 'resolved';

type VetChatMessage = {
  id: number;
  from: 'farmer' | 'vet';
  type: 'text' | 'voice' | 'image';
  text: string;
  time: string;
};

type VetIssueChat = {
  id: number;
  farmer: string;
  animal: string;
  issue: string;
  district: string;
  lastSeen: string;
  status: ChatStatus;
  unread: number;
  messages: VetChatMessage[];
};

const initialChats: VetIssueChat[] = [
  {
    id: 1,
    farmer: 'Rahim Uddin',
    animal: 'Cow A12',
    issue: 'Fever, low appetite and less milk',
    district: 'Savar, Dhaka',
    lastSeen: '10:42 AM',
    status: 'active',
    unread: 2,
    messages: [
      { id: 1, from: 'farmer', type: 'text', text: 'Assalamu alaikum doctor. Cow A12 has fever from last night.', time: '10:18 AM' },
      { id: 2, from: 'vet', type: 'text', text: 'Please check temperature and share a photo of the eyes and nose.', time: '10:24 AM' },
      { id: 3, from: 'farmer', type: 'image', text: 'Attached photo: nose discharge and dull eye.', time: '10:39 AM' },
      { id: 4, from: 'farmer', type: 'text', text: 'Temperature is 103.8 F and she is eating very little.', time: '10:42 AM' },
    ],
  },
  {
    id: 2,
    farmer: 'Sadia Akter',
    animal: 'Goat G08',
    issue: 'Skin rash follow-up',
    district: 'Patiya, Chattogram',
    lastSeen: '9:55 AM',
    status: 'active',
    unread: 1,
    messages: [
      { id: 1, from: 'farmer', type: 'text', text: 'The rash is spreading behind the ears.', time: '9:41 AM' },
      { id: 2, from: 'vet', type: 'voice', text: 'Voice note: apply the medicine twice daily and keep the goat dry.', time: '9:50 AM' },
      { id: 3, from: 'farmer', type: 'text', text: 'Should I isolate her from the other goats?', time: '9:55 AM' },
    ],
  },
  {
    id: 3,
    farmer: 'Karim Mia',
    animal: 'Layer poultry batch P04',
    issue: 'Sudden drop in feed intake',
    district: 'Cumilla Sadar, Cumilla',
    lastSeen: 'Yesterday',
    status: 'active',
    unread: 0,
    messages: [
      { id: 1, from: 'farmer', type: 'text', text: 'Feed intake dropped since yesterday afternoon.', time: 'Yesterday' },
      { id: 2, from: 'vet', type: 'text', text: 'Send droppings photo and current vaccination record.', time: 'Yesterday' },
    ],
  },
  {
    id: 4,
    farmer: 'Momena Begum',
    animal: 'Calf C03',
    issue: 'Diarrhoea after feed change',
    district: 'Bhaluka, Mymensingh',
    lastSeen: 'Mon',
    status: 'resolved',
    unread: 0,
    messages: [
      { id: 1, from: 'farmer', type: 'text', text: 'The calf has loose stool after changing feed.', time: 'Mon' },
      { id: 2, from: 'vet', type: 'text', text: 'Oral saline, clean water, and return to previous feed for 48 hours.', time: 'Mon' },
      { id: 3, from: 'farmer', type: 'text', text: 'The calf is now stable. Thank you.', time: 'Tue' },
    ],
  },
];

const tabItems: Array<{ key: VetTab; label: string; icon: typeof Home }> = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'offer', label: 'Offer', icon: Tag },
  { key: 'inbox', label: 'Inbox', icon: Inbox },
  { key: 'schedule', label: 'Schedule', icon: CalendarDays },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function VetDashboard() {
  const [activeTab, setActiveTab] = useState<VetTab>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chatDraft, setChatDraft] = useState('');
  const [chats, setChats] = useState<VetIssueChat[]>(initialChats);

  const activeChats = useMemo(() => chats.filter((chat) => chat.status === 'active'), [chats]);
  const resolvedChats = useMemo(() => chats.filter((chat) => chat.status === 'resolved'), [chats]);
  const selectedChat = chats.find((chat) => chat.id === selectedChatId && chat.status === 'active');

  function openTab(tab: VetTab) {
    setActiveTab(tab);
    setSelectedChatId(null);
    setIsProfileOpen(false);
    setShowHistory(false);
  }

  function openChat(chatId: number) {
    setSelectedChatId(chatId);
    setChats((current) => current.map((chat) => (chat.id === chatId ? { ...chat, unread: 0 } : chat)));
  }

  function sendMessage(type: VetChatMessage['type'] = 'text') {
    const text = chatDraft.trim();
    if (!selectedChatId || (type === 'text' && !text)) {
      return;
    }

    const nextMessage: VetChatMessage = {
      id: Date.now(),
      from: 'vet',
      type,
      text: type === 'voice' ? 'Voice message sent' : type === 'image' ? 'Photo/media sent' : text,
      time: 'Now',
    };

    setChats((current) =>
      current.map((chat) =>
        chat.id === selectedChatId ? { ...chat, lastSeen: 'Now', messages: [...chat.messages, nextMessage] } : chat,
      ),
    );
    setChatDraft('');
  }

  function resolveSelectedIssue() {
    if (!selectedChatId) {
      return;
    }

    setChats((current) =>
      current.map((chat) =>
        chat.id === selectedChatId ? { ...chat, status: 'resolved', unread: 0, lastSeen: 'Resolved now' } : chat,
      ),
    );
    setSelectedChatId(null);
  }

  function renderAvatar(name = 'Dr. Nusrat') {
    return (
      <div className="relative flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#E6F7EF]">
        <div className="absolute top-2.5 h-3.5 w-3.5 rounded-full bg-[#1E9E6F]" />
        <div className="absolute bottom-2 h-4 w-7 rounded-t-full bg-[#1E9E6F] opacity-80" />
        <span className="sr-only">{name}</span>
      </div>
    );
  }

  function renderAppHeader(title: string, subtitle: string) {
    return (
      <div className="flex items-start justify-between gap-4 px-6 pt-2">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#1E9E6F]">Vet mode</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#17212B]">{title}</h1>
          <p className="mt-1 text-xs font-semibold text-[#6B7785]">{subtitle}</p>
        </div>
        <button type="button" onClick={() => setIsProfileOpen(true)} className="rounded-full">
          {renderAvatar()}
        </button>
      </div>
    );
  }

  function renderChatRow(chat: VetIssueChat, history = false) {
    return (
      <button
        key={chat.id}
        type="button"
        onClick={() => !history && openChat(chat.id)}
        className={`w-full overflow-hidden rounded-[20px] border border-[#DCE7DF] bg-white text-left ${
          history ? 'p-3' : 'p-4'
        }`}
      >
        <div className={`flex items-start ${history ? 'gap-2.5' : 'gap-3'}`}>
          <div
            className={`flex flex-none items-center justify-center rounded-full bg-[#EAF3FB] font-extrabold text-[#0F4C81] ${
              history ? 'h-10 w-10 text-xs' : 'h-12 w-12 text-sm'
            }`}
          >
            {getInitials(chat.farmer)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-[#17212B]">{chat.farmer}</p>
                <p className="mt-0.5 text-[11px] font-bold text-[#6B7785]">{chat.animal}</p>
              </div>
              <span className="max-w-[64px] flex-none text-right text-[10px] font-bold leading-4 text-[#6B7785]">
                {chat.lastSeen}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 break-words text-xs font-semibold leading-5 text-[#435160]">{chat.issue}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="min-w-0 truncate rounded-full bg-[#F8FCFA] px-3 py-1 text-[10px] font-bold text-[#6B7785]">
                {chat.district}
              </span>
              {history ? (
                <span className="flex-none rounded-full bg-[#E6F7EF] px-3 py-1 text-[10px] font-bold text-[#1E9E6F]">
                  Resolved
                </span>
              ) : chat.unread ? (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#1E9E6F] px-2 text-[10px] font-extrabold text-white">
                  {chat.unread}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </button>
    );
  }

  function renderHome() {
    return (
      <>
        {renderAppHeader('Good morning, Dr. Nusrat', `${activeChats.length} active issue chats today`)}

        <div className="px-6 pt-6">
          <div className="rounded-[24px] bg-[#1E9E6F] p-5 text-white">
            <p className="text-sm font-bold opacity-90">Next priority</p>
            <h2 className="mt-2 text-lg font-extrabold">{activeChats[0]?.issue ?? 'No active issue right now'}</h2>
            <p className="mt-2 text-xs font-semibold opacity-85">{activeChats[0]?.district ?? 'Resolved chats are saved in history'}</p>
            <button
              type="button"
              onClick={() => openTab('inbox')}
              className="mt-4 rounded-2xl bg-white px-5 py-2 text-sm font-bold text-[#1E9E6F]"
            >
              Open inbox
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[20px] border border-[#DCE7DF] bg-white p-4">
              <MessageCircle className="h-5 w-5 text-[#1E9E6F]" />
              <p className="mt-3 text-[28px] font-black text-[#17212B]">{activeChats.length}</p>
              <p className="text-xs font-bold text-[#6B7785]">Open issues</p>
            </div>
            <div className="rounded-[20px] border border-[#DCE7DF] bg-white p-4">
              <CheckCircle2 className="h-5 w-5 text-[#1E9E6F]" />
              <p className="mt-3 text-[28px] font-black text-[#17212B]">{resolvedChats.length}</p>
              <p className="text-xs font-bold text-[#6B7785]">Chat history</p>
            </div>
          </div>

          <h2 className="mt-6 text-lg font-extrabold text-[#17212B]">Today</h2>
          <div className="mt-3 space-y-3">
            {activeChats.slice(0, 2).map((chat) => renderChatRow(chat))}
          </div>
        </div>
      </>
    );
  }

  function renderOffer() {
    return (
      <>
        {renderAppHeader('Service offers', 'Manage the services farmers can request')}
        <div className="px-6 pt-6">
          <div className="rounded-[22px] border border-[#DCE7DF] bg-white p-4">
            <h2 className="text-base font-extrabold text-[#17212B]">Available today</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {serviceCategories.map((service) => (
                <span key={service} className="rounded-full bg-[#F8FCFA] px-3 py-2 text-xs font-bold text-[#17212B]">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {['Farm visit within Dhaka division', 'Video consultation for urgent symptoms', 'Vaccination and herd health plan'].map((offer) => (
              <div key={offer} className="rounded-[20px] border border-[#DCE7DF] bg-white p-4">
                <div className="flex items-center gap-3">
                  <BriefcaseMedical className="h-5 w-5 text-[#1E9E6F]" />
                  <p className="text-sm font-extrabold text-[#17212B]">{offer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  function renderInbox() {
    return (
      <>
        {renderAppHeader('Inbox', 'Issue-specific farmer chats')}
        <div className="px-6 pt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-[#17212B]">Active inbox</h2>
            <span className="rounded-full bg-[#E6F7EF] px-3 py-1 text-[10px] font-extrabold text-[#1E9E6F]">
              {activeChats.length} open
            </span>
          </div>
          <div className="space-y-3">
            {activeChats.length ? (
              activeChats.map((chat) => renderChatRow(chat))
            ) : (
              <div className="rounded-[22px] border border-[#DCE7DF] bg-white p-5 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-[#1E9E6F]" />
                <p className="mt-3 text-sm font-extrabold text-[#17212B]">Inbox is clear</p>
                <p className="mt-1 text-xs font-semibold text-[#6B7785]">Resolved issue chats are available from Home profile history.</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  function renderScheduleList() {
    return (
      <>
        {renderAppHeader('Schedule', 'Consultations and farm visits')}
        <div className="px-6 pt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-[#17212B]">Today</h2>
            <span className="rounded-full bg-[#E6F7EF] px-3 py-1 text-[10px] font-extrabold text-[#1E9E6F]">
              3 planned
            </span>
          </div>
          <div className="space-y-3">
            {[
              ['10:30 AM', 'Video follow-up', 'Sadia Akter - Goat G08 skin rash'],
              ['1:00 PM', 'Farm visit', 'Rahim Uddin - Cow A12 temperature check'],
              ['4:30 PM', 'Prescription review', 'Karim Mia - Poultry feed intake'],
            ].map(([time, title, body]) => (
              <div key={time} className="rounded-[20px] border border-[#DCE7DF] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-[#17212B]">{title}</p>
                    <p className="mt-1 break-words text-xs font-semibold leading-5 text-[#6B7785]">{body}</p>
                  </div>
                  <span className="flex-none rounded-full bg-[#F8FCFA] px-3 py-1 text-[10px] font-bold text-[#435160]">
                    {time}
                  </span>
                </div>
              </div>
            ))}
            <div className="rounded-[20px] border border-[#DCE7DF] bg-[#E6F7EF] p-4">
              <p className="text-sm font-extrabold text-[#17212B]">Need to reply to a farmer?</p>
              <button
                type="button"
                onClick={() => openTab('inbox')}
                className="mt-3 rounded-2xl bg-[#1E9E6F] px-4 py-2 text-xs font-extrabold text-white"
              >
                Open inbox chats
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderChatThread() {
    if (!selectedChat) {
      return renderScheduleList();
    }

    return (
      <div className="flex min-h-[778px] flex-col">
        <div className="border-b border-[#DCE7DF] bg-[#F8FCFA] px-5 pb-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedChatId(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-black text-[#17212B]"
            >
              ‹
            </button>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3FB] text-sm font-extrabold text-[#0F4C81]">
              {getInitials(selectedChat.farmer)}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-extrabold text-[#17212B]">{selectedChat.farmer}</h1>
              <p className="truncate text-[11px] font-bold text-[#6B7785]">{selectedChat.animal} • {selectedChat.issue}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={resolveSelectedIssue}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E9E6F] text-xs font-extrabold text-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            Issue resolved
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
          {selectedChat.messages.map((message) => {
            const isVet = message.from === 'vet';
            return (
              <div key={message.id} className={`flex ${isVet ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] rounded-[20px] px-4 py-3 text-sm font-semibold leading-5 ${
                    isVet ? 'bg-[#1E9E6F] text-white' : 'bg-white text-[#17212B]'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2 text-[10px] font-extrabold opacity-75">
                    {message.type === 'voice' && <Mic className="h-3.5 w-3.5" />}
                    {message.type === 'image' && <Image className="h-3.5 w-3.5" />}
                    <span>{message.time}</span>
                  </div>
                  {message.text}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-[#DCE7DF] bg-white px-4 py-3">
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => sendMessage('voice')}
              className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#F8FCFA] text-[#1E9E6F]"
              aria-label="Send voice message"
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => sendMessage('image')}
              className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#F8FCFA] text-[#1E9E6F]"
              aria-label="Send photo or media"
            >
              <Image className="h-5 w-5" />
            </button>
            <textarea
              value={chatDraft}
              onChange={(event) => setChatDraft(event.target.value)}
              rows={1}
              placeholder="Message about this issue"
              className="min-h-11 flex-1 resize-none rounded-[20px] border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none placeholder:text-[#8C99A6]"
            />
            <button
              type="button"
              onClick={() => sendMessage('text')}
              className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#1E9E6F] text-white"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderActiveTab() {
    if (activeTab === 'home') return renderHome();
    if (activeTab === 'offer') return renderOffer();
    if (activeTab === 'inbox') return selectedChat ? renderChatThread() : renderInbox();
    return renderScheduleList();
  }

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="min-h-[778px] pb-4">{renderActiveTab()}</div>

      {isProfileOpen ? (
        <div className="absolute inset-0 z-40 bg-[#17212B]/20">
          <button className="absolute inset-0 h-full w-full cursor-default" onClick={() => setIsProfileOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-[74%] min-w-[280px] max-w-[310px] overflow-y-auto border-l border-[#DCE7DF] bg-white p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                {renderAvatar()}
                <h2 className="mt-3 text-lg font-extrabold text-[#17212B]">Dr. Nusrat Profile</h2>
                <p className="mt-1 text-xs font-medium text-[#6B7785]">BVC registered veterinarian</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8FCFA] text-[#17212B]"
                aria-label="Close profile menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowHistory((current) => !current)}
              className="mt-5 w-full rounded-[20px] border border-[#DCE7DF] bg-[#F8FCFA] p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-[#1E9E6F]" />
                <div>
                  <p className="text-sm font-extrabold text-[#17212B]">Chat history</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#6B7785]">{resolvedChats.length} resolved issue chats</p>
                </div>
              </div>
            </button>

            {showHistory ? (
              <div className="mt-4 space-y-3">
                {resolvedChats.length ? (
                  resolvedChats.map((chat) => renderChatRow(chat, true))
                ) : (
                  <p className="rounded-[18px] bg-[#F8FCFA] p-4 text-xs font-semibold text-[#6B7785]">
                    No resolved chats yet.
                  </p>
                )}
              </div>
            ) : null}

            <div className="mt-5 rounded-[20px] bg-[#E6F7EF] p-4">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-5 w-5 text-[#1E9E6F]" />
                <p className="text-sm font-extrabold text-[#17212B]">Online for consultations</p>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="sticky bottom-0 border-t border-[#DCE7DF] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button key={tab.key} type="button" onClick={() => openTab(tab.key)} className="flex w-16 flex-col items-center">
                <span
                  className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 ${
                    isActive ? 'bg-[#E6F7EF] text-[#1E9E6F]' : 'text-[#6B7785]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className={`mt-1 text-[10px] font-bold ${isActive ? 'text-[#1E9E6F]' : 'text-[#6B7785]'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
