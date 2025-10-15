import React from "react";

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
      {/* NAVBAR */}
      <nav className="absolute top-2 left-0 w-full flex justify-between items-center px-8 py-">
        {/* SOLO LOGO */}
        <img
          src="/logo.png"
          alt="Movu Logo"
          className="h-18 w-auto md:h-30 object-contain drop-shadow-lg"
        />

        <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded text-sm md:text-base transition">
          Iniciar sesión
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex flex-col items-center justify-center text-center flex-grow mt-40 px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          Las mejores <br /> Películas están aquí
        </h2>

        <p className="text-gray-300 text-sm mb-12">
          ¿No tienes cuenta?{" "}
          <a href="#" className="text-red-500 hover:underline">
            Regístrate aquí
          </a>
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
