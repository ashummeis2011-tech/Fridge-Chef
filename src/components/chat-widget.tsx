'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { handleChat } from '@/app/actions';
import { type ChatHistory, type ChatMessage } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatHistory>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await handleChat({ history: messages, message: input });

    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Chat Error',
        description: result.error,
      });
      // Optionally remove the user's message if the call failed
      setMessages(prev => prev.slice(0, prev.length -1));
    } else if (result.response) {
      const modelMessage: ChatMessage = { role: 'model', content: result.response };
      setMessages((prev) => [...prev, modelMessage]);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full h-14 w-14 shadow-lg">
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          <span className="sr-only">Toggle Chat</span>
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-full max-w-sm h-[60vh] flex flex-col shadow-2xl animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-6 w-6 text-primary" />
              FridgeChef AI Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'model' && (
                       <div className="p-2 bg-primary/10 rounded-full">
                         <Bot className="h-5 w-5 text-primary" />
                       </div>
                    )}
                     <div
                      className={cn(
                        'rounded-lg px-3 py-2 max-w-[80%]',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                        <div className="p-2 bg-muted rounded-full">
                          <User className="h-5 w-5" />
                        </div>
                    )}
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                        <div className="p-2 bg-primary/10 rounded-full">
                         <Bot className="h-5 w-5 text-primary" />
                       </div>
                       <div className="rounded-lg px-3 py-2 bg-muted flex items-center gap-2">
                           <Sparkles className="h-4 w-4 animate-pulse" />
                           <p className="text-sm text-muted-foreground">Thinking...</p>
                       </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-2 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about recipes..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
