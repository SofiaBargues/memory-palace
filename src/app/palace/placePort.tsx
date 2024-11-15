export function StoryPart({
  narrative,
  image,
}: {
  narrative: string;
  image: string;
}) {
  return (
    <div className="flex flex-col gap-3 relative ">
      <img
        className="max-w-[900px] max-h-[900px] aspect-square rounded-lg "
        src={image}
        alt={image}
      />
      <div className="bg-white opacity-70 p-2 absolute bottom-2 ">
        <div
          className="text-wrap w-auto  bg-white p-2 border-border"
          dangerouslySetInnerHTML={{ __html: narrative }}
        ></div>
      </div>
    </div>
  );
}
