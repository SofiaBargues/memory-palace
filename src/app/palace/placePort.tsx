export function StoryPart({
  narrative,
  image,
}: {
  narrative: string;
  image: string;
}) {
  return (
    <div className="flex flex-col  gap-3">
      <img className="w-96 h-96 rounded-lg" src={image} alt={image} />
      <div
        className="text-wrap w-96"
        dangerouslySetInnerHTML={{ __html: narrative }}
      ></div>
    </div>
  );
}
