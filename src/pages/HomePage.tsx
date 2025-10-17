import React from "react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar"; // 👈 importa el componente Navbar

export const HomePage: React.FC = () => {
  const movies = [
    "https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SY679_.jpg",
    "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_SY679_.jpg",
    "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SY679_.jpg",
    "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg",
    "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SY679_.jpg",
    "https://m.media-amazon.com/images/I/81aA7hEEykL._AC_SY679_.jpg",
  ];

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col items-center relative">
      {}
      <Navbar />

      {/* BOTÓN INICIAR SESIÓN (queda separado del logo) */}
      <div className="absolute top-10 right-8">
        <Link
          to="/loginPage"
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded text-sm md:text-base transition"
        >
          Iniciar sesión
        </Link>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex flex-col items-center justify-center text-center flex-grow mt-40 px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          Las mejores <br /> Películas están aquí
        </h2>

        <p className="text-gray-300 text-sm mb-12">
          ¿No tienes cuenta?{" "}
          <Link to="/RegisterPage" className="text-red-500 hover:underline">
            Regístrate aquí
          </Link>
        </p>

        {/* GRID DE PELÍCULAS */}
        <div className="grid grid-cols-3 gap-8">
          {movies.map((src, index) => (
            <div
              key={index}
              className="w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64 bg-gray-600 rounded-lg overflow-hidden shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
            >
              <img
                src={src}
                alt={`Pelicula ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
