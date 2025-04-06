'use client'
import { useState } from "react";
import styles from "./Navbar.module.scss";
import Dialog from "./Dialog";

export default function Navbar() {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  return (
    <>
      <nav className={`${styles.navbar} flex justify-between items-center px-6 py-4 shadow-md`}>
        <h1 className="text-2xl font-bold">Tier List Creator</h1>
        
        <div className="flex gap-4">
          <button 
            className={styles.navButton}
            onClick={() => setIsInstructionsOpen(true)}
          >
            Instructions
          </button>
          <button className={styles.navButton}>Examples</button>
        </div>
      </nav>

      {/* Instructions Dialog */}
      <Dialog 
        isOpen={isInstructionsOpen} 
        onClose={() => setIsInstructionsOpen(false)}
        title="How to use Tier List Creator"
      >
        <div className="space-y-4">
          <p>Welcome to the Tier List Creator! Here's how to use it:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Add images to the Character Pool by clicking "Upload Folder" or dragging images</li>
            <li>Drag characters from the pool to the tier rows to organize them</li>
            <li>You can rename tiers by clicking on their names</li>
            <li>Add or remove tiers using the buttons at the bottom</li>
            <li>Share your tier list when you're done!</li>
          </ol>
          <p className="text-sm text-gray-500">
            Note: Only PNG, JPEG, and WebP images are supported.
          </p>
        </div>
      </Dialog>
    </>
  );
}