"use client";
import { useState } from "react";

const ShareButton = ({ tierListId }: { tierListId: string }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/tier-list/${tierListId}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="button-distorted"
    >
      {copied ? "Link Copied! ✅" : "Share Tier List 📤"}
    </button>
  );
};

export default ShareButton;