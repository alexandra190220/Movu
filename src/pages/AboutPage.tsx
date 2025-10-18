import React from "react";

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#2c2f33] flex flex-col items-center justify-center px-6 py-24 text-gray-200">
      {/* Contenedor principal */}
      <div className="bg-[#3a3d42] rounded-2xl shadow-xl p-10 max-w-3xl w-full">
        {/* Título */}
        <h1 className="text-4xl font-bold text-center text-white mb-6">
          Sobre Nosotros
        </h1>

        {/* Descripción */}
        <p className="text-center text-gray-300 mb-8 leading-relaxed">
          En <span className="text-red-500 font-semibold">MOVU</span> creemos en
          el poder del entretenimiento y la tecnología. Somos un equipo
          apasionado por crear experiencias digitales únicas, ayudando a las
          personas a descubrir, organizar y disfrutar de sus películas favoritas
          con facilidad y estilo.
        </p>

        {/* Sección de equipo */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="bg-[#2c2f33] p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-semibold text-white mb-2">
              Colaboradores:
            </h2>
            <p className="text-gray-400">
              Marco Fidel Castro <br />
              Alexandra Morales <br />
              German Franco <br />
              Brayan Alexander
            </p>
          </div>

          <div className="bg-[#2c2f33] p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-semibold text-white mb-2">
              Equipo MOVU
            </h2>
            <p className="text-gray-400">
              Colaboradores creativos y apasionados por la innovación
              audiovisual
            </p>
          </div>
        </div>

        {/* Footer o mensaje final */}
        <div className="mt-10 text-center text-gray-400 text-sm">
          Nuestra misión es construir una plataforma confiable, moderna y
          accesible para todos los amantes del cine.
        </div>
      </div>
    </div>
  );
};
