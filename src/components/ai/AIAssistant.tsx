import { useState } from 'react';
import { Sparkles, Send, User, Bot, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What does the Bible say about faith?",
  "Explain John 3:16",
  "How can I pray more effectively?",
  "What is the meaning of Psalm 23?",
  "Summarize the book of Genesis",
];

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Bible study assistant. I can help you understand scripture, answer questions about the Bible, summarize teachings, and provide spiritual guidance. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response (in production, this would call an actual AI API)
    setTimeout(() => {
      const responses: Record<string, string> = {
        faith: 'Faith is a central theme in the Bible. Hebrews 11:1 defines it as "the substance of things hoped for, the evidence of things not seen." Faith is trusting in God\'s promises and His character, even when we cannot see the outcome. Throughout Scripture, we see examples of faith in action - from Abraham leaving his homeland to the disciples following Jesus. Faith grows through hearing God\'s Word (Romans 10:17) and is essential for pleasing God (Hebrews 11:6).',
        pray: 'The Bible teaches us several key principles about prayer. Jesus gave us the Lord\'s Prayer as a model (Matthew 6:9-13). Key elements include: acknowledging God\'s holiness, submitting to His will, asking for daily provision, seeking forgiveness, and requesting protection from evil. Paul encourages us to "pray without ceasing" (1 Thessalonians 5:17) and to bring all our concerns to God with thanksgiving (Philippians 4:6). Remember, effective prayer is not about eloquent words but a sincere heart.',
        default: 'That\'s a wonderful question! The Bible offers rich wisdom on this topic. I encourage you to explore related passages and pray for understanding. The Holy Spirit is our ultimate teacher (John 14:26), guiding us into all truth. Would you like me to suggest some specific Bible passages to study on this topic?',
      };
      
      let response = responses.default;
      const lowercaseInput = input.toLowerCase();
      if (lowercaseInput.includes('faith')) response = responses.faith;
      if (lowercaseInput.includes('pray')) response = responses.pray;
      if (lowercaseInput.includes('john 3:16')) {
        response = 'John 3:16 is one of the most beloved verses in the Bible: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."\n\nThis verse beautifully summarizes the gospel message:\n\n1. **God\'s Love** - The verse begins with God\'s immense love for all humanity\n2. **God\'s Gift** - He gave His only Son, Jesus Christ\n3. **Universal Invitation** - "Whosoever" means the offer is for everyone\n4. **Faith Requirement** - Belief in Jesus is the key\n5. **Eternal Promise** - The result is everlasting life, not perishing\n\nThis verse comes from Jesus\' conversation with Nicodemus about being "born again." It encapsulates the heart of Christianity - salvation through faith in Christ.';
      }
      if (lowercaseInput.includes('psalm 23')) {
        response = 'Psalm 23 is known as "The Shepherd\'s Psalm," written by David. Here\'s its beautiful meaning:\n\n**"The LORD is my shepherd"** - God personally cares for us like a shepherd tends sheep\n\n**"I shall not want"** - He provides all our needs\n\n**"Green pastures... still waters"** - He gives us rest and refreshment\n\n**"Restores my soul"** - He heals and renews us spiritually\n\n**"Valley of the shadow of death"** - Even in our darkest moments, God is with us\n\n**"Thy rod and staff"** - His discipline and guidance comfort us\n\n**"Table before enemies"** - He provides for us even amid opposition\n\n**"Goodness and mercy shall follow me"** - God\'s blessings pursue us throughout life\n\nThis psalm offers profound comfort, reminding us that God is our caring shepherd who guides, protects, and provides for us always.';
      }
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Bible Assistant</h1>
            <p className="text-sm text-muted-foreground">Ask questions, get answers</p>
          </div>
        </div>
      </header>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.role === 'user' && "flex-row-reverse"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                message.role === 'assistant' ? "bg-primary/10" : "bg-muted"
              )}>
                {message.role === 'assistant' ? (
                  <Sparkles className="w-4 h-4 text-primary" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className={cn(
                "rounded-2xl px-4 py-3 max-w-[80%]",
                message.role === 'assistant' 
                  ? "bg-muted" 
                  : "bg-primary text-primary-foreground"
              )}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
        
        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="mt-6 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      
      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about the Bible..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
