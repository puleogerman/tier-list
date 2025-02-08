import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <nav className={`${styles.navbar} flex justify-between items-center px-6 py-4 shadow-md`}>
      {/* Title on the left */}
      <h1 className="text-2xl font-bold">Tier List Creator</h1>
      
      {/* Buttons on the right */}
      <div className="flex gap-4">
        <button className={styles.navButton}>Instructions</button>
        <button className={styles.navButton}>Examples</button>
      </div>
    </nav>
  );
}
