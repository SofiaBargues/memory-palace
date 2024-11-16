import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-200 mb-4 md:mb-0">
            © {new Date().getFullYear()} Tu Empresa. Todos los derechos
            reservados.
          </p>
          <div className="flex space-x-4">
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-gray-500"
            >
              Política de privacidad
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-gray-500"
            >
              Términos de servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
