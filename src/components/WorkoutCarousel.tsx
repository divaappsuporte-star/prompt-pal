import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Flame, X, Timer, Pause, RotateCcw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Exercise {
  name: string;
  reps?: string;
  duration?: string;
}

interface WorkoutDay {
  day: number;
  title: string;
  objective: string;
  duration: string;
  calories: number;
  intensity: "Leve" | "Médio" | "Intenso";
  completed: boolean;
  exercises: Exercise[];
  rounds: number;
  restBetweenSets: number;
  tips?: string;
}

const workoutDays: WorkoutDay[] = [
  {
    day: 1,
    title: "Ativação Metabólica",
    objective: "Preparar o corpo para treinos intensos",
    duration: "20 min",
    calories: 180,
    intensity: "Leve",
    completed: false,
    rounds: 3,
    restBetweenSets: 30,
    exercises: [
      { name: "Polichinelo", duration: "30s" },
      { name: "Agachamentos livres", reps: "20" },
      { name: "Flexões (ajoelhadas se precisar)", reps: "20" },
      { name: "Corrida no lugar", duration: "30s" },
      { name: "Prancha joelhos", duration: "25s" },
    ],
  },
  {
    day: 2,
    title: "Cardio Funcional",
    objective: "Elevar frequência cardíaca",
    duration: "25 min",
    calories: 220,
    intensity: "Médio",
    completed: false,
    rounds: 3,
    restBetweenSets: 20,
    exercises: [
      { name: "Corrida no lugar", duration: "45s" },
      { name: "Burpees modificados", reps: "15" },
      { name: "Agachamentos rápidos", reps: "20" },
      { name: "Mountain Climber", duration: "25s" },
      { name: "Abdominais reto", reps: "25" },
    ],
  },
  {
    day: 3,
    title: "Resistência Inferior",
    objective: "Fortalecer pernas e glúteos",
    duration: "25 min",
    calories: 200,
    intensity: "Médio",
    completed: false,
    rounds: 3,
    restBetweenSets: 25,
    exercises: [
      { name: "Agachamentos sumô", reps: "25" },
      { name: "Pulsos de agacho", reps: "20" },
      { name: "Afundos (por perna)", reps: "15" },
      { name: "Corrida baixa", duration: "30s" },
      { name: "Prancha isométrica", duration: "20s" },
    ],
  },
  {
    day: 4,
    title: "Core e Cardio",
    objective: "Fortalecer abdômen com cardio",
    duration: "22 min",
    calories: 210,
    intensity: "Médio",
    completed: false,
    rounds: 3,
    restBetweenSets: 25,
    exercises: [
      { name: "Mountain Climber", duration: "30s" },
      { name: "Ab bicycle", reps: "20" },
      { name: "Toques alternados calcanhar", reps: "20" },
      { name: "Leg raises", reps: "15" },
      { name: "Corrida no lugar", duration: "30s" },
    ],
  },
  {
    day: 5,
    title: "HIIT Tabata 1",
    objective: "Máxima queima em pouco tempo",
    duration: "20 min",
    calories: 280,
    intensity: "Intenso",
    completed: false,
    rounds: 8,
    restBetweenSets: 10,
    tips: "20s trabalho / 10s descanso",
    exercises: [
      { name: "Burpees", duration: "20s" },
      { name: "Jump Squat", duration: "20s" },
      { name: "Mountain Climber", duration: "20s" },
      { name: "Prancha dinâmica", duration: "20s" },
    ],
  },
  {
    day: 6,
    title: "Recuperação Ativa",
    objective: "Regenerar músculos e relaxar",
    duration: "15 min",
    calories: 80,
    intensity: "Leve",
    completed: false,
    rounds: 1,
    restBetweenSets: 0,
    exercises: [
      { name: "Caminhada no lugar", duration: "5 min" },
      { name: "Alongamento dinâmico + mobilidade", duration: "7 min" },
      { name: "Respiração diafragmática", duration: "3 min" },
    ],
  },
  {
    day: 7,
    title: "Power Inferior",
    objective: "Explosão muscular nas pernas",
    duration: "25 min",
    calories: 250,
    intensity: "Intenso",
    completed: false,
    rounds: 3,
    restBetweenSets: 30,
    exercises: [
      { name: "Agachamentos com salto", reps: "25" },
      { name: "Afundos alternados", reps: "15" },
      { name: "Levantamentos de joelho rápido", reps: "20" },
      { name: "Burpee suave", duration: "30s" },
      { name: "Prancha", duration: "25s" },
    ],
  },
  {
    day: 8,
    title: "HIIT Cardio Full",
    objective: "Alta intensidade cardiovascular",
    duration: "25 min",
    calories: 300,
    intensity: "Intenso",
    completed: false,
    rounds: 4,
    restBetweenSets: 20,
    exercises: [
      { name: "Corrida rápida", duration: "40s" },
      { name: "Polichinelo", duration: "30s" },
      { name: "Mountain Climber", duration: "30s" },
      { name: "Flexões", reps: "20" },
    ],
  },
  {
    day: 9,
    title: "Core Blast",
    objective: "Abdômen definido",
    duration: "20 min",
    calories: 180,
    intensity: "Médio",
    completed: false,
    rounds: 3,
    restBetweenSets: 20,
    exercises: [
      { name: "Ab reto", reps: "25" },
      { name: "Ab bicycle", reps: "20" },
      { name: "Prancha alta", duration: "30s" },
      { name: "Ab canivete", reps: "15" },
    ],
  },
  {
    day: 10,
    title: "HIIT Explosão",
    objective: "Queima máxima de calorias",
    duration: "25 min",
    calories: 320,
    intensity: "Intenso",
    completed: false,
    rounds: 4,
    restBetweenSets: 30,
    exercises: [
      { name: "Burpees", reps: "30" },
      { name: "Jump Squats", reps: "20" },
      { name: "Corrida no lugar", duration: "40s" },
      { name: "Prancha dinâmica", duration: "30s" },
    ],
  },
  {
    day: 11,
    title: "Força Superiores",
    objective: "Braços e peito fortes",
    duration: "22 min",
    calories: 200,
    intensity: "Médio",
    completed: false,
    rounds: 3,
    restBetweenSets: 30,
    exercises: [
      { name: "Flexões classic", reps: "15" },
      { name: "Tríceps no banco (sofá)", reps: "20" },
      { name: "Prancha com toque ombros", duration: "30s" },
      { name: "Flexões diamante", reps: "12" },
    ],
  },
  {
    day: 12,
    title: "Circuito Funcional",
    objective: "Trabalho completo do corpo",
    duration: "25 min",
    calories: 260,
    intensity: "Médio",
    completed: false,
    rounds: 3,
    restBetweenSets: 25,
    exercises: [
      { name: "Corrida", duration: "30s" },
      { name: "Agachamentos", reps: "20" },
      { name: "Flexões", reps: "20" },
      { name: "Mountain Climber", duration: "25s" },
      { name: "Prancha", duration: "25s" },
    ],
  },
  {
    day: 13,
    title: "Tabata Cardio 2",
    objective: "Resistência cardiovascular",
    duration: "20 min",
    calories: 290,
    intensity: "Intenso",
    completed: false,
    rounds: 8,
    restBetweenSets: 10,
    tips: "20s on / 10s off × 8",
    exercises: [
      { name: "Burpee", duration: "20s" },
      { name: "High Knees (corrida alta)", duration: "20s" },
      { name: "Jump Squat", duration: "20s" },
      { name: "Prancha dinâmica", duration: "20s" },
    ],
  },
  {
    day: 14,
    title: "Mobilidade e Alongamento",
    objective: "Recuperação e flexibilidade",
    duration: "20 min",
    calories: 60,
    intensity: "Leve",
    completed: false,
    rounds: 1,
    restBetweenSets: 0,
    exercises: [
      { name: "Caminhada leve", duration: "5 min" },
      { name: "Alongamento ativo (costas, pernas, quadril)", duration: "10 min" },
      { name: "Respiração profunda", duration: "5 min" },
    ],
  },
  {
    day: 15,
    title: "HIIT Avançado 1",
    objective: "Desafio de alta performance",
    duration: "25 min",
    calories: 340,
    intensity: "Intenso",
    completed: false,
    rounds: 4,
    restBetweenSets: 25,
    exercises: [
      { name: "Burpee completo", duration: "40s" },
      { name: "Jump lunges", reps: "20" },
      { name: "Prancha rotatória", duration: "30s" },
      { name: "Corrida no lugar", duration: "30s" },
    ],
  },
  {
    day: 16,
    title: "Força Global",
    objective: "Força total do corpo",
    duration: "25 min",
    calories: 270,
    intensity: "Médio",
    completed: false,
    rounds: 3,
    restBetweenSets: 30,
    exercises: [
      { name: "Agachamentos + flexão (sem pausa)", reps: "20" },
      { name: "Ab com perna elevada", reps: "20" },
      { name: "Flexões", reps: "15" },
      { name: "Prancha alta", duration: "25s" },
    ],
  },
  {
    day: 17,
    title: "Cardio Máximo",
    objective: "Elevação máxima da FC",
    duration: "22 min",
    calories: 310,
    intensity: "Intenso",
    completed: false,
    rounds: 3,
    restBetweenSets: 20,
    exercises: [
      { name: "Corrida rápida", duration: "45s" },
      { name: "Burpees", reps: "15" },
      { name: "Jump Squats", reps: "20" },
      { name: "Mountain Climber", duration: "30s" },
    ],
  },
  {
    day: 18,
    title: "Core + Cardio Combinado",
    objective: "Abdômen e resistência",
    duration: "22 min",
    calories: 240,
    intensity: "Médio",
    completed: false,
    rounds: 3,
    restBetweenSets: 25,
    exercises: [
      { name: "Prancha + polichinelo em pé", duration: "30s" },
      { name: "Ab bicicleta", reps: "25" },
      { name: "Corrida curta", duration: "30s" },
      { name: "Superman", reps: "20" },
    ],
  },
  {
    day: 19,
    title: "HIIT Full Body",
    objective: "Treino completo intenso",
    duration: "25 min",
    calories: 330,
    intensity: "Intenso",
    completed: false,
    rounds: 3,
    restBetweenSets: 30,
    exercises: [
      { name: "Burpees", reps: "20" },
      { name: "Flexões", reps: "15" },
      { name: "Agachamentos rápidos", reps: "30" },
      { name: "Prancha", duration: "30s" },
      { name: "Corrida no lugar", duration: "60s" },
    ],
  },
  {
    day: 20,
    title: "Alta Performance Final",
    objective: "Teste de resistência máxima",
    duration: "30 min",
    calories: 380,
    intensity: "Intenso",
    completed: false,
    rounds: 3,
    restBetweenSets: 60,
    tips: "4 blocos de 30s cada",
    exercises: [
      { name: "Burpees", duration: "30s" },
      { name: "Jump Squats", duration: "30s" },
      { name: "Flexões", duration: "30s" },
      { name: "Corrida rápida", duration: "30s" },
    ],
  },
  {
    day: 21,
    title: "Reset Metabólico",
    objective: "Recuperação e consolidação",
    duration: "20 min",
    calories: 80,
    intensity: "Leve",
    completed: false,
    rounds: 1,
    restBetweenSets: 0,
    tips: "Estimular drenagem natural e consolidar resultado",
    exercises: [
      { name: "Alongamento ativo", duration: "5 min" },
      { name: "Respiração profunda", duration: "5 min" },
      { name: "Caminhar ou dançar livremente", duration: "10 min" },
    ],
  },
];

