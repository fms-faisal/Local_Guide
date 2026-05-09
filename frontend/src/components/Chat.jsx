import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMessage, getMessages } from '../services/messages';

const Chat = ({ otherUserId, tourId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMsgs = async () => {
      setLoading(true);
      const msgs = await getMessages({ userId: otherUserId, tourId });
      setMessages(msgs);
      setLoading(false);
    };
    fetchMsgs();
    // Optionally: poll for new messages
    // const interval = setInterval(fetchMsgs, 5000);
    // return () => clearInterval(interval);
  }, [otherUserId, tourId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await sendMessage({ receiver: otherUserId, content, tourId });
    setContent('');
    // Refresh messages
    const msgs = await getMessages({ userId: otherUserId, tourId });
    setMessages(msgs);
  };

  return (
    <div className="border rounded p-4 max-w-xl mx-auto">
      <div className="font-bold mb-2">Chat</div>
      <div className="h-64 overflow-y-auto bg-gray-50 p-2 mb-2 rounded">
        {loading ? <div>Loading...</div> : (
          messages.length === 0 ? <div className="text-gray-400">No messages yet.</div> :
          messages.map(msg => (
            <div key={msg._id} className={`mb-2 ${msg.sender === user?.id ? 'text-right' : 'text-left'}`}>
              <span className="inline-block px-2 py-1 rounded bg-blue-100">{msg.content}</span>
              <div className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input value={content} onChange={e => setContent(e.target.value)} className="border rounded p-2 flex-1" placeholder="Type a message..." />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
};

export default Chat;
