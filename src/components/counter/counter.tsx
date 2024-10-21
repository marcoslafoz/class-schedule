import React, { useEffect, useState } from 'react';
import horarios from '../../assets/json/horario.json'; // Importa el JSON con los horarios

interface Horario {
  horaInicio: string;
  horaFin: string;
  asignatura: string;
}

export const Counter: React.FC = () => {
  const [asignaturaActual, setAsignaturaActual] = useState<string | null>(null);
  const [tiempoRestante, setTiempoRestante] = useState<string | null>(null);

  // Función para obtener el día de la semana en español
  const obtenerDiaSemana = (): string => {
    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const fechaActual = new Date();
    return diasSemana[fechaActual.getDay()];
  };

  // Función para convertir una hora en formato HH:MM a un objeto Date
  const convertirHora = (hora: string): Date => {
    const [horas, minutos] = hora.split(":").map(Number);
    const ahora = new Date();
    ahora.setHours(horas, minutos, 0, 0);
    return ahora;
  };

  // Función que verifica la clase actual
  const verificarAsignaturaActual = () => {
    const diaActual = obtenerDiaSemana();
    const horarioHoy = (horarios as Record<string, Horario[]>)[diaActual];

    if (!horarioHoy) {
      setAsignaturaActual("No hay clases hoy");
      setTiempoRestante(null);
      return;
    }

    const ahora = new Date();

    for (const clase of horarioHoy) {
      const horaInicio = convertirHora(clase.horaInicio);
      const horaFin = convertirHora(clase.horaFin);

      if (ahora >= horaInicio && ahora <= horaFin) {
        setAsignaturaActual(clase.asignatura);

        // Calcula cuánto tiempo queda para que termine la clase
        const diferencia = horaFin.getTime() - ahora.getTime();
        const minutosRestantes = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const horasRestantes = Math.floor(diferencia / (1000 * 60 * 60));
        setTiempoRestante(`${horasRestantes} horas y ${minutosRestantes} minutos`);
        return;
      }
    }

    setAsignaturaActual("");
    setTiempoRestante(null);
  };

  useEffect(() => {
    verificarAsignaturaActual(); // Verificar al montar el componente

    // Intervalo para actualizar cada segundo
    const intervalo = setInterval(() => {
      verificarAsignaturaActual();
    }, 1000); // Actualizar cada segundo

    return () => clearInterval(intervalo); // Limpiar el intervalo al desmontar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 text-white text-opacity-50 mt-3 text text-center">
      {asignaturaActual ? (
        <>
          {tiempoRestante && (
            <p className="text-lg ">Tiempo restante de {asignaturaActual}: {tiempoRestante}</p>
          )}
        </>
      ) : (
        <p className="text-lg"></p>
      )}
    </div>
  );
};

export default Counter;
