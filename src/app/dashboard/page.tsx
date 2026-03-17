
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  BrainCircuit, 
  Camera, 
  MessageSquare, 
  History, 
  Send,
  X,
  Loader2,
  BookOpen,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { scanAndSummarizeNotes } from "@/ai/flows/scan-and-summarize-notes";
import { realTimeTutorConversation } from "@/ai/flows/real-time-tutor-conversation";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: 'user' | 'model';
  content: string;
};

type ScannedNote = {
  id: string;
  imageUri: string;
  summary: string;
  timestamp: Date;
};

export default function Dashboard() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! I'm EduGemini, your AI tutor. Scan your notes or ask me anything to get started." }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [scannedNotes, setScannedNotes] = useState<ScannedNote[]>([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [showScanner, setShowScanner] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) handleSendMessage(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
    return () => {
      if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    };
  }, [cameraStream]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (showScanner && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showScanner, cameraStream]);

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    toast({ title: !isVoiceMode ? "Voice Mode Enabled" : "Voice Mode Muted" });
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowScanner(false);
  }, [cameraStream]);

  const startCamera = async () => {
    if (isCameraStarting) return;
    setIsCameraStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      setShowScanner(true);
    } catch (err) {
      toast({ title: "Camera access denied", variant: "destructive" });
    } finally {
      setIsCameraStarting(false);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    const dataUri = canvasRef.current.toDataURL('image/jpeg');
    stopCamera();
    setIsProcessing(true);
    try {
      const result = await scanAndSummarizeNotes({ notesImageUri: dataUri });
      const newNote: ScannedNote = {
        id: Math.random().toString(36).substring(7),
        imageUri: dataUri,
        summary: result.summary,
        timestamp: new Date(),
      };
      setScannedNotes(prev => [newNote, ...prev]);
      setActiveTab("library");
      setMessages(prev => [...prev, { role: 'model', content: "Notes scanned and saved to your Study Vault!" }]);
    } catch (err) {
      toast({ title: "Scan failed", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (text?: string | React.FormEvent) => {
    if (typeof text !== 'string' && (text as any)?.preventDefault) (text as any).preventDefault();
    const userMsg = typeof text === 'string' ? text : input.trim();
    if (!userMsg || isProcessing) return;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessing(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await realTimeTutorConversation({ conversationHistory: history, userMessage: userMsg });
      setMessages(prev => [...prev, { role: 'model', content: response.tutorResponse }]);
      if (isVoiceMode) {
        const { audioUri } = await textToSpeech(response.tutorResponse);
        if (audioRef.current) {
          audioRef.current.src = audioUri;
          audioRef.current.play();
        }
      }
    } catch (err) {
      toast({ title: "Error communicating with tutor", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      <audio ref={audioRef} className="hidden" />
      <aside className="w-64 bg-sidebar border-r hidden md:flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <BrainCircuit className="text-primary w-8 h-8" />
          <span className="font-headline font-bold text-xl text-primary">EduGemini</span>
        </div>
        <nav className="space-y-2 flex-1">
          <Button variant={activeTab === 'chat' ? 'default' : 'ghost'} className="w-full justify-start gap-3 rounded-xl" onClick={() => setActiveTab('chat')}>
            <MessageSquare size={18} /> AI Workspace
          </Button>
          <Button variant={activeTab === 'library' ? 'default' : 'ghost'} className="w-full justify-start gap-3 rounded-xl" onClick={() => setActiveTab('library')}>
            <History size={18} /> Study Vault
          </Button>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm z-10">
          <h2 className="font-headline font-semibold text-lg uppercase tracking-wider text-primary/80">
            {activeTab === 'chat' ? 'AI Workspace' : 'Study Vault'}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className={`rounded-full px-4 gap-2 ${isVoiceMode ? 'bg-primary/10 text-primary' : ''}`} onClick={toggleVoiceMode}>
              {isVoiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />} {isVoiceMode ? 'Live Audio' : 'Muted'}
            </Button>
            <Button size="sm" className="rounded-full px-4 gap-2 bg-primary" onClick={startCamera}>
              <Camera size={16} /> Scan Notes
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' ? (
            <div className="h-full flex flex-col">
              <ScrollArea className="flex-1 p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={msg.role === 'user' ? 'chat-bubble-user max-w-[85%]' : 'chat-bubble-ai max-w-[90%]'}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isProcessing && <div className="text-xs text-primary font-bold">EduGemini is thinking...</div>}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-white">
                <form onSubmit={(e) => handleSendMessage(e)} className="max-w-4xl mx-auto flex gap-3">
                  <div className="relative flex-1">
                    <Input placeholder="Ask a question..." className="rounded-full h-12 px-6 bg-secondary/30" value={input} onChange={(e) => setInput(e.target.value)} disabled={isProcessing} />
                    <Button type="button" variant="ghost" size="icon" className={`absolute right-2 top-1 rounded-full ${isListening ? 'text-primary' : ''}`} onClick={startListening}>
                      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </Button>
                  </div>
                  <Button type="submit" className="rounded-full h-12 w-12 p-0" disabled={!input.trim() || isProcessing}>
                    <Send size={20} />
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full p-6">
              <div className="max-w-6xl mx-auto">
                {scannedNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <BookOpen size={64} className="mb-4" />
                    <p>No notes in your vault yet. Scan something to begin!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scannedNotes.map(note => (
                      <Card key={note.id} className="overflow-hidden">
                        <div className="h-40 bg-muted relative">
                          <img src={note.imageUri} className="w-full h-full object-cover" alt="Note" />
                          <Badge className="absolute top-2 right-2">{note.timestamp.toLocaleDateString()}</Badge>
                        </div>
                        <CardHeader><CardTitle className="text-sm line-clamp-3">{note.summary}</CardTitle></CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
        {showScanner && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
            <Button variant="ghost" className="absolute top-4 right-4 text-white" onClick={stopCamera}><X size={32} /></Button>
            <video ref={videoRef} autoPlay playsInline muted className="max-w-3xl w-full aspect-video bg-black rounded-xl" />
            <Button size="lg" className="mt-8 rounded-full h-20 w-20 border-4 border-white" onClick={captureImage} />
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </main>
    </div>
  );
}
