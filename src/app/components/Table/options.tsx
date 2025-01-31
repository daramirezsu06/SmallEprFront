import Link from "next/link";

export default function RenderOptions({
  options,
}: {
  options: { name: string; href: string }[];
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Módulos</h1>
      <div className="flex flex-col space-y-4">
        {options.map((option, index) => (
          <Link key={index} href={option.href}>
            <button className="w-60 py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out">
              {option.name}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
