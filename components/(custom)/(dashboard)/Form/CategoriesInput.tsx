'use client'

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { technologyCategories } from "@/utils/constants";
import { useEffect, useState } from "react";
import { Tags, Tag } from "lucide-react";

function CategoriesInput({ defaultValue }: { defaultValue?: string }) {
  const name = "category";
  const [value, setValue] = useState(defaultValue || technologyCategories[0].label);
  
  // Listen for custom event for programmatic updates
  useEffect(() => {
    const handleSelectUpdate = (e: CustomEvent) => {
      if (e.detail?.name === name && e.detail?.value) {
        setValue(e.detail.value);
      }
    };
    
    document.addEventListener('shadcn-select-update', handleSelectUpdate as EventListener);
    
    return () => {
      document.removeEventListener('shadcn-select-update', handleSelectUpdate as EventListener);
    };
  }, []);

  // Find the current category for displaying the icon
  const currentCategory = technologyCategories.find(cat => cat.label === value);
  
  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium capitalize mb-4 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Tags className="h-4 w-4 text-primary" />
            <span>Workflow Category</span>
          </div>
        </Label>

        {currentCategory && (
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
            <currentCategory.icon className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary capitalize">{value.replace('_', ' ')}</span>
          </div>
        )}
      </div>

      <div className="relative">
        <Select
          value={value}
          onValueChange={setValue}
          name={name}
          required
        >
          <SelectTrigger 
            id={name}
            className="w-full border-input focus:ring-primary/20 focus:border-primary transition-all duration-200"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                <span>Select a category for your workflow</span>
              </div>
            </div>
            <div className="py-1">
              {technologyCategories.map((item) => {
                return (
                  <SelectItem 
                    key={item.label} 
                    value={item.label}
                    className="py-2.5 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-primary" /> 
                      <span className="capitalize">{item.label.replace('_', ' ')}</span>
                    </span>
                  </SelectItem>
                );
              })}
            </div>
          </SelectContent>
        </Select>

        <input type="hidden" name={name} value={value} />
      </div>

      <p className="text-xs text-muted-foreground">
        Select the most relevant category to help users discover your workflow.
      </p>
    </div>
  );
}

export default CategoriesInput;