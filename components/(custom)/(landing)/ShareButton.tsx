"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share2, Copy, Check, Link as LinkIcon, X } from "lucide-react";
import { toast } from "sonner";

import {
  XIcon,
  EmailShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  PinterestShareButton,
  RedditShareButton,
  ThreadsShareButton,
  WorkplaceShareButton,
  EmailIcon,
  LinkedinIcon,
  FacebookIcon,
  WhatsappIcon,
  TelegramIcon,
  TwitterShareButton,
  PinterestIcon,
  RedditIcon,
  ThreadsIcon,
  WorkplaceIcon,
} from "react-share";

interface ShareButtonProps {
  propertyId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  iconOnly?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost";
}

function ShareButton({
  propertyId,
  name,
  description = "Check out this awesome workflow!",
  imageUrl,
  iconOnly = false,
  variant = "outline",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");

  // Use useEffect to safely access window object only on client-side
  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_WEBSITE_URL || window.location.origin;
    setShareLink(`${baseUrl}/workflow/${propertyId}`);
  }, [propertyId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
      console.error("Failed to copy:", err);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={iconOnly ? "icon" : "sm"}
          className={`group ${
            iconOnly ? "h-9 w-9 p-0" : "h-9 px-4 gap-1.5"
          } border-primary/20 hover:bg-primary/30 hover:border-primary/40 transition-colors`}
          onClick={() => setIsOpen(true)}
        >
          <Share2
            className={`${
              iconOnly ? "h-4 w-4" : "h-4 w-4 mr-1"
            } text-primary-foreground group-hover:text-primary/80 hover:border hover:border-primary transition-colors`}
            aria-hidden="true"
          />
          {!iconOnly && <span>Share</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        align="center"
        sideOffset={10}
        className="w-100 border-8 rounded-3xl border-primary p-10 bg-slate-800/90 backdrop-blur-sm relative"
      >
        {/* Close button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleClose}
          className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-slate-700/50 p-0 focus:outline-none"
        >
          <X size={18} className="text-slate-300" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="space-y-4">
          <div className="text-sm font-medium text-center mb-3 text-white">
            Share this workflow
          </div>

          {/* Copy Link Button */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex-1 overflow-hidden rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-300 truncate">
              {shareLink}
            </div>
            <Button
              variant="outline"
              size="icon"
              className={`h-8 w-8 ${
                copied
                  ? "bg-primary/20 border-primary/40"
                  : "bg-slate-700 border-slate-600"
              } hover:bg-slate-600`}
              onClick={handleCopyLink}
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4 text-slate-300" />
              )}
            </Button>
          </div>

          {/* Only render sharing buttons if we have a shareLink (client-side) */}
          {shareLink && (
            <>
              {/* Social Media Sharing Buttons - Row 1 */}
              <div className="grid grid-cols-5 gap-2">
                <div className="flex flex-col items-center gap-1">
                  <TwitterShareButton
                    url={shareLink}
                    title={name}
                    className="focus:outline-none"
                  >
                    <div className="p-2 rounded-full bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 transition-colors">
                      <XIcon size={28} round />
                    </div>
                    <span className="text-xs mt-1 text-slate-300">Twitter</span>
                  </TwitterShareButton>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <FacebookShareButton
                    url={shareLink}
            
                    className="focus:outline-none"
                  >
                    <div className="p-2 rounded-full bg-[#1877F2]/20 hover:bg-[#1877F2]/30 transition-colors">
                      <FacebookIcon size={28} round />
                    </div>
                    <span className="text-xs mt-1 text-slate-300">
                      Facebook
                    </span>
                  </FacebookShareButton>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <LinkedinShareButton
                    url={shareLink}
                    title={name}
                    summary={description}
                    className="focus:outline-none"
                  >
                    <div className="p-2 rounded-full bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 transition-colors">
                      <LinkedinIcon size={28} round />
                    </div>
                    <span className="text-xs mt-1 text-slate-300">
                      LinkedIn
                    </span>
                  </LinkedinShareButton>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <ThreadsShareButton
                    url={shareLink}
                    title={name}
                    className="focus:outline-none"
                  >
                    <div className="p-2 rounded-full bg-[#FFFFFF]/20 hover:bg-[#FFFFFF]/30 transition-colors">
                      <ThreadsIcon size={28} round />
                    </div>
                    <span className="text-xs mt-1 text-slate-300">Threads</span>
                  </ThreadsShareButton>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <WorkplaceShareButton
                    url={shareLink}
                    quote={name}
                    className="focus:outline-none"
                  >
                    <div className="p-2 rounded-full bg-[#3b5998]/20 hover:bg-[#3b5998]/30 transition-colors">
                      <WorkplaceIcon size={28} round />
                    </div>
                    <span className="text-xs mt-1 text-slate-300">
                      Workplace
                    </span>
                  </WorkplaceShareButton>
                </div>
              </div>

              {/* Social Media Sharing Buttons - Row 2 */}
              <div className="grid grid-cols-5 gap-2">
                <div className="flex flex-col items-center gap-1">
                  <WhatsappShareButton
                    url={shareLink}
                    title={name}
                    className="focus:outline-none"
                  >
                    <div className="p-2 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 transition-colors">
                      <WhatsappIcon size={28} round />
                    </div>
                    <span className="text-xs mt-1 text-slate-300">
                      WhatsApp
                    </span>
                  </WhatsappShareButton>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <TelegramShareButton
                    url={shareLink}
                    title={name}
                    className="focus:outline-none"
                  >
                    <div className="p-2 rounded-full bg-[#0088cc]/20 hover:bg-[#0088cc]/30 transition-colors">
                      <TelegramIcon size={28} round />
                    </div>
                    <span className="text-xs mt-1 text-slate-300">
                      Telegram
                    </span>
                  </TelegramShareButton>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <PinterestShareButton
                    url={shareLink}
                    media={
                      imageUrl ||
                      `${
                        process.env.NEXT_PUBLIC_WEBSITE_URL || ""
                      }/default-image.png`
                    }
                    description={name}
                    className="focus:outline-none"
                  >
                    <div className="p-2 rounded-full bg-[#E60023]/20 hover:bg-[#E60023]/30 transition-colors">
                      <PinterestIcon size={28} round />
                    </div>
                    <span className="text-xs mt-1 text-slate-300">
                      Pinterest
                    </span>
                  </PinterestShareButton>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <RedditShareButton
                    url={shareLink}
                    title={name}
                    className="focus:outline-none"
                  >
                    <div className="p-2 rounded-full bg-[#FF4500]/20 hover:bg-[#FF4500]/30 transition-colors">
                      <RedditIcon size={28} round />
                    </div>
                    <span className="text-xs mt-1 text-slate-300">Reddit</span>
                  </RedditShareButton>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <EmailShareButton
                    url={shareLink}
                    subject={name}
                    body={`${description}\n\n${shareLink}`}
                    className="focus:outline-none"
                  >
                    <div className="p-2 rounded-full bg-[#D44638]/20 hover:bg-[#D44638]/30 transition-colors">
                      <EmailIcon size={28} round />
                    </div>
                    <span className="text-xs mt-1 text-slate-300">Email</span>
                  </EmailShareButton>
                </div>
              </div>
            </>
          )}

          {/* Copy Link Button - Full Width */}
          <div className="mt-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 p-2 h-auto focus:outline-none rounded-md bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
              onClick={handleCopyLink}
              disabled={!shareLink}
            >
              <LinkIcon size={16} className="text-primary" />
              <span className="text-sm">
                {copied ? "Link Copied!" : "Copy Link"}
              </span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ShareButton;
