import Link from 'next/link';
import { Button } from '../ui/button';
import { BookX } from 'lucide-react';

interface EmptyListProps {
  heading?: string;
  message?: string;
  btnText?: string;
  btnLink?: string;
}

function EmptyList({
  heading = 'No Workflow found.',
  message = 'Try different filters or check back later for new content',
  btnText = 'Clear filters',
  btnLink = '/',
}: EmptyListProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center mx-auto my-8 max-w-md rounded-lg border border-primary/20 bg-primary/5 shadow-sm">
      <div className="w-16 h-16 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
        <BookX className="h-8 w-8 text-primary/70" />
      </div>
      <h2 className="text-2xl font-medium text-primary mb-3">{heading}</h2>
      <p className="text-base text-primary/70 mb-6">{message}</p>
      <Button 
        asChild 
        className="rounded-full px-6 font-medium transition-colors duration-200 ease-in-out capitalize hover:bg-primary/80"
        size="lg"
      >
        <Link href={btnLink}>{btnText}</Link>
      </Button>
    </div>
  );
}

export default EmptyList;