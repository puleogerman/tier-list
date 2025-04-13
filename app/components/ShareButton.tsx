"use client";
import { useState } from "react";
import html2canvas from "html2canvas";


const ShareButton = ({ tierListId }: { tierListId: string }) => {
  const [copied, setCopied] = useState(false);

const captureTierList = async () => {
  const tierListElement = document.getElementById("tier-list-container");
  if (!tierListElement) return;

  try {
    const canvas = await html2canvas(tierListElement);
    const imageData = canvas.toDataURL("image/png");

    // Create a download link for PNG
    const link = document.createElement("a");
    link.href = imageData;
    link.download = "tier-list.png";
    link.click();

    // Optionally, generate a PDF
    // const pdf = new jsPDF("p", "mm", "a4");
    // const imgWidth = 190; // A4 width in mm (adjust if needed)
    // const imgHeight = (canvas.height * imgWidth) / canvas.width;
    // pdf.addImage(imageData, "PNG", 10, 10, imgWidth, imgHeight);
    // pdf.save("tier-list.pdf");
  } catch (error) {
    console.error("Error capturing Tier List:", error);
  }
};

  return (
    <button
      onClick={captureTierList}
      className="button-distorted"
    >
      {copied ? "Image saved ✅" : "Share"}
      {/* <span className="material-symbols-outlined">share</span> */}
    </button>
  );
};

export default ShareButton;