"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  GripVertical,
  Type,
  Mail,
  Hash,
  FileText,
  Upload,
  ToggleLeft,
  Calendar,
  DollarSign
} from "lucide-react";

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'file' | 'select' | 'checkbox' | 'date' | 'currency';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select fields
  optionsString?: string; // raw string for editing
}

export interface FormConfig {
  title: string;
  description: string;
  fields: FormField[];
  submitText: string;
  successMessage: string;
}

interface FormBuilderProps {
  siteName: string;
  workflowTitle: string;
  onSave: (config: FormConfig) => void;
  onCancel: () => void;
  initialConfig?: FormConfig;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input', icon: Type },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'textarea', label: 'Text Area', icon: FileText },
  { value: 'file', label: 'File Upload', icon: Upload },
  { value: 'select', label: 'Dropdown', icon: ToggleLeft },
  { value: 'checkbox', label: 'Checkbox', icon: ToggleLeft },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'currency', label: 'Currency', icon: DollarSign },
];

export default function FormBuilder({ 
  siteName, 
  workflowTitle, 
  onSave, 
  onCancel, 
  initialConfig 
}: FormBuilderProps) {
  const [config, setConfig] = useState<FormConfig>(
    initialConfig || {
      title: workflowTitle || `${siteName} Form`,
      description: `Enter your details for the ${workflowTitle || siteName} workflow`,
      fields: [],
      submitText: 'Submit',
      successMessage: 'Your request has been submitted successfully!'
    }
  );

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}...`,
      required: false,
      ...(type === 'select' && { 
        options: ['Option 1', 'Option 2', 'Option 3'],
        optionsString: 'Option 1, Option 2, Option 3'
      })
    };
    
    setConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    setConfig(prev => {
      const fields = [...prev.fields];
      const index = fields.findIndex(f => f.id === fieldId);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= fields.length) return prev;
      
      [fields[index], fields[newIndex]] = [fields[newIndex], fields[index]];
      return { ...prev, fields };
    });
  };

  return (
    <div className="space-y-8">
      {/* Form Configuration */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/20">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg">⚙️</span>
            </div>
            Form Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="group">
            <Label htmlFor="form-title" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Form Title
            </Label>
            <div className="relative">
              <Input
                id="form-title"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter form title..."
                className="px-4 py-4 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/60 text-foreground group-hover:border-primary/30 text-lg font-semibold"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>
          
          <div className="group">
            <Label htmlFor="form-description" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Description
            </Label>
            <div className="relative">
              <Textarea
                id="form-description"
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this form does..."
                rows={3}
                className="px-4 py-4 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/60 text-foreground group-hover:border-primary/30 resize-none"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <Label htmlFor="submit-text" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Submit Button Text
              </Label>
              <div className="relative">
                <Input
                  id="submit-text"
                  value={config.submitText}
                  onChange={(e) => setConfig(prev => ({ ...prev, submitText: e.target.value }))}
                  className="px-4 py-4 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 placeholder:text-muted-foreground/60 text-foreground group-hover:border-green-500/30 font-medium"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>
            <div className="group">
              <Label htmlFor="success-message" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Success Message
              </Label>
              <div className="relative">
                <Input
                  id="success-message"
                  value={config.successMessage}
                  onChange={(e) => setConfig(prev => ({ ...prev, successMessage: e.target.value }))}
                  className="px-4 py-4 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-muted-foreground/60 text-foreground group-hover:border-blue-500/30 font-medium"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Field Types */}
      <Card className="border-2 border-emerald-200/50 shadow-lg bg-background">
        <CardHeader className="border-b border-emerald-200/30">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Plus className="text-emerald-600 w-5 h-5" />
            </div>
            Add Form Fields
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-background">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIELD_TYPES.map(fieldType => {
              const Icon = fieldType.icon;
              return (
                <Button
                  key={fieldType.value}
                  variant="outline"
                  onClick={() => addField(fieldType.value as FormField['type'])}
                  className="justify-start h-14 px-4 border-2 border-border hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-all duration-200 group bg-background"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/10 group-hover:bg-emerald-500/20 rounded-lg flex items-center justify-center transition-colors">
                      <Icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      {fieldType.label}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Form Fields ({config.fields.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No fields added yet. Click the buttons above to add form fields.</p>
            </div>
          ) : (
            config.fields.map((field, index) => (
              <Card key={field.id} className="border-l-4 border-l-primary/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1 mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveField(field.id, 'up')}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <GripVertical className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveField(field.id, 'down')}
                        disabled={index === config.fields.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <GripVertical className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{field.type}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeField(field.id)}
                          className="text-destructive h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            Field Label
                          </Label>
                          <div className="relative">
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              placeholder="Field label..."
                              className="px-3 py-3 border-2 border-border rounded-lg bg-background/50 focus:outline-none focus:ring-3 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 group-hover:border-purple-500/30 font-medium"
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                          </div>
                        </div>
                        <div className="group">
                          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            Placeholder
                          </Label>
                          <div className="relative">
                            <Input
                              value={field.placeholder || ''}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                              placeholder="Placeholder text..."
                              className="px-3 py-3 border-2 border-border rounded-lg bg-background/50 focus:outline-none focus:ring-3 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 group-hover:border-orange-500/30 font-medium"
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                          </div>
                        </div>
                      </div>

                      {field.type === 'select' && (
                        <div className="group">
                          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                            Options (comma-separated)
                          </Label>
                          <div className="relative">
                            <input
                              type="text"
                              value={field.optionsString || field.options?.join(', ') || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                const options = value ? value.split(',').map(opt => opt.trim()).filter(Boolean) : [];
                                updateField(field.id, { 
                                  optionsString: value,
                                  options: options
                                });
                              }}
                              onKeyDown={(e) => {
                                // Allow all keys including comma
                              }}
                              placeholder="Option 1, Option 2, Option 3"
                              className="w-full px-3 py-3 border-2 border-border rounded-lg bg-background/50 focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 group-hover:border-indigo-500/30 font-medium text-foreground placeholder:text-muted-foreground/60"
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <span>💡</span>
                            Separate options with commas for better readability
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`required_${field.id}`}
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <Label htmlFor={`required_${field.id}`}>Required field</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="px-8 py-3 border-2 border-border hover:border-primary/30 hover:bg-muted/50 transition-all duration-200 font-semibold text-lg"
        >
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(config)}
          disabled={config.fields.length === 0}
          className="px-8 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transform"
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            Generate Component
          </span>
        </Button>
      </div>

      {/* Preview */}
      {config.fields.length > 0 && (
        <Card className="border-2 border-blue-200/50 shadow-lg bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent border-b border-blue-200/30">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">👁️</span>
              </div>
              Form Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-background/80 backdrop-blur-sm border-2 border-primary/20 rounded-2xl p-8 space-y-6 shadow-inner">
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {config.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {config.description}
                </p>
              </div>
              
              <div className="space-y-6 pt-4">
                {config.fields.map(field => (
                  <div key={field.id} className="group">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {field.label} 
                      {field.required && <span className="text-red-500 text-base">*</span>}
                    </Label>
                    <div className="relative">
                      {field.type === 'textarea' ? (
                        <Textarea 
                          placeholder={field.placeholder} 
                          disabled 
                          className="px-4 py-4 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm resize-none"
                          rows={3}
                        />
                      ) : field.type === 'select' ? (
                        <Select disabled>
                          <SelectTrigger className="px-4 py-4 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm h-auto">
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                        </Select>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center gap-3 p-4">
                          <input type="checkbox" disabled className="h-5 w-5 rounded border-2" />
                          <span className="text-sm font-medium">{field.placeholder}</span>
                        </div>
                      ) : (
                        <Input 
                          type={field.type === 'currency' ? 'number' : field.type} 
                          placeholder={field.placeholder} 
                          disabled 
                          className="px-4 py-4 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm font-mono text-sm"
                        />
                      )}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-6">
                <Button disabled className="w-full h-14 text-lg font-semibold bg-primary/20 text-primary border-2 border-primary/30 rounded-xl">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">🚀</span>
                    {config.submitText}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}