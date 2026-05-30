"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const ITEMS = [
  {
    word: "Manzana",
    emoji: "🍎",
    association: "Una manzana gigante bloqueando la puerta",
  },
  {
    word: "Libro",
    emoji: "📚",
    association: "Libros flotando sobre el sofá",
  },
  {
    word: "Reloj",
    emoji: "⏰",
    association: "Un reloj enorme en la cocina",
  },
  {
    word: "Guitarra",
    emoji: "🎸",
    association: "Una guitarra tocando sola en la ventana",
  },
  {
    word: "Globo",
    emoji: "🎈",
    association: "Globos escapando por la escalera",
  },
];

const LOCATIONS = [
  { name: "Puerta", emoji: "🚪" },
  { name: "Sofá", emoji: "🛋️" },
  { name: "Cocina", emoji: "🍳" },
  { name: "Ventana", emoji: "🪟" },
  { name: "Escalera", emoji: "🪜" },
];

const STEPS = [
  {
    title: "El Desafío",
    subtitle: "Memorizar una lista puede parecer imposible",
  },
  {
    title: "Tu Palacio Mental",
    subtitle: "Coloca cada elemento en un lugar de tu casa",
  },
  {
    title: "Visualiza",
    subtitle: "Haz las asociaciones memorables y absurdas",
  },
  {
    title: "Recorre el Camino",
    subtitle: "Camina mentalmente por tu palacio",
  },
  {
    title: "Recuerda Todo",
    subtitle: "Cada lugar activa el recuerdo automáticamente",
  },
  {
    title: "¡Listo!",
    subtitle: "Ahora tienes el poder de recordar cualquier cosa",
  },
] as const;

const PARTICLES = [
  { left: 8, top: 18, delay: 0.1, duration: 3.2 },
  { left: 18, top: 72, delay: 1.2, duration: 4.1 },
  { left: 29, top: 34, delay: 0.7, duration: 3.7 },
  { left: 41, top: 82, delay: 1.8, duration: 4.5 },
  { left: 53, top: 22, delay: 0.4, duration: 3.4 },
  { left: 64, top: 68, delay: 1.5, duration: 4.3 },
  { left: 76, top: 38, delay: 0.9, duration: 3.9 },
  { left: 89, top: 78, delay: 1.1, duration: 4.6 },
  { left: 92, top: 16, delay: 0.3, duration: 3.5 },
  { left: 13, top: 45, delay: 1.6, duration: 4.2 },
  { left: 36, top: 12, delay: 0.8, duration: 3.8 },
  { left: 57, top: 88, delay: 1.9, duration: 4.4 },
] as const;

type Step = 0 | 1 | 2 | 3 | 4 | 5;

