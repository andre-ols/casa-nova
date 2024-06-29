import { FC } from "react";

export const Header: FC = () => {
  return (
    <header className="w-full">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">A&L</h1>
        <nav>
          <a href="/presentes" className="text-gray-800 hover:text-gray-600">
            Lista de Presentes
          </a>
        </nav>
      </div>
    </header>
  );
};