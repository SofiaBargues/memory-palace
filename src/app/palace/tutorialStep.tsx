import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export function TutorialStep({onContinueClick}:{onContinueClick:()=>void}) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        El Método Loci: Palacio de la Memoria
      </h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">¿Cómo funciona?</h2>
              <p className="text-muted-foreground">
                El método Loci consiste en asociar información que quieres
                recordar con lugares específicos de un espacio familiar.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=200&width=300"
                width={300}
                height={200}
                alt="Ilustración del método Loci"
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Cómo usar esta aplicación:
          </h2>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Crear un palacio</h3>
                <p className="text-sm text-muted-foreground">
                  Te proporcionaremos un palacio de memoria virtual para usar.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Elegir palabras</h3>
                <p className="text-sm text-muted-foreground">
                  Selecciona o usa nuestras palabras predefinidas para
                  memorizar.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Leer la historia</h3>
                <p className="text-sm text-muted-foreground">
                  Lee una historia que conecta las palabras con lugares en tu
                  palacio.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Poner a prueba tu memoria</h3>
                <p className="text-sm text-muted-foreground">
                  Intenta recordar todas las palabras en el orden correcto.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="flex justify-center">
          <Button size="lg" className="gap-2" onClick={onContinueClick}>
            Continuar
            <ChevronRight className="h-4 w-4" />
          </Button>
      </div>
    </div>
  );
}
