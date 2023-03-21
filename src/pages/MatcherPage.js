import HackerCard from "../components/HackerCard";
import FilterControls from "../components/FilterControls";

export default function MatcherPage() {
  return (
    <div className="flex flex-wrap">
      <FilterControls />
      <div className="w-full">{/* <HackerCard /> */}</div>
    </div>
  );
}
