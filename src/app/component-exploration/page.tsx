"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Eye,
  GalleryHorizontal,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PalacePreview = {
  id: string;
  title: string;
  words: string[];
  sentences: string[];
  images: string[];
};

const palace: PalacePreview = {
  id: "style-preview",
  title: "The Curious Tale of the Wandering Orange",
  words: ["orange", "clock", "garden", "violin", "umbrella"],
  sentences: [
    "An orange rolls through a tiled hallway.",
    "A silver clock ticks from inside a flower pot.",
    "A violin plays under a bright blue umbrella.",
  ],
  images: [
    "https://res.cloudinary.com/sofiabargues/image/upload/v1733679147/palace/xnul4xr3ed3vd4ufkkfd.png",
    "https://res.cloudinary.com/sofiabargues/image/upload/v1731954832/palace/wqoyurhcyv3mm84jjkax.png",
    "https://res.cloudinary.com/sofiabargues/image/upload/v1730708900/palace/e5ujm0c2o4ssxywsr4xn.png",
  ],
};

const options = [
  {
    name: "Gallery Cover",
    intent: "Fuerte para descubrir palacios: imagen protagonista, poco texto, hover claro.",
  },
  {
    name: "Study Card",
    intent: "Mejor para repasar: palabras visibles, progreso y accion directa.",
  },
  {
    name: "Story Strip",
    intent: "Cuenta el palacio como secuencia visual, ideal si importan las escenas.",
  },
  {
    name: "Compact List",
    intent: "Mas denso para dashboards, busquedas y colecciones grandes.",
  },
];

function WordChips({ words, className }: { words: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {words.map((word) => (
        <span
          key={word}
          className="rounded-full border border-black/10 bg-white/80 px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm"
        >
          {word}
        </span>
      ))}
    </div>
  );
}

function MediaFrame({
  src,
  alt,
  className,
  ratio = "1 / 1",
}: {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn("overflow-hidden bg-zinc-100", className)}
      style={{ position: "relative", aspectRatio: ratio }}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
    </div>
  );
}

function GalleryCoverCard() {
  return (
    <article className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href="/palaces" className="block">
        <MediaFrame
          src={palace.images[0]}
          alt={palace.title}
          ratio="4 / 5"
        />
        <div className="relative -mt-28 flex min-h-28 flex-col justify-end bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5 text-white">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/75">
            <GalleryHorizontal className="size-3.5" />
            Palace preview
          </div>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">{palace.title}</h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-white/80">{palace.words.length} memory hooks</span>
            <ArrowRight className="size-5 transition group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
}

function StudyCard() {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
      <MediaFrame
        src={palace.images[1]}
        alt={palace.title}
        className="rounded-md"
        ratio="16 / 11"
      />
      <div className="px-1 pb-1 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold leading-tight text-zinc-950">{palace.title}</h2>
          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            72%
          </span>
        </div>
        <WordChips words={palace.words} className="mt-3" />
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full w-[72%] rounded-full bg-zinc-950" />
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3">
          <p className="text-sm leading-5 text-zinc-600">
            Built for quick review sessions and clear recall state.
          </p>
          <Button size="icon" aria-label="Open study palace">
            <BookOpen className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function StoryStripCard() {
  return (
    <article className="rounded-lg border border-violet-100 bg-[#fbfaff] p-4 shadow-sm">
      <div className="grid grid-cols-3 gap-2">
        {palace.images.map((image, index) => (
          <MediaFrame
            key={image}
            src={image}
            alt={`${palace.title} scene ${index + 1}`}
            className="aspect-square rounded-md"
          />
        ))}
      </div>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold leading-tight text-zinc-950">{palace.title}</h2>
          <Sparkles className="mt-0.5 size-5 shrink-0 text-violet-500" />
        </div>
        <ol className="mt-3 space-y-2">
          {palace.sentences.map((sentence, index) => (
            <li key={sentence} className="grid grid-cols-[24px_1fr] gap-2 text-sm text-zinc-650">
              <span className="flex size-6 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                {index + 1}
              </span>
              <span className="leading-6 text-zinc-600">{sentence}</span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function CompactListCard() {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-zinc-300">
      <div className="grid grid-cols-[88px_1fr] gap-4">
        <MediaFrame
          src={palace.images[2]}
          alt={palace.title}
          className="aspect-square rounded-md"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <Clock3 className="size-3.5" />
            3 scenes
          </div>
          <h2 className="mt-1 truncate text-base font-semibold text-zinc-950">{palace.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-600">
            {palace.words.join(", ")}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">{palace.words.length} words</span>
            <Button size="sm" variant="outline" className="h-8">
              <Eye className="size-3.5" />
              Preview
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ComponentExplorationPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <section className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)] md:items-end">
        <div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Palace card style exploration
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Opciones para transformar el componente actual segun el uso principal:
            descubrimiento visual, estudio, narracion o exploracion rapida.
          </p>
        </div>
        <div className="grid gap-2 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
          {options.map((option) => (
            <div key={option.name} className="grid grid-cols-[120px_1fr] gap-3 rounded-md p-2">
              <span className="text-sm font-semibold text-zinc-950">{option.name}</span>
              <span className="text-sm leading-5 text-zinc-600">{option.intent}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <GalleryCoverCard />
        <StudyCard />
        <StoryStripCard />
        <CompactListCard />
      </section>

      <section className="mt-10 grid gap-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm lg:grid-cols-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Mi lectura</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Para la home mantendria algo cercano a Gallery Cover. Para `/palaces`,
            Study Card o Compact List escala mejor cuando hay muchos elementos.
          </p>
        </div>
        <div className="lg:col-span-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md bg-zinc-50 p-4">
            <h3 className="text-sm font-semibold text-zinc-950">Mas emocional</h3>
            <p className="mt-2 text-sm leading-5 text-zinc-600">Gallery Cover y Story Strip.</p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <h3 className="text-sm font-semibold text-zinc-950">Mas funcional</h3>
            <p className="mt-2 text-sm leading-5 text-zinc-600">Study Card, con progreso y palabras.</p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <h3 className="text-sm font-semibold text-zinc-950">Mas escalable</h3>
            <p className="mt-2 text-sm leading-5 text-zinc-600">Compact List para colecciones grandes.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
