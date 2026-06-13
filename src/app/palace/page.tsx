import { MemoryGame } from "../../components/memoryGame";

function PalacePage({
  searchParams,
}: {
  searchParams?: { start?: string };
}) {
  return (
    <MemoryGame
      initialPalaceId={undefined}
      initialStep={
        searchParams?.start === "chooseWords" ? "chooseWords" : undefined
      }
    />
  );
}

export default PalacePage;