const WorkoutCarousel = () => {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [restTimer, setRestTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentRestTime, setCurrentRestTime] = useState(30);

  const intensityColors = {
    Leve: "text-mint bg-mint/20",
    Médio: "text-gold bg-gold/20",
    Intenso: "text-coral bg-coral/20",
  };

  const startRestTimer = useCallback((seconds: number) => {
    setCurrentRestTime(seconds);
    setRestTimer(seconds);
    setIsTimerRunning(true);
  }, []);

  const pauseTimer = () => setIsTimerRunning(false);
  const resumeTimer = () => setIsTimerRunning(true);
  const resetTimer = () => {
    setRestTimer(currentRestTime);
    setIsTimerRunning(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => prev - 1);
      }, 1000);
    } else if (restTimer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCompleteDay = (day: number) => {
    if (!completedDays.includes(day)) {
      setCompletedDays([...completedDays, day]);
    }
    setExpandedDay(null);
  };

  const selectedWorkout = workoutDays.find((w) => w.day === expandedDay);

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="font-display text-xl font-bold text-foreground">
          Treinos da Semana
        </h2>
        <span className="text-sm text-muted-foreground">
          {completedDays.length}/21 completos
        </span>
      </div>

      {/* Horizontal scroll without visible scrollbar */}
      <div 
        className="flex gap-3 px-4 overflow-x-auto pb-2"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style>{`.workout-scroll::-webkit-scrollbar { display: none; }`}</style>
        {workoutDays.map((workout) => {
          const isCompleted = completedDays.includes(workout.day);

          return (
            <motion.div
              key={workout.day}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setExpandedDay(workout.day)}
              className={`
                relative min-w-[140px] rounded-2xl overflow-hidden cursor-pointer
                transition-all duration-300 border border-border/50
                ${isCompleted ? "opacity-70 bg-mint/5" : "bg-card"}
              `}
            >
              <div className="p-3">
                {/* Day Badge */}
                <div className={`
                  inline-flex items-center justify-center
                  w-8 h-8 rounded-lg mb-2
                  ${isCompleted ? "bg-mint/20 text-mint" : "bg-coral/20 text-coral"}
                  font-display font-bold text-sm
                `}>
                  {workout.day}
                </div>

                {isCompleted && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center">
                      <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <h3 className="font-display font-semibold text-foreground mb-1 text-xs line-clamp-2">
                  {workout.title}
                </h3>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>{workout.duration}</span>
                  </div>
                </div>

                <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block ${intensityColors[workout.intensity]}`}>
                  {workout.intensity}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded Workout Modal */}
      <AnimatePresence>
        {expandedDay && selectedWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setExpandedDay(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#1A1A1A] rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#1A1A1A] p-4 border-b border-white/10 flex justify-between items-center z-10">
                <div>
                  <span className="text-coral font-medium text-sm">Dia {selectedWorkout.day}</span>
                  <h2 className="text-lg font-bold text-white">{selectedWorkout.title}</h2>
                </div>
                <button 
                  onClick={() => setExpandedDay(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Workout Info */}
                <div className="flex gap-3">
                  <div className="flex-1 bg-white/5 rounded-xl p-3 text-center border border-white/10">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-gold" />
                    <div className="text-sm font-bold text-white">{selectedWorkout.duration}</div>
                    <div className="text-[10px] text-white/50">Duração</div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl p-3 text-center border border-white/10">
                    <Flame className="w-5 h-5 mx-auto mb-1 text-coral" />
                    <div className="text-sm font-bold text-white">{selectedWorkout.calories}</div>
                    <div className="text-[10px] text-white/50">kcal</div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl p-3 text-center border border-white/10">
                    <Timer className="w-5 h-5 mx-auto mb-1 text-mint" />
                    <div className="text-sm font-bold text-white">{selectedWorkout.rounds}x</div>
                    <div className="text-[10px] text-white/50">Rodadas</div>
                  </div>
                </div>

                {/* Objective */}
                <div className="bg-coral/10 rounded-xl p-3 border border-coral/20">
                  <p className="text-sm text-coral font-medium">🎯 {selectedWorkout.objective}</p>
                </div>

                {/* Tips */}
                {selectedWorkout.tips && (
                  <div className="bg-gold/10 rounded-xl p-3 border border-gold/20">
                    <p className="text-sm text-gold">💡 {selectedWorkout.tips}</p>
                  </div>
                )}

                {/* Rest Timer */}
                {selectedWorkout.restBetweenSets > 0 && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Timer className="w-4 h-4 text-mint" />
                      Cronômetro de Descanso
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-4xl font-bold text-mint font-mono">
                        {formatTime(restTimer)}
                      </div>
                    </div>
                    <div className="flex justify-center gap-3 mt-3">
                      {!isTimerRunning ? (
                        <button
                          onClick={() => restTimer > 0 ? resumeTimer() : startRestTimer(selectedWorkout.restBetweenSets)}
                          className="px-4 py-2 bg-mint/20 text-mint rounded-lg flex items-center gap-2 text-sm font-medium"
                        >
                          <Play className="w-4 h-4" fill="currentColor" />
                          {restTimer > 0 ? "Continuar" : `Iniciar ${selectedWorkout.restBetweenSets}s`}
                        </button>
                      ) : (
                        <button
                          onClick={pauseTimer}
                          className="px-4 py-2 bg-gold/20 text-gold rounded-lg flex items-center gap-2 text-sm font-medium"
                        >
                          <Pause className="w-4 h-4" />
                          Pausar
                        </button>
                      )}
                      <button
                        onClick={resetTimer}
                        className="px-4 py-2 bg-white/10 text-white/70 rounded-lg flex items-center gap-2 text-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                  </div>
                )}

                {/* Exercises List */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Exercícios</h3>
                  <div className="space-y-2">
                    {selectedWorkout.exercises.map((exercise, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-coral/20 flex items-center justify-center text-coral font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{exercise.name}</p>
                        </div>
                        <div className="text-right">
                          {exercise.reps && (
                            <span className="text-sm text-coral font-semibold">{exercise.reps}x</span>
                          )}
                          {exercise.duration && (
                            <span className="text-sm text-gold font-semibold">{exercise.duration}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Complete Button */}
                <button
                  onClick={() => handleCompleteDay(selectedWorkout.day)}
                  disabled={completedDays.includes(selectedWorkout.day)}
                  className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    completedDays.includes(selectedWorkout.day)
                      ? "bg-white/10 text-white/50"
                      : "bg-gradient-to-r from-coral to-[#FF8E53] text-white"
                  }`}
                >
                  {completedDays.includes(selectedWorkout.day) ? (
                    "Treino Concluído ✓"
                  ) : (
                    <>
                      <Play className="w-5 h-5" fill="currentColor" />
                      Concluir Treino
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutCarousel;
