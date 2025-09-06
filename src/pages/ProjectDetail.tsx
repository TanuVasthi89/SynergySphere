
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, User, Tag as TagIcon, Clock } from "lucide-react";




const mockTasks = [
  {
    id: "t1",
    title: "Design landing page",
    due: "2025-09-16",
    status: "In Progress",
    tags: ["UI/UX"],
    assignee: {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  },
  {
    id: "t2",
    title: "Develop API endpoints",
    due: "2025-09-20",
    status: "To Do",
    tags: ["Backend"],
    assignee: {
      name: "David Wilson",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  },
];

const initialMessages = [
  {
    id: "1",
    author: "Bob Williams",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    message: "Hey team, I've pushed the latest updates for the API. Let me know what you think.",
    time: "2:30 PM",
    replies: [
      {
        id: "1-1",
        author: "Alice Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        message: "Great work, Bob!",
        time: "2:31 PM",
      },
    ],
  },
  {
    id: "2",
    author: "Alice Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    message: "Looks great, Bob! I'll start integrating it into the frontend now.",
    time: "2:32 PM",
    replies: [],
  },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Get project from navigation state or fallback to mock
  const project = location.state?.project || {
    id: "1",
    title: "Website Redesign",
    description: "A complete overhaul of the company website with a modern look and feel.",
  };
  const [tab, setTab] = useState("tasks");
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null as null | string);
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const currentUser = {
    name: "You",
    avatar: "https://randomuser.me/api/portraits/men/99.jpg",
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          id: Math.random().toString(36).slice(2),
          author: currentUser.name,
          avatar: currentUser.avatar,
          message: input,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          replies: [],
        },
      ]);
      setInput("");
    }
  };

  const handleReplySend = (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    const replyMsg = replyInputs[parentId]?.trim();
    if (!replyMsg) return;
    setMessages(prevMsgs => prevMsgs.map(msg =>
      msg.id === parentId
        ? {
            ...msg,
            replies: [
              ...(msg.replies || []),
              {
                id: Math.random().toString(36).slice(2),
                author: currentUser.name,
                avatar: currentUser.avatar,
                message: replyMsg,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          }
        : msg
    ));
    setReplyInputs(inputs => ({ ...inputs, [parentId]: "" }));
    setReplyTo(null);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
        <img src={currentUser.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
      </div>
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex bg-muted rounded-lg overflow-hidden">
          <button
            className={cn(
              "px-8 py-2 text-base font-medium transition-colors",
              tab === "tasks" ? "bg-background text-foreground" : "text-muted-foreground hover:bg-accent",
              "focus:outline-none"
            )}
            onClick={() => setTab("tasks")}
          >
            Tasks
          </button>
          <button
            className={cn(
              "px-8 py-2 text-base font-medium transition-colors border-l border-border",
              tab === "chat" ? "bg-background text-foreground" : "text-muted-foreground hover:bg-accent",
              "focus:outline-none"
            )}
            onClick={() => setTab("chat")}
          >
            Chat
          </button>
          <button
            className={cn(
              "px-8 py-2 text-base font-medium transition-colors border-l border-border",
              tab === "goals" ? "bg-background text-foreground" : "text-muted-foreground hover:bg-accent",
              "focus:outline-none"
            )}
            onClick={() => setTab("goals")}
          >
            Goals & Reminders
          </button>
        </div>
      </div>

      {tab === "tasks" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-1">Tasks</h2>
          <p className="text-muted-foreground mb-4">Manage tasks for the Website Redesign project.</p>
          <Button variant="secondary" className="mb-6 flex items-center gap-2"><span className="text-lg">+</span> Add Task</Button>
          <div className="space-y-4">
            {mockTasks.map(task => (
              <div key={task.id} className="bg-background rounded-xl border border-border p-5 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-base font-medium text-foreground mb-1">{task.title}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {task.due}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-yellow-500" />
                      <span className={cn("font-medium", task.status === "In Progress" ? "text-yellow-600" : "text-gray-500")}>{task.status}</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {task.tags.map(tag => (
                      <span key={tag} className="inline-block bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground border border-border">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img src={task.assignee.avatar} alt={task.assignee.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "chat" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-1">Team Chat</h2>
          <p className="text-muted-foreground mb-4">Real-time communication with your project team.</p>
          <div className="space-y-4 mb-4">
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex flex-col gap-2", msg.author === currentUser.name ? "items-end" : "items-start")}> 
                <div className={cn("flex items-end gap-3", msg.author === currentUser.name ? "justify-end" : "justify-start")}> 
                  {msg.author !== currentUser.name && <img src={msg.avatar} alt="avatar" className="w-8 h-8 rounded-full" />}
                  <div>
                    <div className={cn("text-sm font-semibold", msg.author === currentUser.name ? "text-right" : "")}>{msg.author} <span className="text-xs text-muted-foreground">{msg.time}</span></div>
                    <div className={cn("rounded-lg px-4 py-2 mt-1", msg.author === currentUser.name ? "bg-primary text-white text-right" : "bg-muted text-foreground")}>{msg.message}</div>
                  </div>
                  {msg.author === currentUser.name && <img src={msg.avatar} alt="avatar" className="w-8 h-8 rounded-full" />}
                </div>
                <div className="flex gap-2 ml-12">
                  <Button size="sm" variant="ghost" onClick={() => setReplyTo(msg.id)}>
                    Reply
                  </Button>
                </div>
                {/* Replies */}
                {msg.replies && msg.replies.length > 0 && (
                  <div className="ml-12 space-y-2">
                    {msg.replies.map(reply => (
                      <div key={reply.id} className={cn("flex items-end gap-2", reply.author === currentUser.name ? "justify-end" : "justify-start")}> 
                        {reply.author !== currentUser.name && <img src={reply.avatar} alt="avatar" className="w-7 h-7 rounded-full" />}
                        <div>
                          <div className={cn("text-xs font-semibold", reply.author === currentUser.name ? "text-right" : "")}>{reply.author} <span className="text-xs text-muted-foreground">{reply.time}</span></div>
                          <div className={cn("rounded-lg px-3 py-1 mt-1 text-sm", reply.author === currentUser.name ? "bg-primary text-white text-right" : "bg-muted text-foreground")}>{reply.message}</div>
                        </div>
                        {reply.author === currentUser.name && <img src={reply.avatar} alt="avatar" className="w-7 h-7 rounded-full" />}
                      </div>
                    ))}
                  </div>
                )}
                {/* Reply input */}
                {replyTo === msg.id && (
                  <form onSubmit={e => handleReplySend(msg.id, e)} className="flex gap-2 ml-12 mt-2">
                    <input
                      className="flex-1 border rounded px-2 py-1 text-sm"
                      value={replyInputs[msg.id] || ""}
                      onChange={e => setReplyInputs(inputs => ({ ...inputs, [msg.id]: e.target.value }))}
                      placeholder="Type a reply..."
                      required
                    />
                    <Button type="submit" size="sm" variant="primary">Send</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setReplyTo(null)}>Cancel</Button>
                  </form>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex gap-2 mt-4">
            <input
              className="flex-1 border rounded px-2 py-1"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              required
            />
            <Button type="submit" variant="primary">Send</Button>
          </form>
        </Card>
      )}

      {tab === "goals" && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Project Goals */}
          <Card className="flex-1 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎯</span>
              <span className="font-semibold text-foreground text-lg">Project Goals</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Track progress towards project milestones.</p>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm">Complete UI/UX Design</span>
              <span className="text-xs font-semibold">100%</span>
            </div>
            <div className="w-full bg-accent rounded-full h-2 mb-3">
              <div className="bg-foreground h-2 rounded-full" style={{ width: '100%' }} />
            </div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm">Frontend Development</span>
              <span className="text-xs font-semibold">40%</span>
            </div>
            <div className="w-full bg-accent rounded-full h-2 mb-3">
              <div className="bg-foreground/70 h-2 rounded-full" style={{ width: '40%' }} />
            </div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm">Backend Development</span>
              <span className="text-xs font-semibold">65%</span>
            </div>
            <div className="w-full bg-accent rounded-full h-2">
              <div className="bg-foreground/50 h-2 rounded-full" style={{ width: '65%' }} />
            </div>
          </Card>
          {/* Reminders */}
          <Card className="flex-1 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🕒</span>
              <span className="font-semibold text-foreground text-lg">Reminders</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Important dates and deadlines for the project.</p>
            <div className="mb-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-lg text-primary">JUL</span>
                <span className="font-bold text-2xl">25</span>
                <div>
                  <span className="font-semibold text-foreground">Client Demo</span>
                  <div className="text-muted-foreground text-xs">Present the current progress to the stakeholders.</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-primary">AUG</span>
                <span className="font-bold text-2xl">10</span>
                <div>
                  <span className="font-semibold text-foreground">Beta Launch</span>
                  <div className="text-muted-foreground text-xs">Internal release for testing and feedback.</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
