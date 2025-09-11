import { MessageSquareQuote } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-start gap-4 p-4 md:p-8">
        <MessageSquareQuote className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Transcript Insights
        </h1>
      </div>
    </header>
  );
}
