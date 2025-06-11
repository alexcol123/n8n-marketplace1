'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function NavSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState(
    searchParams.get('search')?.toString() || ''
  );

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    replace(`/?${params.toString()}`);
  }, 400); // Slightly faster response

  useEffect(() => {
    if (!searchParams.get('search')) {
      setSearch('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('search')]);

  const clearSearch = () => {
    setSearch('');
    handleSearch('');
    // Focus the input after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  return (
    <div className="relative w-full max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <Input
        ref={inputRef}
        type='text'
        placeholder='Find a workflow...'
        className='pl-9 pr-8 dark:bg-muted/40 focus:dark:bg-muted transition-colors border-primary/20 focus:border-primary/40'
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch(e.target.value);
        }}
        value={search}
        aria-label="Search workflows"
      />
      
      {search && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-0 pr-2 flex items-center h-full"
          onClick={clearSearch}
          tabIndex={-1}
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Button>
      )}
    </div>
  );
}

export default NavSearch;