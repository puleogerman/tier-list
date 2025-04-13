'use client'; 
import Navbar from "./components/Navbar";
import TierList from "./components/TierList";
import useTierList from "./hook/useTierList";


export default function Home() {
  const { resetTierList } = useTierList();

  return (
    <div>
      <Navbar onReset={resetTierList} />
      <div className="px-8 py-2">
        <TierList />
      </div>
    </div>
  );
}