export default function MemoryPalaceJourney() {
  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [connectedNodes, setConnectedNodes] = useState<number[]>([]);

  const activeStep = STEPS[currentStep];

  useEffect(() => {
    if (!isPlaying) return;

    const timings = [3000, 6000, 5000, 4500, 4000, 5000];
    const timer = window.setTimeout(() => {
      if (currentStep < 5) {
        setCurrentStep((prev) => (prev + 1) as Step);
      } else {
        resetAnimation();
      }
    }, timings[currentStep]);

    return () => window.clearTimeout(timer);
  }, [currentStep, isPlaying]);

  useEffect(() => {
    if (currentStep !== 1) return;

    setConnectedNodes([]);
    const timers = ITEMS.map((_, index) =>
      window.setTimeout(() => {
        setConnectedNodes((prev) =>
          prev.includes(index) ? prev : [...prev, index]
        );
      }, index * 800 + 1500)
    );

    return () => timers.forEach(window.clearTimeout);
  }, [currentStep]);

  const challengePositions = useMemo(
    () =>
      ITEMS.map((_, index) => ({
        left: `${20 + (index % 3) * 30}%`,
        top: `${10 + Math.floor(index / 3) * 45}%`,
      })),
    []
  );

  const resetAnimation = () => {
    setCurrentStep(0);
    setConnectedNodes([]);
    setIsPlaying(true);
  };

  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="relative mx-auto flex min-h-[680px] max-w-6xl flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-cyan-950 to-stone-950 p-5 text-white shadow-2xl shadow-slate-950/20 sm:p-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {PARTICLES.map((particle, index) => (
            <motion.div
              key={index}
              className="absolute h-1 w-1 rounded-full bg-amber-300/40"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [-18, 18],
                opacity: [0.2, 0.55, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>

        <div className="absolute left-1/2 top-8 w-full max-w-md -translate-x-1/2 px-8">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-2 flex justify-between">
            {STEPS.map((_, index) => (
              <motion.div
                key={index}
                className={`h-3 w-3 rounded-full border-2 transition-all ${
                  index <= currentStep
                    ? "border-cyan-300 bg-cyan-400"
                    : "border-slate-600 bg-transparent"
                }`}
                animate={{ scale: index === currentStep ? 1.3 : 1 }}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-14 flex min-h-[450px] w-full max-w-4xl flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="challenge"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <motion.div
                  className="relative mb-8"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <div className="relative mx-auto h-48 w-72">
                    {ITEMS.map((item, index) => (
                      <motion.div
                        key={item.word}
                        className="absolute text-4xl"
                        style={challengePositions[index]}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: [0, 10, -10, 0],
                          y: [0, -10, 0],
                        }}
                        transition={{
                          delay: index * 0.15,
                          rotate: {
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3,
                          },
                          y: {
                            duration: 1.5,
                            repeat: Infinity,
                            delay: index * 0.2,
                          },
                        }}
                      >
                        {item.emoji}
                      </motion.div>
                    ))}

                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <motion.span
                        className="text-6xl text-cyan-300/60"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ?
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.p
                  className="mx-auto max-w-md text-lg text-slate-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  5 elementos sueltos... difíciles de recordar en orden
                </motion.p>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="palace"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <motion.div
                  className="relative mx-auto mb-6 h-[280px] w-[340px] max-w-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <svg viewBox="0 0 340 280" className="h-full w-full">
                    <motion.path
                      d="M170 20 L30 110 L310 110 Z"
                      fill="none"
                      stroke="url(#roofGradient)"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1 }}
                    />
                    <motion.rect
                      x="50"
                      y="110"
                      width="240"
                      height="150"
                      fill="none"
                      stroke="url(#houseGradient)"
                      strokeWidth="3"
                      rx="8"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                    <defs>
                      <linearGradient
                        id="roofGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                      <linearGradient
                        id="houseGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0">
                    {LOCATIONS.map((location, index) => {
                      const positions = [
                        { left: "8%", top: "48%" },
                        { left: "26%", top: "62%" },
                        { left: "44%", top: "52%" },
                        { left: "62%", top: "62%" },
                        { left: "80%", top: "48%" },
                      ];

                      return (
                        <motion.div
                          key={location.name}
                          className="absolute flex flex-col items-center"
                          style={positions[index]}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.15 }}
                        >
                          <motion.div
                            className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-cyan-400/60 bg-slate-900/90 text-2xl backdrop-blur"
                            animate={
                              connectedNodes.includes(index)
                                ? {
                                    boxShadow: [
                                      "0 0 15px rgba(34, 211, 238, 0.35)",
                                      "0 0 25px rgba(245, 158, 11, 0.55)",
                                      "0 0 15px rgba(34, 211, 238, 0.35)",
                                    ],
                                    borderColor: [
                                      "rgba(34, 211, 238, 0.6)",
                                      "rgba(245, 158, 11, 0.85)",
                                      "rgba(34, 211, 238, 0.6)",
                                    ],
                                  }
                                : {
                                    boxShadow:
                                      "0 0 10px rgba(34, 211, 238, 0.25)",
                                  }
                            }
                            transition={{
                              duration: 1.5,
                              repeat: connectedNodes.includes(index)
                                ? Infinity
                                : 0,
                            }}
                          >
                            {location.emoji}

                            <AnimatePresence>
                              {connectedNodes.includes(index) && (
                                <motion.div
                                  className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-lg shadow-lg shadow-amber-500/30"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15,
                                  }}
                                >
                                  {ITEMS[index].emoji}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                          <span className="mt-1.5 text-xs font-medium text-cyan-100">
                            {location.name}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.p
                  className="text-lg text-slate-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {connectedNodes.length === 0
                    ? "Tu casa tiene 5 lugares únicos y memorables"
                    : connectedNodes.length < ITEMS.length
                    ? `Colocando elementos... (${connectedNodes.length}/${ITEMS.length})`
                    : "Cada elemento tiene su lugar en tu palacio"}
                </motion.p>

                <motion.div
                  className="mt-4 flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: connectedNodes.length > 0 ? 1 : 0 }}
                >
                  {ITEMS.map((item, index) => (
                    <motion.div
                      key={item.word}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all ${
                        connectedNodes.includes(index)
                          ? "bg-gradient-to-br from-cyan-400 to-amber-400"
                          : "border border-slate-700 bg-slate-800"
                      }`}
                      initial={{ scale: 0.8 }}
                      animate={{
                        scale: connectedNodes.includes(index) ? 1 : 0.8,
                      }}
                    >
                      {item.emoji}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="visualize"
                className="w-full text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-5">
                  {ITEMS.map((item, index) => (
                    <motion.div
                      key={item.word}
                      className="rounded-lg border border-cyan-400/25 bg-slate-900/55 p-4 backdrop-blur"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.3 }}
                    >
                      <div className="mb-3 flex items-center justify-center gap-2 text-3xl">
                        <span>{item.emoji}</span>
                        <span className="text-amber-300">+</span>
                        <span>{LOCATIONS[index].emoji}</span>
                      </div>
                      <motion.p
                        className="text-xs leading-relaxed text-slate-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.3 + 0.5 }}
                      >
                        {item.association}
                      </motion.p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-6 flex items-center justify-center gap-2 text-amber-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm">
                    Entre más absurda la imagen, más fácil de recordar
                  </span>
                </motion.div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="walk"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <div className="relative mx-auto mb-8 h-32 w-full max-w-2xl">
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 100">
                    <motion.path
                      d="M 50 50 Q 150 20 200 50 T 350 50 T 500 50 T 550 50"
                      fill="none"
                      stroke="url(#pathGradient)"
                      strokeLinecap="round"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2 }}
                    />
                    <defs>
                      <linearGradient
                        id="pathGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {LOCATIONS.map((location, index) => (
                    <motion.div
                      key={location.name}
                      className="absolute"
                      style={{
                        left: `${8 + index * 20}%`,
                        top: "30%",
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.3 }}
                    >
                      <motion.div
                        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-cyan-300 bg-slate-900 text-xl"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      >
                        {location.emoji}
                      </motion.div>
                    </motion.div>
                  ))}

                  <motion.div
                    className="absolute text-3xl"
                    style={{ top: "20%" }}
                    initial={{ left: "3%" }}
                    animate={{ left: "90%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    🚶
                  </motion.div>
                </div>

                <motion.p
                  className="text-slate-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Recorre mentalmente cada ubicación en orden
                </motion.p>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="recall"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  {ITEMS.map((item, index) => (
                    <motion.div
                      key={item.word}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.4 }}
                    >
                      <motion.div
                        className="relative"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: index * 0.4,
                          type: "spring",
                          bounce: 0.5,
                        }}
                      >
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/25 text-lg">
                          {LOCATIONS[index].emoji}
                        </div>
                        <motion.div
                          className="my-1 text-cyan-300"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.4 + 0.2 }}
                        >
                          ↓
                        </motion.div>
                        <motion.div
                          className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-2xl shadow-lg shadow-cyan-500/25 md:h-16 md:w-16 md:text-3xl"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: index * 0.4 + 0.3,
                            type: "spring",
                          }}
                        >
                          {item.emoji}
                        </motion.div>
                      </motion.div>

                      <motion.span
                        className="mt-2 text-sm font-medium text-slate-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.4 + 0.4 }}
                      >
                        {item.word}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-8 flex items-center justify-center gap-2 text-emerald-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>5 de 5 elementos recordados</span>
                </motion.div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="complete"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="relative mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <motion.div
                    className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-emerald-400 to-amber-300"
                    animate={{
                      boxShadow: [
                        "0 0 30px rgba(34, 211, 238, 0.3)",
                        "0 0 60px rgba(245, 158, 11, 0.35)",
                        "0 0 30px rgba(34, 211, 238, 0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain className="h-16 w-16 text-slate-950" />
                  </motion.div>

                  {[...Array(8)].map((_, index) => (
                    <motion.div
                      key={index}
                      className="absolute text-2xl"
                      style={{
                        left: `${50 + Math.cos((index * Math.PI) / 4) * 45}%`,
                        top: `${50 + Math.sin((index * Math.PI) / 4) * 45}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                      transition={{
                        delay: 0.5 + index * 0.1,
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </motion.div>

                <motion.h2
                  className="mb-4 text-3xl font-bold text-white md:text-4xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  ¡Tu Memoria es Poderosa!
                </motion.h2>

                <motion.p
                  className="mx-auto mb-8 max-w-md text-slate-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Con el Palacio de la Memoria puedes recordar listas,
                  presentaciones, idiomas y mucho más.
                </motion.p>

                <motion.div
                  className="flex justify-center gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {[
                    { value: "5", label: "Lugares" },
                    { value: "5", label: "Elementos" },
                    { value: "∞", label: "Posibilidades" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-3xl font-bold text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="mt-8 text-center"
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold text-white">
            {activeStep.title}
          </h3>
          <p className="text-sm text-slate-300">{activeStep.subtitle}</p>
        </motion.div>

        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAnimation}
            className="border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reiniciar
          </Button>
          <Button
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="border-0 bg-gradient-to-r from-cyan-500 to-amber-400 text-slate-950 hover:from-cyan-400 hover:to-amber-300"
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pausar
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Reproducir
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
