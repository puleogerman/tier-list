import TierList from "./components/TierList";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Tier List Generator</h1>
      <TierList />
    </div>
  );
}