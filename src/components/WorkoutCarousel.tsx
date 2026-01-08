import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Flame, X, Timer, Pause, SkipForward, Check } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import ExerciseImage from "./ExerciseImage";
import { useProgress } from "@/hooks/useProgress";
import { loadProgress } from "@/services/progressService";

interface Exercise {
  name: string;
  duration: number; // Always in seconds
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

// Helper to convert reps to seconds (approx 2 seconds per rep)
const repsToSeconds = (reps: number): number => Math.max(30, reps * 2);

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
      { name: "Polichinelo", duration: 30 },
      { name: "Agachamentos livres", duration: 40 },
      { name: "Flexões (ajoelhadas se precisar)", duration: 40 },
      { name: "Corrida no lugar", duration: 30 },
      { name: "Prancha joelhos", duration: 25 },
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
      { name: "Corrida no lugar", duration: 45 },
      { name: "Burpees modificados", duration: 30 },
      { name: "Agachamentos rápidos", duration: 40 },
      { name: "Mountain Climber", duration: 25 },
      { name: "Abdominais reto", duration: 50 },
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
      { name: "Agachamentos sumô", duration: 50 },
      { name: "Pulsos de agacho", duration: 40 },
      { name: "Afundos alternados", duration: 30 },
      { name: "Corrida baixa", duration: 30 },
      { name: "Prancha isométrica", duration: 20 },
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
      { name: "Mountain Climber", duration: 30 },
      { name: "Ab bicycle", duration: 40 },
      { name: "Toques alternados calcanhar", duration: 40 },
      { name: "Leg raises", duration: 30 },
      { name: "Corrida no lugar", duration: 30 },
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
      { name: "Burpees", duration: 20 },
      { name: "Jump Squat", duration: 20 },
      { name: "Mountain Climber", duration: 20 },
      { name: "Prancha dinâmica", duration: 20 },
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
      { name: "Caminhada no lugar", duration: 300 },
      { name: "Alongamento dinâmico + mobilidade", duration: 420 },
      { name: "Respiração diafragmática", duration: 180 },
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
      { name: "Agachamentos com salto", duration: 50 },
      { name: "Afundos alternados", duration: 30 },
      { name: "Levantamentos de joelho rápido", duration: 40 },
      { name: "Burpee suave", duration: 30 },
      { name: "Prancha", duration: 25 },
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
      { name: "Corrida rápida", duration: 40 },
      { name: "Polichinelo", duration: 30 },
      { name: "Mountain Climber", duration: 30 },
      { name: "Flexões", duration: 40 },
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
      { name: "Ab reto", duration: 50 },
      { name: "Ab bicycle", duration: 40 },
      { name: "Prancha alta", duration: 30 },
      { name: "Ab canivete", duration: 30 },
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
      { name: "Burpees", duration: 60 },
      { name: "Jump Squats", duration: 40 },
      { name: "Corrida no lugar", duration: 40 },
      { name: "Prancha dinâmica", duration: 30 },
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
      { name: "Flexões classic", duration: 30 },
      { name: "Tríceps no banco (sofá)", duration: 40 },
      { name: "Prancha com toque ombros", duration: 30 },
      { name: "Flexões diamante", duration: 25 },
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
      { name: "Corrida", duration: 30 },
      { name: "Agachamentos", duration: 40 },
      { name: "Flexões", duration: 40 },
      { name: "Mountain Climber", duration: 25 },
      { name: "Prancha", duration: 25 },
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
      { name: "Burpee", duration: 20 },
      { name: "High Knees (corrida alta)", duration: 20 },
      { name: "Jump Squat", duration: 20 },
      { name: "Prancha dinâmica", duration: 20 },
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
      { name: "Caminhada leve", duration: 300 },
      { name: "Alongamento ativo (costas, pernas, quadril)", duration: 600 },
      { name: "Respiração profunda", duration: 300 },
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
      { name: "Burpee completo", duration: 40 },
      { name: "Jump lunges", duration: 40 },
      { name: "Prancha rotatória", duration: 30 },
      { name: "Corrida no lugar", duration: 30 },
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
      { name: "Agachamentos + flexão (sem pausa)", duration: 40 },
      { name: "Ab com perna elevada", duration: 40 },
      { name: "Flexões", duration: 30 },
      { name: "Prancha alta", duration: 25 },
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
      { name: "Corrida rápida", duration: 45 },
      { name: "Burpees", duration: 30 },
      { name: "Jump Squats", duration: 40 },
      { name: "Mountain Climber", duration: 30 },
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
      { name: "Prancha + polichinelo em pé", duration: 30 },
      { name: "Ab bicicleta", duration: 50 },
      { name: "Corrida curta", duration: 30 },
      { name: "Superman", duration: 40 },
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
      { name: "Burpees", duration: 40 },
      { name: "Flexões", duration: 30 },
      { name: "Agachamentos rápidos", duration: 60 },
      { name: "Prancha", duration: 30 },
      { name: "Corrida no lugar", duration: 60 },
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
      { name: "Burpees", duration: 30 },
      { name: "Jump Squats", duration: 30 },
      { name: "Flexões", duration: 30 },
      { name: "Corrida rápida", duration: 30 },
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
      { name: "Alongamento ativo", duration: 300 },
      { name: "Respiração profunda", duration: 300 },
      { name: "Caminhar ou dançar livremente", duration: 600 },
    ],
  },
];

