export function StoryPart({
  narrative,
  image,
}: {
  narrative: string;
  image: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
      <img className=" aspect-square rounded-lg " src={image} alt={image} />
      <div className="flex flex-col justify-center md:bg-muted border-primary  rounded border-2 ">
        <div
          className="text-wrap w-full text-xs  md:text-xl  md:p-6 p-2  bg-background"
          dangerouslySetInnerHTML={{ __html: narrative }}
        ></div>
      </div>
    </div>
  );
}
