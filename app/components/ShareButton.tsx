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
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {copied ? "Link Copied! ✅" : "Share Tier List 📤"}
    </button>
  );
};

export default ShareButton;