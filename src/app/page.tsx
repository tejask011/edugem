
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, MessageSquare, BrainCircuit, Sparkles, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed top-0 w-full z-50 glass-morphism border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-primary">EduGemini</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Go to App</Link>
          </nav>
          <Button asChild className="rounded-full px-6">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow pt-24">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4 animate-bounce">
              <Sparkles size={14} />
              <span>Next-Gen AI Learning</span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Study Smarter with <span className="text-primary">EduGemini</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Scan your notes, summarize concepts instantly, and chat with a live AI tutor that understands exactly what you're learning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg">
                <Link href="/dashboard">Launch App <ChevronRight className="ml-2" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg">
                View Demo
              </Button>
            </div>
          </div>

          <div className="mt-20 relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <Image 
              src="https://picsum.photos/seed/eduhero/1200/600" 
              alt="EduGemini Interface" 
              width={1200} 
              height={600}
              className="object-cover"
              data-ai-hint="educational dashboard"
            />
          </div>
        </section>

        <section id="features" className="bg-white py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-headline text-3xl font-bold mb-4">Master Your Studies in Minutes</h2>
              <p className="text-muted-foreground">Everything you need to transform handwritten notes into actionable knowledge.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Camera className="w-8 h-8 text-primary" />,
                  title: "Note Scanner",
                  description: "Capture handwritten or typed notes. Our AI processes the image and extracts key insights automatically."
                },
                {
                  icon: <MessageSquare className="w-8 h-8 text-primary" />,
                  title: "Live AI Tutor",
                  description: "Chat with a context-aware AI that can see your notes and provide personalized explanations."
                },
                {
                  icon: <BrainCircuit className="w-8 h-8 text-primary" />,
                  title: "Deep Reasoning",
                  description: "Get summaries that go beyond text extraction, identifying core concepts and relationships."
                }
              ].map((feature, i) => (
                <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50">
                  <CardContent className="pt-8">
                    <div className="mb-6 p-3 bg-white w-fit rounded-xl shadow-sm">
                      {feature.icon}
                    </div>
                    <h3 className="font-headline text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BrainCircuit className="w-8 h-8" />
            <span className="font-headline font-bold text-2xl tracking-tight">EduGemini</span>
          </div>
          <p className="text-white/70 max-w-md mx-auto mb-8">
            Empowering students with state-of-the-art multimodal AI agents.
          </p>
          <div className="text-sm text-white/50">
            © {new Date().getFullYear()} EduGemini. Powered by Google Gemini.
          </div>
        </div>
      </footer>
    </div>
  );
}
