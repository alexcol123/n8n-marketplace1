"use client";

import { createIssue } from "@/utils/actions";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/(custom)/(dashboard)/Form/Buttons";
import FormContainer from "@/components/(custom)/(dashboard)/Form/FormContainer";
import FormInput from "@/components/(custom)/(dashboard)/Form/FormInput";
import TextAreaInput from "@/components/(custom)/(dashboard)/Form/TextAreaInput";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  AlertCircle,
  MessageSquare,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Send,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ReportIssuePage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  // Custom action wrapper that handles success state
  const handleIssueSubmit = async (prevState: Record<string, unknown>, formData: FormData) => {
    const result = await createIssue(prevState, formData);
    
    if (result.success) {
      // Extract ticket ID from message if present
      const ticketMatch = result.message.match(/#([A-Z0-9]+)/);
      if (ticketMatch) {
        setTicketId(ticketMatch[1]);
      }
      setIsSubmitted(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    
    return result;
  };

  // Reset form after 10 seconds
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
        setTicketId("");
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  if (isSubmitted) {
    return (
      <section className="container mx-auto px-2 sm:px-4 py-8 max-w-2xl">
        <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                  Issue Reported Successfully!
                </h2>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Thank you for reporting this issue. We&apos;ll review it and get back to you as soon as possible.
                </p>
                {ticketId && (
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 mb-4">
                    Ticket ID: #{ticketId}
                  </Badge>
                )}
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Report Another Issue
                  </Button>
                  <Button
                    onClick={() => window.location.href = "/"}
                    className="gap-2"
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
      {/* Page Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Report an Issue
        </h1>
        <p className="text-center text-muted-foreground text-sm sm:text-base mb-4 max-w-2xl mx-auto">
          Experiencing a problem with our platform? Let us know and we&apos;ll help you resolve it quickly.
        </p>
      </div>

      {/* Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="text-center border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="pt-6">
            <HelpCircle className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Common Issues</h3>
            <p className="text-sm text-muted-foreground">
              Check our FAQ for quick solutions to common problems
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="pt-6">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Fast Response</h3>
            <p className="text-sm text-muted-foreground">
              Most issues are resolved within 24 hours
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="pt-6">
            <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Get updates on your issue status via email
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Form Container */}
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Issue Details
          </CardTitle>
          <CardDescription>
            Please provide as much detail as possible to help us resolve your issue quickly.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <FormContainer action={handleIssueSubmit}>
            <div className="space-y-6">
              {/* Step 1: Contact Information */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    1
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Contact Information
                  </h2>
                </div>

                <div className="pl-0 sm:pl-14">
                  <div className="bg-muted/20 p-4 sm:p-6 rounded-lg border">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                      Tell us how to reach you. We&apos;ll use this information to follow up on your issue.
                    </p>

                    <div className="grid gap-4 sm:gap-6">
                      <FormInput
                        type="text"
                        name="name"
                        label="Your Name"
                        placeholder="e.g., John Smith"
                        required
                        helperText="Your full name so we know who we're helping"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput
                          type="email"
                          name="email"
                          label="Email Address"
                          placeholder="your.email@example.com"
                          required={false}
                          helperText="We'll send updates to this email"
                        />

                        <FormInput
                          type="tel"
                          name="phone"
                          label="Phone Number"
                          placeholder="+1 (555) 123-4567"
                          required={false}
                          helperText="Optional: For urgent issues"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Step 2: Issue Details */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    2
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Issue Details
                  </h2>
                </div>

                <div className="pl-0 sm:pl-14">
                  <div className="bg-muted/20 p-4 sm:p-6 rounded-lg border">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                      Describe what happened and where it occurred. The more details you provide, the faster we can help.
                    </p>

                    <div className="grid gap-4 sm:gap-6">
                      <FormInput
                        type="url"
                        name="workflowUrl"
                        label="Workflow or Page URL (Optional)"
                        placeholder="https://n8n-store.com/workflow/..."
                        required={false}
                        helperText="Link to the specific workflow or page where you experienced the issue"
                      />

                      <TextAreaInput
                        name="content"
                        labelText="Describe the Issue"
                        placeholder="Please describe what went wrong, what you were trying to do, and what you expected to happen..."
                        required
                        minLength={20}
                        maxLength={2000}
                        rows={6}
                        helperText="Be as specific as possible. Include error messages, browser info, or steps to reproduce the problem."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Step 3: Submit */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    3
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">Submit Your Report</h2>
                </div>

                <div className="pl-0 sm:pl-14">
                  <div className="bg-primary/5 p-4 sm:p-6 rounded-lg border border-primary/20">
                    <p className="text-xs sm:text-sm mb-6">
                      Review your information and submit your issue report. We&apos;ll get back to you as soon as possible.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <SubmitButton
                        className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 gap-2"
                        text="Submit Issue Report"
                      />
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Send className="h-3 w-3" />
                        <span>We typically respond within 24 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormContainer>
        </CardContent>
      </Card>

      {/* Contact Info Footer */}
      <div className="mt-8 text-center">
        <Card className="bg-muted/20 border-muted">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Need immediate help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              For urgent issues or if you prefer direct contact
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@n8n-store.com</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReportIssuePage;