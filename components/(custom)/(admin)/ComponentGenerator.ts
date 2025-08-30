import { FormConfig, FormField } from './FormBuilder';

// Generate valid JavaScript identifier from site name
function generateValidComponentName(siteName: string): string {
  const cleanName = siteName
    .split('-')
    .map(word => {
      // Remove leading numbers and ensure first char is letter
      const cleanWord = word.replace(/^[0-9]+/, '');
      return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    })
    .filter(word => word) // Remove empty words
    .join('');
  
  // Ensure the component name starts with a letter
  const finalName = cleanName || 'Custom';
  return finalName + 'Form';
}

export function generateComponentCode(config: FormConfig, componentName: string, siteName: string): { componentCode: string; validComponentName: string } {
  // Ensure we use a valid component name
  const validComponentName = generateValidComponentName(siteName);
  const imports = `"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";${config.fields.some(f => f.type === 'select') ? `
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";` : ''}
import PortfolioShell from "@/components/portfolio-templates/PortfolioShell";
import { usePortfolioFormSubmit } from "@/hooks/usePortfolioFormSubmit";
import { useFormData } from "@/hooks/useFormData";`;

  const fieldInterfaces = generateFieldInterfaces(config.fields);
  
  const initialState = generateInitialState(config.fields);
  
  const formFields = generateFormFields(config.fields);
  
  const validationFunction = generateValidation(config.fields);

  const componentCode = `${imports}

${fieldInterfaces}

export default function ${validComponentName}({ siteName }: { siteName: string }) {
  const { isSubmitting, submitForm } = usePortfolioFormSubmit();
  const { states, handleInputChange, resetForm } = useFormData(${initialState});
  
  ${validationFunction}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await submitForm(siteName, {
      type: '${siteName}',
      data: states,
      timestamp: new Date().toISOString()
    }, () => {
      resetForm();
      // Show success message
      alert('${config.successMessage.replace(/'/g, "\\'")}');
    });
  };

  return (
    <PortfolioShell siteName={siteName}>
      <Card className="w-full max-w-2xl bg-card shadow-2xl border-primary/20 mx-auto">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            ${config.title}
          </CardTitle>
          <p className="text-muted-foreground">
            ${config.description}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            ${formFields}
            
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-12 text-lg font-medium"
            >
              {isSubmitting ? 'Processing...' : '${config.submitText}'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PortfolioShell>
  );
}`;

  return { componentCode, validComponentName };
}

function generateFieldInterfaces(fields: FormField[]): string {
  const fieldTypes = fields.map(field => {
    switch (field.type) {
      case 'number':
      case 'currency':
        return `  ${field.id}: number;`;
      case 'checkbox':
        return `  ${field.id}: boolean;`;
      case 'file':
        return `  ${field.id}: File | null;`;
      default:
        return `  ${field.id}: string;`;
    }
  });

  return `interface FormData {
${fieldTypes.join('\n')}
}`;
}

function generateInitialState(fields: FormField[]): string {
  const initialValues = fields.map(field => {
    switch (field.type) {
      case 'number':
      case 'currency':
        return `    ${field.id}: 0`;
      case 'checkbox':
        return `    ${field.id}: false`;
      case 'file':
        return `    ${field.id}: null`;
      default:
        return `    ${field.id}: ''`;
    }
  });

  return `{
${initialValues.join(',\n')}
  }`;
}

function generateFormFields(fields: FormField[]): string {
  return fields.map(field => {
    const required = field.required ? ' *' : '';
    
    switch (field.type) {
      case 'textarea':
        return `              <div>
                <Label htmlFor="${field.id}">${field.label}${required}</Label>
                <Textarea
                  id="${field.id}"
                  name="${field.id}"
                  value={states.${field.id}}
                  onChange={handleInputChange}
                  placeholder="${field.placeholder || ''}"
                  required={${field.required}}
                  rows={4}
                />
              </div>`;

      case 'select':
        const options = field.options || [];
        return `              <div>
                <Label htmlFor="${field.id}">${field.label}${required}</Label>
                <Select 
                  value={states.${field.id}} 
                  onValueChange={(value) => handleInputChange({ target: { name: '${field.id}', value } } as any)}
                  required={${field.required}}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="${field.placeholder || ''}" />
                  </SelectTrigger>
                  <SelectContent>
${options.map(option => `                    <SelectItem value="${option}">${option}</SelectItem>`).join('\n')}
                  </SelectContent>
                </Select>
              </div>`;

      case 'checkbox':
        return `              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="${field.id}"
                  name="${field.id}"
                  checked={states.${field.id}}
                  onChange={handleInputChange}
                  required={${field.required}}
                  className="h-4 w-4"
                />
                <Label htmlFor="${field.id}">${field.label}${required}</Label>
              </div>`;

      case 'file':
        return `              <div>
                <Label htmlFor="${field.id}">${field.label}${required}</Label>
                <Input
                  type="file"
                  id="${field.id}"
                  name="${field.id}"
                  onChange={handleInputChange}
                  required={${field.required}}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>`;

      case 'currency':
        return `              <div>
                <Label htmlFor="${field.id}">${field.label}${required}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    id="${field.id}"
                    name="${field.id}"
                    value={states.${field.id}}
                    onChange={handleInputChange}
                    placeholder="${field.placeholder || ''}"
                    required={${field.required}}
                    step="0.01"
                    min="0"
                    className="pl-8"
                  />
                </div>
              </div>`;

      default:
        return `              <div>
                <Label htmlFor="${field.id}">${field.label}${required}</Label>
                <Input
                  type="${field.type}"
                  id="${field.id}"
                  name="${field.id}"
                  value={states.${field.id}}
                  onChange={handleInputChange}
                  placeholder="${field.placeholder || ''}"
                  required={${field.required}}
                />
              </div>`;
    }
  }).join('\n\n');
}

function generateValidation(fields: FormField[]): string {
  const requiredFields = fields.filter(f => f.required);
  
  if (requiredFields.length === 0) {
    return `  const validateForm = () => true;`;
  }

  const validations = requiredFields.map(field => {
    switch (field.type) {
      case 'email':
        return `    if (!states.${field.id} || !/\\S+@\\S+\\.\\S+/.test(states.${field.id})) {
      alert('Please enter a valid ${field.label.toLowerCase()}');
      return false;
    }`;
      case 'number':
      case 'currency':
        return `    if (!states.${field.id} || states.${field.id} <= 0) {
      alert('Please enter a valid ${field.label.toLowerCase()}');
      return false;
    }`;
      case 'file':
        return `    if (!states.${field.id}) {
      alert('Please select a file for ${field.label.toLowerCase()}');
      return false;
    }`;
      default:
        return `    if (!states.${field.id} || states.${field.id}.trim() === '') {
      alert('Please enter ${field.label.toLowerCase()}');
      return false;
    }`;
    }
  });

  return `  const validateForm = () => {
${validations.join('\n\n')}
    return true;
  };`;
}