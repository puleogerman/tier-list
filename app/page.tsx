import Navbar from "./components/Navbar";
import TierList from "./components/TierList";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <TierList />
      </div>
    </div>
  );
}
