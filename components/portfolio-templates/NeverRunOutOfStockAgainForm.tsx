"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PortfolioShell from "@/components/portfolio-templates/PortfolioShell";
import { usePortfolioFormSubmit } from "@/hooks/usePortfolioFormSubmit";
import { useFormData } from "@/hooks/useFormData";

interface FormData {
  field_1756525144496: string;
}

export default function NeverRunOutOfStockAgainForm({ siteName }: { siteName: string }) {
  const { isSubmitting, submitForm } = usePortfolioFormSubmit();
  const { states, handleInputChange, resetForm } = useFormData({
    field_1756525144496: ''
  });
  
    const validateForm = () => true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await submitForm(siteName, {
      type: '00003-never-run-out-of-stock-again',
      data: states,
      timestamp: new Date().toISOString()
    }, () => {
      resetForm();
      // Show success message
      alert('Your request has been submitted successfully!');
    });
  };

  return (
    <PortfolioShell siteName={siteName}>
      <Card className="w-full max-w-2xl bg-card shadow-2xl border-primary/20 mx-auto">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Never Run Out of Stock Again! 📉🚫
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your details for the Never Run Out of Stock Again! 📉🚫 workflow
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
                          <div>
              <Label htmlFor="field_1756525144496">name</Label>
              <Input
                type="text"
                id="field_1756525144496"
                name="field_1756525144496"
                value={states.field_1756525144496}
                onChange={handleInputChange}
                placeholder="ALex"
                required={false}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-12 text-lg font-medium"
            >
              {isSubmitting ? 'Processing...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PortfolioShell>
  );
}