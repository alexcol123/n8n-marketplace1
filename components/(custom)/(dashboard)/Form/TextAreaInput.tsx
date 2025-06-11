'use client';

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlignLeft, Info } from "lucide-react";
import { useState } from "react";

type TextAreaInputProps = {
  name: string;
  labelText?: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  helperText?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
};

function TextAreaInput({
  name,
  labelText,
  defaultValue = "",
  required = false,
  className = "",
  placeholder,
  helperText,
  minLength,
  maxLength,
  rows = 4,
}: TextAreaInputProps) {
  const [charCount, setCharCount] = useState(defaultValue?.length || 0);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  // Determine if we're approaching the limit (80% or more)
  const isApproachingLimit = maxLength && charCount >= maxLength * 0.8;
  // Determine if we're at or exceeding the limit
  const isAtLimit = maxLength && charCount >= maxLength;
  // Determine if we're below the minimum
  const isBelowMin = minLength && charCount < minLength;

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium mb-4 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4 text-primary" />
            <span className="capitalize">{labelText || name}</span>
            {required && <span className="text-destructive ml-1">*</span>}
          </div>
        </Label>
        
        {/* Character counter */}
        {(minLength || maxLength) && (
          <div 
            className={cn(
              "text-xs font-medium flex items-center gap-1.5",
              isAtLimit ? "text-destructive" : 
              isApproachingLimit ? "text-amber-500" : 
              isBelowMin ? "text-amber-500" : 
              "text-muted-foreground"
            )}
          >
            <span>{charCount}</span>
            {maxLength && <span>/ {maxLength}</span>}
            {minLength && !maxLength && <span>(min: {minLength})</span>}
          </div>
        )}
      </div>
      
      <div className={cn(
        "relative rounded-md overflow-hidden border transition-all duration-200",
        isAtLimit ? "border-destructive/50" : 
        isApproachingLimit ? "border-amber-500/50" : 
        isBelowMin ? "border-amber-500/50" : 
        "border-input hover:border-primary/50 focus-within:border-primary"
      )}>
        <Textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder || labelText || name}
          rows={rows}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          onChange={handleTextChange}
          className={cn(
            "resize-y min-h-[5rem] border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
            className
          )}
        />
      </div>
      
      {/* Helper text or constraints info */}
      {(helperText || minLength || maxLength) && (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <div>
            {helperText}
            {!helperText && minLength && maxLength && (
              <span>Enter between {minLength} and {maxLength} characters.</span>
            )}
            {!helperText && minLength && !maxLength && (
              <span>Enter at least {minLength} characters.</span>
            )}
            {!helperText && !minLength && maxLength && (
              <span>Maximum {maxLength} characters allowed.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TextAreaInput;