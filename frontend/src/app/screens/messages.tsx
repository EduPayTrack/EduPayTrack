import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../state/auth-context';
import { apiFetch } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Loader2, Send, MessageSquare, ChevronLeft } from 'lucide-react';

export function MessagesPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<any[]>([]);
    const [accountsUsers, setAccountsUsers] = useState<any[]>([]);
    const [activeUser, setActiveUser] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isStudent = user?.role === 'student';

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (activeUser) {
            loadMessages(activeUser.id);
            const interval = setInterval(() => loadMessages(activeUser.id), 5000); // Polling every 5 seconds
            return () => clearInterval(interval);
        }
    }, [activeUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const convs = await apiFetch('/messages/conversations');
            setConversations(convs);

            if (isStudent && convs.length === 0) {
                const accUsers = await apiFetch('/messages/accounts-users');
                setAccountsUsers(accUsers);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (otherUserId: string) => {
        try {
            const msgs = await apiFetch(`/messages/${otherUserId}`);
            setMessages(msgs);
            // mark read
            await apiFetch(`/messages/${otherUserId}/read`, { method: 'PATCH' });
            
            // Update unread count locally if needed
            setConversations(prev => prev.map(c => 
                c.user.id === otherUserId ? { ...c, unreadCount: 0 } : c
            ));
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !activeUser) return;

        try {
            setSending(true);
            const newMsg = await apiFetch('/messages', {
                method: 'POST',
                body: JSON.stringify({ receiverId: activeUser.id, content: content.trim() })
            });
            setMessages([...messages, newMsg]);
            setContent('');
            
            // update conversation list
            const convIdx = conversations.findIndex(c => c.user.id === activeUser.id);
            if (convIdx >= 0) {
                const newConvs = [...conversations];
                newConvs[convIdx].lastMessage = newMsg;
                setConversations(newConvs);
            } else {
                setConversations([{ user: activeUser, lastMessage: newMsg, unreadCount: 0 }, ...conversations]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex h-[calc(100vh-120px)] gap-4 p-0 md:p-6 animate-fade-in max-w-6xl mx-auto">
            {/* Sidebar */}
            <Card className={`flex flex-col border-r md:border rounded-none md:rounded-xl shadow-none md:shadow-sm ${activeUser ? 'hidden md:flex md:w-1/3' : 'w-full md:w-1/3'}`}>
                <CardHeader className="py-4 border-b">
                    <CardTitle className="text-lg">Conversations</CardTitle>
                </CardHeader>
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col p-2 space-y-1">
                        {conversations.map(conv => (
                            <button
                                key={conv.user.id}
                                onClick={() => setActiveUser(conv.user)}
                                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeUser?.id === conv.user.id ? 'bg-primary/10' : 'hover:bg-muted'}`}
                            >
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                    {conv.user.firstName?.[0] || conv.user.email?.[0] || '?'}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-sm truncate">{conv.user.firstName} {conv.user.lastName}</p>
                                        {conv.unreadCount > 0 && (
                                            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">{conv.unreadCount}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage?.content}</p>
                                </div>
                            </button>
                        ))}
                        {conversations.length === 0 && isStudent && accountsUsers.map(accUser => (
                            <button
                                key={accUser.id}
                                onClick={() => setActiveUser(accUser)}
                                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeUser?.id === accUser.id ? 'bg-primary/10' : 'hover:bg-muted'}`}
                            >
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                    {accUser.firstName?.[0] || accUser.email?.[0] || '?'}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-medium text-sm truncate">Accounts Office ({accUser.firstName})</p>
                                    <p className="text-xs text-muted-foreground truncate">Start a conversation</p>
                                </div>
                            </button>
                        ))}
                        {conversations.length === 0 && (!isStudent || accountsUsers.length === 0) && (
                            <div className="text-center p-4 text-muted-foreground text-sm">No conversations yet.</div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Main Chat Area */}
            <Card className={`flex-1 flex flex-col border rounded-none md:rounded-xl shadow-none md:shadow-sm ${activeUser ? 'flex' : 'hidden md:flex'}`}>
                {activeUser ? (
                    <>
                        <CardHeader className="py-3 md:py-4 border-b bg-card px-3 md:px-6">
                            <CardTitle className="text-base md:text-lg flex items-center gap-2 md:gap-3">
                                <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 -ml-1 mr-1" onClick={() => setActiveUser(null)}>
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                                    {activeUser.firstName?.[0] || activeUser.email?.[0] || '?'}
                                </div>
                                <span>{activeUser.firstName} {activeUser.lastName} {isStudent ? '(Accounts)' : ''}</span>
                            </CardTitle>
                        </CardHeader>
                        <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
                            <div className="space-y-4">
                                {messages.map((msg, idx) => {
                                    const isMe = msg.senderId === user?.userId;
                                    return (
                                        <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-xl shadow-sm text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-background border rounded-bl-sm'}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        <div className="p-4 bg-background border-t">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1"
                                    disabled={sending}
                                />
                                <Button type="submit" disabled={!content.trim() || sending}>
                                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
