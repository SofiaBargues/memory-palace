export function StoryPart({ narrative, image }: { narrative: string; image: string }) {
    return (
      <div className="flex flex-col m-auto gap-3">
        <img className="w-96 h-96 rounded-lg" src={image} alt={image} />
        <p className="w-96">{narrative}</p>
      </div>
    );
  }