type WorkoutPhase = "idle" | "exercise" | "transition" | "rest" | "completed";

const TOTAL_WORKOUT_TIME = 20 * 60; // 20 minutes in seconds
const TRANSITION_TIME = 5; // 5 seconds transition

const WorkoutCarousel = () => {
  const { completeWorkout } = useProgress();
  const savedProgress = loadProgress();
  
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>(savedProgress.workouts.completedDays);
  const [unlockedDays, setUnlockedDays] = useState<number[]>(savedProgress.workouts.unlockedDays);
  
  // Circuit mode states
  const [workoutPhase, setWorkoutPhase] = useState<WorkoutPhase>("idle");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [transitionTimer, setTransitionTimer] = useState(TRANSITION_TIME);
  const [restTimer, setRestTimer] = useState(0);
  const [totalWorkoutTimer, setTotalWorkoutTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedExercisesInRound, setCompletedExercisesInRound] = useState<number[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const intensityColors = {
    Leve: "text-mint bg-mint/20",
    Médio: "text-gold bg-gold/20",
    Intenso: "text-coral bg-coral/20",
  };

  const selectedWorkout = workoutDays.find((w) => w.day === expandedDay);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimeShort = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}m${secs}s` : `${mins} min`;
    }
    return `${seconds}s`;
  };

  // Reset all states when closing modal
  const resetWorkout = useCallback(() => {
    setWorkoutPhase("idle");
    setCurrentExerciseIndex(0);
    setCurrentRound(1);
    setExerciseTimer(0);
    setTransitionTimer(TRANSITION_TIME);
    setRestTimer(0);
    setTotalWorkoutTimer(0);
    setIsPaused(false);
    setCompletedExercisesInRound([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const closeModal = () => {
    resetWorkout();
    setExpandedDay(null);
  };

  // Start workout
  const startWorkout = useCallback(() => {
    if (!selectedWorkout) return;
    setWorkoutPhase("transition");
    setTransitionTimer(TRANSITION_TIME);
    setCurrentExerciseIndex(0);
    setCurrentRound(1);
    setTotalWorkoutTimer(0);
    setCompletedExercisesInRound([]);
  }, [selectedWorkout]);

  // Move to next exercise
  const nextExercise = useCallback(() => {
    if (!selectedWorkout) return;
    
    const exerciseCount = selectedWorkout.exercises.length;
    const nextIndex = currentExerciseIndex + 1;
    
    // Mark current as completed
    setCompletedExercisesInRound(prev => [...prev, currentExerciseIndex]);
    
    if (nextIndex >= exerciseCount) {
      // Round complete
      if (currentRound >= selectedWorkout.rounds) {
        // Workout complete
        setWorkoutPhase("completed");
      } else {
        // Go to rest between rounds
        if (selectedWorkout.restBetweenSets > 0) {
          setRestTimer(selectedWorkout.restBetweenSets);
          setWorkoutPhase("rest");
        } else {
          // No rest, start next round
          setCurrentRound(prev => prev + 1);
          setCurrentExerciseIndex(0);
          setCompletedExercisesInRound([]);
          setWorkoutPhase("transition");
          setTransitionTimer(TRANSITION_TIME);
        }
      }
    } else {
      // Next exercise in same round
      setCurrentExerciseIndex(nextIndex);
      setWorkoutPhase("transition");
      setTransitionTimer(TRANSITION_TIME);
    }
  }, [selectedWorkout, currentExerciseIndex, currentRound]);

  // Start next round after rest
  const startNextRound = useCallback(() => {
    setCurrentRound(prev => prev + 1);
    setCurrentExerciseIndex(0);
    setCompletedExercisesInRound([]);
    setWorkoutPhase("transition");
    setTransitionTimer(TRANSITION_TIME);
  }, []);

  // Skip to next exercise
  const skipExercise = useCallback(() => {
    nextExercise();
  }, [nextExercise]);

  // Main timer effect
  useEffect(() => {
    if (isPaused || workoutPhase === "idle" || workoutPhase === "completed") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      // Always increment total workout timer
      setTotalWorkoutTimer(prev => {
        if (prev >= TOTAL_WORKOUT_TIME) {
          setWorkoutPhase("completed");
          return prev;
        }
        return prev + 1;
      });

      if (workoutPhase === "transition") {
        setTransitionTimer(prev => {
          if (prev <= 1) {
            // Start exercise
            if (selectedWorkout) {
              setExerciseTimer(selectedWorkout.exercises[currentExerciseIndex].duration);
              setWorkoutPhase("exercise");
            }
            return TRANSITION_TIME;
          }
          return prev - 1;
        });
      } else if (workoutPhase === "exercise") {
        setExerciseTimer(prev => {
          if (prev <= 1) {
            // Exercise complete, move to next
            nextExercise();
            return 0;
          }
          return prev - 1;
        });
      } else if (workoutPhase === "rest") {
        setRestTimer(prev => {
          if (prev <= 1) {
            // Rest complete, start next round
            startNextRound();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, workoutPhase, selectedWorkout, currentExerciseIndex, nextExercise, startNextRound]);

  const handleCompleteDay = (day: number) => {
    const workout = workoutDays.find(w => w.day === day);
    if (!completedDays.includes(day)) {
      setCompletedDays([...completedDays, day]);
      // Save to progress service
      completeWorkout(day, workout?.calories || 0, totalWorkoutTimer);
      // Unlock next day
      if (day + 1 <= 21 && !unlockedDays.includes(day + 1)) {
        setUnlockedDays([...unlockedDays, day + 1]);
      }
    }
    closeModal();
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Get exercise status
  const getExerciseStatus = (index: number): "completed" | "active" | "next" | "pending" => {
    if (completedExercisesInRound.includes(index)) return "completed";
    if (index === currentExerciseIndex && workoutPhase === "exercise") return "active";
    if (index === currentExerciseIndex && workoutPhase === "transition") return "next";
    if (index === currentExerciseIndex + 1 && workoutPhase === "exercise") return "next";
    return "pending";
  };

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
          const isUnlocked = unlockedDays.includes(workout.day);

          return (
            <motion.div
              key={workout.day}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={isUnlocked ? { scale: 0.95 } : undefined}
              onClick={() => isUnlocked && setExpandedDay(workout.day)}
              className={`
                relative min-w-[140px] rounded-2xl overflow-hidden
                transition-all duration-300 glass-card
                ${!isUnlocked 
                  ? "opacity-50 border-border/30 cursor-not-allowed" 
                  : isCompleted 
                    ? "opacity-70 border-mint/30 cursor-pointer" 
                    : "border-coral/30 hover:border-coral/50 cursor-pointer"}
              `}
            >
              <div className="p-3">
                {/* Day Badge */}
                <div className={`
                  inline-flex items-center justify-center
                  w-8 h-8 rounded-lg mb-2
                  ${!isUnlocked 
                    ? "bg-muted/20 text-muted-foreground" 
                    : isCompleted 
                      ? "bg-mint/20 text-mint" 
                      : "bg-coral/20 text-coral"}
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

                {!isUnlocked && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-muted/30 flex items-center justify-center">
                      <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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

      {/* Fullscreen Workout Modal */}
      <AnimatePresence>
        {expandedDay && selectedWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ background: 'var(--gradient-dark)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-coral font-semibold text-sm">Dia {selectedWorkout.day}</span>
                <span className="text-white/50">•</span>
                <span className="text-white font-medium">{selectedWorkout.title}</span>
              </div>
              <div className="flex items-center gap-3">
                {workoutPhase !== "idle" && (
                  <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
                    <Timer className="w-4 h-4 text-gold" />
                    <span className="text-gold font-mono font-bold">
                      {formatTime(totalWorkoutTimer)} / {formatTime(TOTAL_WORKOUT_TIME)}
                    </span>
                  </div>
                )}
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto pb-20">
              {/* Idle State - Show workout info */}
              {workoutPhase === "idle" && (
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

                  {/* Exercises Preview */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3">Exercícios do Circuito</h3>
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
                            <span className="text-sm text-gold font-semibold">{formatTimeShort(exercise.duration)}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={startWorkout}
                    className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-coral to-[#FF8E53] text-white flex items-center justify-center gap-2 mt-4"
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    Iniciar Treino
                  </button>
                </div>
              )}

              {/* Transition State - Prepare for next exercise */}
              {workoutPhase === "transition" && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                  >
                    <p className="text-white/60 text-lg uppercase tracking-wider">Prepare-se!</p>
                    <motion.div
                      key={transitionTimer}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-8xl font-bold text-gold font-mono"
                    >
                      {transitionTimer}
                    </motion.div>
                    <div className="space-y-2">
                      <p className="text-white/50 text-sm">Próximo:</p>
                      <p className="text-2xl font-bold text-white">
                        {selectedWorkout.exercises[currentExerciseIndex].name}
                      </p>
                      <p className="text-gold text-lg">
                        {formatTimeShort(selectedWorkout.exercises[currentExerciseIndex].duration)}
                      </p>
                    </div>
                    <div className="text-white/40 text-sm">
                      Round {currentRound} de {selectedWorkout.rounds}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Exercise State - Active exercise */}
              {workoutPhase === "exercise" && (
                <div className="p-4 space-y-4">
                  {/* Round indicator */}
                  <div className="text-center">
                    <span className="text-white/60 text-sm">Round {currentRound} de {selectedWorkout.rounds}</span>
                  </div>

                  {/* Exercise list with states */}
                  <div className="space-y-2">
                    {selectedWorkout.exercises.map((exercise, idx) => {
                      const status = getExerciseStatus(idx);
                      const isActive = status === "active";
                      
                      return (
                        <motion.div
                          key={idx}
                          layout
                          animate={status === "next" ? { 
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.01, 1]
                          } : {}}
                          transition={status === "next" ? { 
                            repeat: Infinity, 
                            duration: 1 
                          } : { layout: { duration: 0.3 } }}
                          className={`
                            rounded-xl border transition-all duration-300 overflow-hidden
                            ${status === "completed" ? "bg-white/5 border-white/10 opacity-50" : ""}
                            ${status === "active" ? "bg-mint/15 border-mint/50 shadow-lg shadow-mint/20" : ""}
                            ${status === "next" ? "bg-gold/10 border-gold/30" : ""}
                            ${status === "pending" ? "bg-white/5 border-white/10" : ""}
                          `}
                        >
                          {/* Main exercise row */}
                          <div className="p-4 flex items-center gap-3">
                            <div className={`
                              w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0
                              ${status === "completed" ? "bg-mint/20 text-mint" : ""}
                              ${status === "active" ? "bg-mint text-black" : ""}
                              ${status === "next" ? "bg-gold/20 text-gold" : ""}
                              ${status === "pending" ? "bg-white/10 text-white/50" : ""}
                            `}>
                              {status === "completed" ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium truncate ${status === "active" ? "text-mint text-lg" : status === "completed" ? "text-white/50" : "text-white"}`}>
                                {exercise.name}
                              </p>
                              {status === "active" && (
                                <p className="text-mint/70 text-sm">Em execução</p>
                              )}
                              {status === "next" && (
                                <p className="text-gold/70 text-sm">Próximo</p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              {status === "active" ? (
                                <motion.span 
                                  key={exerciseTimer}
                                  initial={{ scale: 1.1 }}
                                  animate={{ scale: 1 }}
                                  className="text-2xl font-bold text-mint font-mono"
                                >
                                  {formatTime(exerciseTimer)}
                                </motion.span>
                              ) : (
                                <span className={`text-sm font-semibold ${status === "completed" ? "text-white/30" : "text-gold"}`}>
                                  {formatTimeShort(exercise.duration)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Expandable image and instructions section */}
                          <div className="px-4">
                            <ExerciseImage 
                              exerciseName={exercise.name}
                              isExpanded={isActive}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={togglePause}
                      className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                        isPaused 
                          ? "bg-mint/20 text-mint" 
                          : "bg-gold/20 text-gold"
                      }`}
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-5 h-5" fill="currentColor" />
                          Continuar
                        </>
                      ) : (
                        <>
                          <Pause className="w-5 h-5" />
                          Pausar
                        </>
                      )}
                    </button>
                    <button
                      onClick={skipExercise}
                      className="px-6 py-3 rounded-xl font-semibold bg-white/10 text-white flex items-center justify-center gap-2"
                    >
                      <SkipForward className="w-5 h-5" />
                      Pular
                    </button>
                  </div>
                </div>
              )}

              {/* Rest State - Between rounds */}
              {workoutPhase === "rest" && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-mint/20 flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-mint" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">Round {currentRound} Concluído!</p>
                      <p className="text-white/60 mt-2">Descanse e prepare-se para o próximo</p>
                    </div>
                    <div className="py-8">
                      <p className="text-white/40 text-sm mb-2">DESCANSO</p>
                      <motion.div
                        key={restTimer}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-7xl font-bold text-mint font-mono"
                      >
                        {formatTime(restTimer)}
                      </motion.div>
                    </div>
                    <p className="text-white/40">
                      Próximo: Round {currentRound + 1} de {selectedWorkout.rounds}
                    </p>
                    
                    {/* Pause control */}
                    <button
                      onClick={togglePause}
                      className={`px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto ${
                        isPaused 
                          ? "bg-mint/20 text-mint" 
                          : "bg-gold/20 text-gold"
                      }`}
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-5 h-5" fill="currentColor" />
                          Continuar
                        </>
                      ) : (
                        <>
                          <Pause className="w-5 h-5" />
                          Pausar
                        </>
                      )}
                    </button>
                  </motion.div>
                </div>
              )}

              {/* Completed State */}
              {workoutPhase === "completed" && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-mint to-mint/50 flex items-center justify-center mx-auto"
                    >
                      <Check className="w-12 h-12 text-black" />
                    </motion.div>
                    <div>
                      <p className="text-3xl font-bold text-white">Treino Concluído!</p>
                      <p className="text-white/60 mt-2">Parabéns pelo esforço!</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-2xl font-bold text-gold">{formatTime(totalWorkoutTimer)}</p>
                        <p className="text-white/50 text-xs">Tempo Total</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-2xl font-bold text-coral">{selectedWorkout.calories}</p>
                        <p className="text-white/50 text-xs">kcal Queimadas</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCompleteDay(selectedWorkout.day)}
                      className="w-full max-w-xs py-4 rounded-xl font-semibold bg-gradient-to-r from-mint to-[#4ADE80] text-black flex items-center justify-center gap-2 mx-auto mt-4"
                    >
                      <Check className="w-5 h-5" />
                      Marcar como Concluído
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutCarousel;
