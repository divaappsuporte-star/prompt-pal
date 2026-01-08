export interface ExerciseInfo {
  name: string;
  description: string;
  imageUrl: string;
  instructions: string[];
  muscleGroups: string[];
}

// Map exercise names (including variations) to their base exercise info
export const exerciseDatabase: Record<string, ExerciseInfo> = {
  // CARDIO
  "Polichinelo": {
    name: "Polichinelo",
    description: "Jumping jacks - cardio que aquece todo o corpo",
    imageUrl: "/exercises/polichinelo.png",
    instructions: [
      "Pés juntos, braços ao lado do corpo",
      "Salte abrindo pernas e braços simultaneamente",
      "Braços sobem acima da cabeça",
      "Volte à posição inicial saltando"
    ],
    muscleGroups: ["Cardio", "Pernas", "Ombros"]
  },
  "Corrida no lugar": {
    name: "Corrida no lugar",
    description: "Corrida estacionária para elevar a frequência cardíaca",
    imageUrl: "/exercises/corrida-no-lugar.png",
    instructions: [
      "Fique em pé, com postura ereta",
      "Eleve os joelhos alternadamente",
      "Braços acompanham o movimento natural",
      "Mantenha ritmo constante"
    ],
    muscleGroups: ["Cardio", "Pernas", "Core"]
  },
  "Corrida rápida": {
    name: "Corrida rápida",
    description: "Corrida intensa no lugar para máxima queima",
    imageUrl: "/exercises/corrida-no-lugar.png",
    instructions: [
      "Postura ereta, core ativado",
      "Eleve joelhos o mais alto possível",
      "Acelere o ritmo ao máximo",
      "Braços acompanham vigorosamente"
    ],
    muscleGroups: ["Cardio", "Pernas", "Core"]
  },
  "Corrida baixa": {
    name: "Corrida baixa",
    description: "Corrida com joelhos baixos para resistência",
    imageUrl: "/exercises/corrida-no-lugar.png",
    instructions: [
      "Postura levemente inclinada",
      "Passos rápidos e curtos",
      "Joelhos não precisam subir muito",
      "Foco na velocidade dos pés"
    ],
    muscleGroups: ["Cardio", "Pernas"]
  },
  "Corrida": {
    name: "Corrida",
    description: "Corrida no lugar moderada",
    imageUrl: "/exercises/corrida-no-lugar.png",
    instructions: [
      "Postura ereta natural",
      "Eleve os joelhos moderadamente",
      "Ritmo constante e controlado",
      "Respire de forma ritmada"
    ],
    muscleGroups: ["Cardio", "Pernas"]
  },
  "Corrida curta": {
    name: "Corrida curta",
    description: "Sprint curto no lugar",
    imageUrl: "/exercises/corrida-no-lugar.png",
    instructions: [
      "Posição de corrida",
      "Explosão máxima por curto período",
      "Joelhos altos, braços ativos",
      "Intensidade total"
    ],
    muscleGroups: ["Cardio", "Pernas"]
  },
  "High Knees (corrida alta)": {
    name: "High Knees",
    description: "Corrida com joelhos altos - cardio intenso",
    imageUrl: "/exercises/high-knees.png",
    instructions: [
      "Fique em pé, core ativado",
      "Eleve o joelho até a altura do quadril",
      "Alterne rapidamente as pernas",
      "Braços acompanham o movimento"
    ],
    muscleGroups: ["Cardio", "Core", "Pernas"]
  },
  "Levantamentos de joelho rápido": {
    name: "High Knees",
    description: "Elevação rápida de joelhos",
    imageUrl: "/exercises/high-knees.png",
    instructions: [
      "Posição ereta, abdômen contraído",
      "Eleve joelhos alternadamente até o quadril",
      "Mantenha ritmo acelerado",
      "Use os braços para impulso"
    ],
    muscleGroups: ["Cardio", "Core", "Pernas"]
  },
  "Caminhada no lugar": {
    name: "Caminhada no lugar",
    description: "Movimento leve para recuperação ativa",
    imageUrl: "/exercises/caminhada.png",
    instructions: [
      "Caminhe naturalmente no lugar",
      "Movimentos suaves e controlados",
      "Respire profundamente",
      "Relaxe os músculos gradualmente"
    ],
    muscleGroups: ["Cardio leve", "Recuperação"]
  },
  "Caminhada leve": {
    name: "Caminhada leve",
    description: "Caminhada suave para aquecimento ou recuperação",
    imageUrl: "/exercises/caminhada.png",
    instructions: [
      "Passos leves e naturais",
      "Postura relaxada",
      "Respire profundamente",
      "Mantenha ritmo tranquilo"
    ],
    muscleGroups: ["Cardio leve", "Recuperação"]
  },
  "Caminhar ou dançar livremente": {
    name: "Movimento Livre",
    description: "Movimento livre para relaxar e celebrar",
    imageUrl: "/exercises/caminhada.png",
    instructions: [
      "Mova-se como preferir",
      "Pode caminhar, dançar ou se alongar",
      "Aproveite o momento",
      "Relaxe corpo e mente"
    ],
    muscleGroups: ["Recuperação", "Bem-estar"]
  },

  // AGACHAMENTOS
  "Agachamentos livres": {
    name: "Agachamento",
    description: "Agachamento básico para pernas e glúteos",
    imageUrl: "/exercises/agachamento.png",
    instructions: [
      "Pés na largura dos ombros",
      "Desça flexionando joelhos e quadril",
      "Mantenha o peito erguido",
      "Joelhos alinhados com os pés"
    ],
    muscleGroups: ["Pernas", "Glúteos", "Core"]
  },
  "Agachamentos": {
    name: "Agachamento",
    description: "Agachamento clássico",
    imageUrl: "/exercises/agachamento.png",
    instructions: [
      "Pés na largura dos ombros",
      "Desça até coxas paralelas ao chão",
      "Peso nos calcanhares",
      "Suba contraindo glúteos"
    ],
    muscleGroups: ["Pernas", "Glúteos", "Core"]
  },
  "Agachamentos rápidos": {
    name: "Agachamento Rápido",
    description: "Agachamentos em velocidade para cardio",
    imageUrl: "/exercises/agachamento.png",
    instructions: [
      "Posição de agachamento padrão",
      "Execute movimentos rápidos e controlados",
      "Não perca a forma mesmo na velocidade",
      "Mantenha core ativado"
    ],
    muscleGroups: ["Pernas", "Glúteos", "Cardio"]
  },
  "Agachamentos sumô": {
    name: "Agachamento Sumô",
    description: "Agachamento com pernas afastadas para interno das coxas",
    imageUrl: "/exercises/agachamento-sumo.png",
    instructions: [
      "Pés bem afastados, pontas para fora",
      "Desça mantendo joelhos apontando para os pés",
      "Costas retas, peito aberto",
      "Suba apertando glúteos e interno das coxas"
    ],
    muscleGroups: ["Interno coxas", "Glúteos", "Pernas"]
  },
  "Pulsos de agacho": {
    name: "Pulsos de Agachamento",
    description: "Micro movimentos em agachamento para queimar",
    imageUrl: "/exercises/agachamento-pulso.png",
    instructions: [
      "Fique na posição de agachamento",
      "Faça pequenos pulsos subindo e descendo",
      "Não suba completamente",
      "Mantenha tensão constante nos músculos"
    ],
    muscleGroups: ["Pernas", "Glúteos"]
  },
  "Agachamentos com salto": {
    name: "Jump Squat",
    description: "Agachamento explosivo com salto",
    imageUrl: "/exercises/jump-squat.png",
    instructions: [
      "Agache normalmente",
      "Exploda para cima em um salto",
      "Aterrisse suavemente voltando ao agachamento",
      "Use os braços para impulso"
    ],
    muscleGroups: ["Pernas", "Glúteos", "Cardio"]
  },
  "Jump Squat": {
    name: "Jump Squat",
    description: "Agachamento com salto explosivo",
    imageUrl: "/exercises/jump-squat.png",
    instructions: [
      "Posição de agachamento",
      "Salte o mais alto possível",
      "Aterrisse com controle",
      "Mantenha joelhos alinhados"
    ],
    muscleGroups: ["Pernas", "Glúteos", "Explosão"]
  },
  "Jump Squats": {
    name: "Jump Squat",
    description: "Agachamento com salto explosivo",
    imageUrl: "/exercises/jump-squat.png",
    instructions: [
      "Posição de agachamento",
      "Salte o mais alto possível",
      "Aterrisse com controle",
      "Mantenha joelhos alinhados"
    ],
    muscleGroups: ["Pernas", "Glúteos", "Explosão"]
  },
  "Agachamentos + flexão (sem pausa)": {
    name: "Squat to Push-up",
    description: "Combinação de agachamento e flexão sem parar",
    imageUrl: "/exercises/squat-pushup.png",
    instructions: [
      "Faça um agachamento completo",
      "Coloque as mãos no chão",
      "Pule para posição de prancha",
      "Faça uma flexão e volte ao agachamento"
    ],
    muscleGroups: ["Full Body", "Pernas", "Peito"]
  },

  // FLEXÕES
  "Flexões": {
    name: "Flexão",
    description: "Flexão de braços clássica",
    imageUrl: "/exercises/flexao.png",
    instructions: [
      "Mãos na largura dos ombros",
      "Corpo reto da cabeça aos pés",
      "Desça até o peito quase tocar o chão",
      "Suba estendendo os braços"
    ],
    muscleGroups: ["Peito", "Tríceps", "Ombros"]
  },
  "Flexões (ajoelhadas se precisar)": {
    name: "Flexão",
    description: "Flexão com opção de joelhos apoiados",
    imageUrl: "/exercises/flexao.png",
    instructions: [
      "Pode apoiar joelhos se necessário",
      "Mãos na largura dos ombros",
      "Desça controladamente",
      "Mantenha core ativado"
    ],
    muscleGroups: ["Peito", "Tríceps", "Ombros"]
  },
  "Flexões classic": {
    name: "Flexão Clássica",
    description: "Flexão de braços tradicional",
    imageUrl: "/exercises/flexao.png",
    instructions: [
      "Posição de prancha alta",
      "Mãos na largura dos ombros",
      "Cotovelos a 45 graus do corpo",
      "Desça e suba com controle"
    ],
    muscleGroups: ["Peito", "Tríceps", "Ombros"]
  },
  "Flexões diamante": {
    name: "Flexão Diamante",
    description: "Flexão com mãos juntas para tríceps",
    imageUrl: "/exercises/flexao-diamante.png",
    instructions: [
      "Mãos juntas formando um diamante",
      "Polegares e indicadores se tocam",
      "Cotovelos próximos ao corpo",
      "Foco no tríceps ao subir"
    ],
    muscleGroups: ["Tríceps", "Peito", "Core"]
  },

  // PRANCHA
  "Prancha joelhos": {
    name: "Prancha nos Joelhos",
    description: "Prancha modificada para iniciantes",
    imageUrl: "/exercises/prancha-joelhos.png",
    instructions: [
      "Apoie antebraços e joelhos no chão",
      "Mantenha corpo reto dos joelhos à cabeça",
      "Core bem contraído",
      "Não deixe o quadril subir ou descer"
    ],
    muscleGroups: ["Core", "Ombros"]
  },
  "Prancha isométrica": {
    name: "Prancha Isométrica",
    description: "Prancha estática para resistência do core",
    imageUrl: "/exercises/prancha.png",
    instructions: [
      "Apoie antebraços e pontas dos pés",
      "Corpo formando linha reta",
      "Contraia abdômen e glúteos",
      "Mantenha a posição sem mexer"
    ],
    muscleGroups: ["Core", "Ombros", "Glúteos"]
  },
  "Prancha": {
    name: "Prancha",
    description: "Prancha isométrica clássica",
    imageUrl: "/exercises/prancha.png",
    instructions: [
      "Antebraços no chão, cotovelos sob ombros",
      "Corpo reto da cabeça aos calcanhares",
      "Abdômen bem contraído",
      "Respire normalmente mantendo posição"
    ],
    muscleGroups: ["Core", "Ombros", "Glúteos"]
  },
  "Prancha alta": {
    name: "Prancha Alta",
    description: "Prancha com braços estendidos",
    imageUrl: "/exercises/prancha-alta.png",
    instructions: [
      "Posição de flexão com braços estendidos",
      "Mãos sob os ombros",
      "Corpo reto, core ativado",
      "Não deixe quadril cair"
    ],
    muscleGroups: ["Core", "Ombros", "Braços"]
  },
  "Prancha dinâmica": {
    name: "Prancha Dinâmica",
    description: "Prancha alternando entre alta e baixa",
    imageUrl: "/exercises/prancha-dinamica.png",
    instructions: [
      "Comece em prancha baixa (antebraços)",
      "Suba para prancha alta (mãos)",
      "Desça voltando aos antebraços",
      "Alterne o braço que inicia"
    ],
    muscleGroups: ["Core", "Ombros", "Tríceps"]
  },
  "Prancha rotatória": {
    name: "Prancha Rotatória",
    description: "Prancha com rotação lateral do tronco",
    imageUrl: "/exercises/prancha-rotatoria.png",
    instructions: [
      "Comece em prancha alta",
      "Gire o corpo abrindo um braço para cima",
      "Olhe para a mão elevada",
      "Volte ao centro e repita do outro lado"
    ],
    muscleGroups: ["Core", "Oblíquos", "Ombros"]
  },
  "Prancha com toque ombros": {
    name: "Prancha Toque Ombros",
    description: "Prancha alta tocando ombros alternadamente",
    imageUrl: "/exercises/prancha-toque-ombros.png",
    instructions: [
      "Posição de prancha alta",
      "Toque o ombro esquerdo com mão direita",
      "Volte e toque ombro direito com mão esquerda",
      "Mantenha quadril estável, sem balançar"
    ],
    muscleGroups: ["Core", "Ombros", "Estabilidade"]
  },
  "Prancha + polichinelo em pé": {
    name: "Prancha + Polichinelo",
    description: "Combinação de prancha e polichinelo",
    imageUrl: "/exercises/prancha.png",
    instructions: [
      "Faça prancha por alguns segundos",
      "Levante e faça polichinelos",
      "Volte para prancha",
      "Alterne os movimentos"
    ],
    muscleGroups: ["Core", "Cardio", "Full Body"]
  },

  // ABDOMINAIS
  "Abdominais reto": {
    name: "Abdominal Reto",
    description: "Abdominal clássico para o reto abdominal",
    imageUrl: "/exercises/abdominal.png",
    instructions: [
      "Deite com joelhos flexionados",
      "Mãos atrás da cabeça (sem puxar)",
      "Eleve ombros do chão contraindo abdômen",
      "Desça com controle"
    ],
    muscleGroups: ["Abdômen", "Core"]
  },
  "Ab reto": {
    name: "Abdominal Reto",
    description: "Crunch tradicional",
    imageUrl: "/exercises/abdominal.png",
    instructions: [
      "Costas no chão, joelhos dobrados",
      "Contraia abdômen elevando tronco",
      "Expire ao subir",
      "Controle a descida"
    ],
    muscleGroups: ["Abdômen", "Core"]
  },
  "Ab bicycle": {
    name: "Abdominal Bicicleta",
    description: "Abdominal com movimento de pedalada",
    imageUrl: "/exercises/abdominal-bicicleta.png",
    instructions: [
      "Deite com mãos atrás da cabeça",
      "Eleve ombros e pernas do chão",
      "Leve cotovelo direito ao joelho esquerdo",
      "Alterne como se pedalasse"
    ],
    muscleGroups: ["Oblíquos", "Abdômen", "Core"]
  },
  "Ab bicicleta": {
    name: "Abdominal Bicicleta",
    description: "Abdominal com rotação e movimento de bike",
    imageUrl: "/exercises/abdominal-bicicleta.png",
    instructions: [
      "Deite com pernas elevadas",
      "Alterne cotovelo ao joelho oposto",
      "Movimento fluido de pedalada",
      "Core sempre contraído"
    ],
    muscleGroups: ["Oblíquos", "Abdômen", "Core"]
  },
  "Ab canivete": {
    name: "Abdominal Canivete",
    description: "Abdominal dobrando corpo ao meio",
    imageUrl: "/exercises/abdominal-canivete.png",
    instructions: [
      "Deite completamente esticado",
      "Eleve pernas e tronco simultaneamente",
      "Tente tocar os pés com as mãos",
      "Volte à posição inicial com controle"
    ],
    muscleGroups: ["Abdômen", "Hip flexors", "Core"]
  },
  "Leg raises": {
    name: "Elevação de Pernas",
    description: "Elevação de pernas para abdômen inferior",
    imageUrl: "/exercises/leg-raises.png",
    instructions: [
      "Deite com costas no chão",
      "Mãos sob o quadril ou ao lado",
      "Eleve as pernas retas até 90 graus",
      "Desça sem tocar o chão"
    ],
    muscleGroups: ["Abdômen inferior", "Hip flexors"]
  },
  "Ab com perna elevada": {
    name: "Abdominal Perna Elevada",
    description: "Abdominal com pernas para cima",
    imageUrl: "/exercises/abdominal.png",
    instructions: [
      "Deite com pernas apontando para cima",
      "Contraia abdômen elevando ombros",
      "Mantenha pernas estáveis",
      "Desça com controle"
    ],
    muscleGroups: ["Abdômen", "Core"]
  },
  "Toques alternados calcanhar": {
    name: "Toque Calcanhar",
    description: "Toque alternado nos calcanhares para oblíquos",
    imageUrl: "/exercises/toque-calcanhar.png",
    instructions: [
      "Deite com joelhos dobrados, pés no chão",
      "Eleve levemente os ombros",
      "Incline para tocar calcanhar direito",
      "Alterne para o esquerdo"
    ],
    muscleGroups: ["Oblíquos", "Core"]
  },

  // BURPEES
  "Burpees": {
    name: "Burpee",
    description: "Exercício completo de alta intensidade",
    imageUrl: "/exercises/burpee.png",
    instructions: [
      "Em pé, agache e coloque mãos no chão",
      "Pule os pés para trás (prancha)",
      "Faça uma flexão",
      "Pule os pés para frente e salte"
    ],
    muscleGroups: ["Full Body", "Cardio", "Explosão"]
  },
  "Burpee": {
    name: "Burpee",
    description: "Burpee clássico",
    imageUrl: "/exercises/burpee.png",
    instructions: [
      "Agache e mãos no chão",
      "Pule para prancha",
      "Flexão opcional",
      "Volte e salte com braços para cima"
    ],
    muscleGroups: ["Full Body", "Cardio", "Explosão"]
  },
  "Burpees modificados": {
    name: "Burpee Modificado",
    description: "Burpee sem flexão ou salto para iniciantes",
    imageUrl: "/exercises/burpee.png",
    instructions: [
      "Agache e coloque mãos no chão",
      "Passo a passo vá para prancha",
      "Volte passo a passo ao agachamento",
      "Levante sem saltar"
    ],
    muscleGroups: ["Full Body", "Cardio"]
  },
  "Burpee suave": {
    name: "Burpee Suave",
    description: "Burpee em ritmo mais lento",
    imageUrl: "/exercises/burpee.png",
    instructions: [
      "Execute burpee em velocidade moderada",
      "Pode eliminar o salto final",
      "Foco na forma correta",
      "Mantenha ritmo constante"
    ],
    muscleGroups: ["Full Body", "Cardio"]
  },
  "Burpee completo": {
    name: "Burpee Completo",
    description: "Burpee com todos os elementos",
    imageUrl: "/exercises/burpee.png",
    instructions: [
      "Agache profundamente",
      "Pule para prancha com explosão",
      "Flexão completa",
      "Salto máximo com braços acima"
    ],
    muscleGroups: ["Full Body", "Cardio", "Explosão"]
  },

  // MOUNTAIN CLIMBER
  "Mountain Climber": {
    name: "Mountain Climber",
    description: "Escalador - cardio intenso que trabalha core",
    imageUrl: "/exercises/mountain-climber.png",
    instructions: [
      "Posição de prancha alta",
      "Traga joelho direito ao peito",
      "Alterne rapidamente as pernas",
      "Mantenha quadril baixo e core ativado"
    ],
    muscleGroups: ["Core", "Cardio", "Ombros"]
  },

  // AFUNDOS
  "Afundos alternados": {
    name: "Afundo",
    description: "Afundo alternando as pernas",
    imageUrl: "/exercises/afundo.png",
    instructions: [
      "Em pé, dê um passo à frente",
      "Desça até joelho traseiro quase tocar o chão",
      "Joelho da frente não passa da ponta do pé",
      "Volte e alterne a perna"
    ],
    muscleGroups: ["Pernas", "Glúteos", "Equilíbrio"]
  },
  "Jump lunges": {
    name: "Afundo com Salto",
    description: "Afundo explosivo trocando pernas no ar",
    imageUrl: "/exercises/jump-lunge.png",
    instructions: [
      "Comece em posição de afundo",
      "Salte trocando as pernas no ar",
      "Aterrisse na posição de afundo oposta",
      "Mantenha tronco ereto"
    ],
    muscleGroups: ["Pernas", "Glúteos", "Explosão"]
  },

  // OUTROS
  "Tríceps no banco (sofá)": {
    name: "Tríceps no Banco",
    description: "Mergulho de tríceps usando superfície elevada",
    imageUrl: "/exercises/triceps-banco.png",
    instructions: [
      "Mãos no banco/sofá atrás de você",
      "Pernas esticadas ou dobradas",
      "Desça flexionando os cotovelos",
      "Suba contraindo tríceps"
    ],
    muscleGroups: ["Tríceps", "Ombros"]
  },
  "Superman": {
    name: "Superman",
    description: "Extensão de costas deitado de bruços",
    imageUrl: "/exercises/superman.png",
    instructions: [
      "Deite de bruços, braços estendidos à frente",
      "Eleve braços, peito e pernas do chão",
      "Mantenha olhando para baixo",
      "Segure por 2-3 segundos e desça"
    ],
    muscleGroups: ["Lombar", "Glúteos", "Costas"]
  },

  // ALONGAMENTOS E MOBILIDADE
  "Alongamento dinâmico + mobilidade": {
    name: "Alongamento Dinâmico",
    description: "Série de alongamentos em movimento",
    imageUrl: "/exercises/alongamento.png",
    instructions: [
      "Círculos com os braços",
      "Rotações de quadril",
      "Alongamento de panturrilha em movimento",
      "Torções suaves do tronco"
    ],
    muscleGroups: ["Flexibilidade", "Mobilidade"]
  },
  "Alongamento ativo (costas, pernas, quadril)": {
    name: "Alongamento Ativo",
    description: "Alongamentos focados nas principais áreas",
    imageUrl: "/exercises/alongamento.png",
    instructions: [
      "Alongue costas curvando e estendendo",
      "Alongue pernas uma de cada vez",
      "Faça rotações suaves de quadril",
      "Mantenha cada posição 15-20 segundos"
    ],
    muscleGroups: ["Flexibilidade", "Recuperação"]
  },
  "Alongamento ativo": {
    name: "Alongamento",
    description: "Alongamentos gerais para todo o corpo",
    imageUrl: "/exercises/alongamento.png",
    instructions: [
      "Movimentos suaves e controlados",
      "Alongue principais grupos musculares",
      "Respire profundamente",
      "Não force além do conforto"
    ],
    muscleGroups: ["Flexibilidade", "Recuperação"]
  },
  "Respiração diafragmática": {
    name: "Respiração Diafragmática",
    description: "Técnica de respiração profunda para relaxamento",
    imageUrl: "/exercises/respiracao.png",
    instructions: [
      "Sente ou deite confortavelmente",
      "Mão no peito, outra no abdômen",
      "Inspire pelo nariz enchendo a barriga",
      "Expire lentamente pela boca"
    ],
    muscleGroups: ["Relaxamento", "Core profundo"]
  },
  "Respiração profunda": {
    name: "Respiração Profunda",
    description: "Respirações profundas para recuperação",
    imageUrl: "/exercises/respiracao.png",
    instructions: [
      "Posição confortável",
      "Inspire contando até 4",
      "Segure contando até 4",
      "Expire contando até 6"
    ],
    muscleGroups: ["Relaxamento", "Recuperação"]
  }
};

// Helper function to get exercise info
export const getExerciseInfo = (exerciseName: string): ExerciseInfo | null => {
  return exerciseDatabase[exerciseName] || null;
};

// Get unique list of all exercises
export const getAllUniqueExercises = (): string[] => {
  return Object.keys(exerciseDatabase);
};
