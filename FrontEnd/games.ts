export interface Game {
    id: number;
    title: string;
    description: string;
    fullDescription: string;
    platforms: string[];
    genres: string[];
    releaseDate: string;
    developer: string;
    publisher: string;
    rating: number;
    totalReviews: number;
    price: number;
    imageUrl: string;
    videoUrl?: string;
  }
  
  export const games: Game[] = [
    {
      id: 1,
      title: "The Last of Us Part II",
      description: "Uma jornada emocional épica em um mundo pós-apocalíptico.",
      fullDescription: "The Last of Us Part II é uma aventura de ação que oferece uma história emocionalmente devastadora sobre vingança, sobrevivência e redenção. Com gráficos impressionantes e jogabilidade refinada, este jogo redefine o padrão para narrativas em videogames.",
      platforms: ["PlayStation 5", "PlayStation 4", "PC"],
      genres: ["Ação", "Aventura", "Sobrevivência"],
      releaseDate: "19/06/2020",
      developer: "Naughty Dog",
      publisher: "Sony Interactive Entertainment",
      rating: 4.7,
      totalReviews: 15423,
      price: 199.90,
      imageUrl: ""
    },
    {
      id: 2,
      title: "Grand Theft Auto V",
      description: "Explore Los Santos em um dos jogos de mundo aberto mais icônicos.",
      fullDescription: "GTA V oferece uma experiência de mundo aberto incomparável, permitindo que você viva a vida de três criminosos diferentes em Los Santos. Com missões intensas, um modo online massivo e liberdade total de exploração.",
      platforms: ["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One"],
      genres: ["Ação", "Aventura", "Mundo Aberto"],
      releaseDate: "17/09/2013",
      developer: "Rockstar North",
      publisher: "Rockstar Games",
      rating: 4.8,
      totalReviews: 28934,
      price: 89.90,
      imageUrl: ""
    },
    {
      id: 3,
      title: "Minecraft",
      description: "Construa, explore e sobreviva em um mundo infinito de blocos.",
      fullDescription: "Minecraft é um jogo sandbox que permite criatividade ilimitada. Construa estruturas impressionantes, explore cavernas perigosas, lute contra monstros e jogue com amigos em servidores multiplayer.",
      platforms: ["PC", "Mobile", "PlayStation", "Xbox", "Nintendo Switch"],
      genres: ["Sandbox", "Aventura", "Sobrevivência"],
      releaseDate: "18/11/2011",
      developer: "Mojang Studios",
      publisher: "Microsoft",
      rating: 4.9,
      totalReviews: 45678,
      price: 79.90,
      imageUrl: ""
    },
    {
      id: 4,
      title: "Fortnite",
      description: "Battle Royale com construção e ação frenética.",
      fullDescription: "Fortnite revolucionou o gênero Battle Royale ao adicionar mecânicas de construção. Compete contra 100 jogadores, construa estruturas defensivas e seja o último sobrevivente.",
      platforms: ["PC", "Mobile", "PlayStation", "Xbox", "Nintendo Switch"],
      genres: ["Battle Royale", "Tiro", "Ação"],
      releaseDate: "21/07/2017",
      developer: "Epic Games",
      publisher: "Epic Games",
      rating: 4.3,
      totalReviews: 38291,
      price: 0,
      imageUrl: ""
    },
    {
      id: 5,
      title: "Among Us",
      description: "Descubra o impostor neste jogo social de dedução.",
      fullDescription: "Among Us é um jogo multiplayer de dedução social onde jogadores trabalham juntos para completar tarefas em uma nave espacial, mas alguns são impostores secretos tentando sabotar a missão.",
      platforms: ["PC", "Mobile", "PlayStation", "Xbox", "Nintendo Switch"],
      genres: ["Social", "Multiplayer", "Dedução"],
      releaseDate: "15/06/2018",
      developer: "InnerSloth",
      publisher: "InnerSloth",
      rating: 4.2,
      totalReviews: 22156,
      price: 15.90,
      imageUrl: ""
    },
    {
      id: 6,
      title: "Call of Duty: Modern Warfare II",
      description: "Combate tático em primeira pessoa com multiplayer intenso.",
      fullDescription: "A franquia Call of Duty retorna com gráficos de última geração, campanha cinemática e modos multiplayer competitivos. Experiência militar realista com ação explosiva.",
      platforms: ["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One"],
      genres: ["FPS", "Ação", "Tiro"],
      releaseDate: "28/10/2022",
      developer: "Infinity Ward",
      publisher: "Activision",
      rating: 4.5,
      totalReviews: 19834,
      price: 249.90,
      imageUrl: ""
    },
    {
      id: 7,
      title: "Cyberpunk 2077",
      description: "RPG futurista em uma metrópole distópica e vibrante.",
      fullDescription: "Explore Night City como V, um mercenário em busca de um implante único que é a chave para a imortalidade. RPG de ação com narrativa ramificada e mundo aberto massivo.",
      platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
      genres: ["RPG", "Ação", "Mundo Aberto"],
      releaseDate: "10/12/2020",
      developer: "CD Projekt Red",
      publisher: "CD Projekt",
      rating: 4.1,
      totalReviews: 17562,
      price: 149.90,
      imageUrl: ""
    },
    {
      id: 8,
      title: "God of War Ragnarök",
      description: "Kratos e Atreus enfrentam o apocalipse nórdico.",
      fullDescription: "Continuação épica da jornada de Kratos e seu filho Atreus pela mitologia nórdica. Combate brutal, narrativa envolvente e gráficos espetaculares.",
      platforms: ["PlayStation 5", "PlayStation 4", "PC"],
      genres: ["Ação", "Aventura", "RPG"],
      releaseDate: "09/11/2022",
      developer: "Santa Monica Studio",
      publisher: "Sony Interactive Entertainment",
      rating: 4.9,
      totalReviews: 21457,
      price: 299.90,
      imageUrl: ""
    },
    {
      id: 9,
      title: "Valorant",
      description: "FPS tático 5v5 com habilidades únicas de personagens.",
      fullDescription: "Valorant combina tiro preciso com habilidades únicas de Agentes. Jogo competitivo gratuito com foco em habilidade e estratégia.",
      platforms: ["PC"],
      genres: ["FPS", "Tático", "Competitivo"],
      releaseDate: "02/06/2020",
      developer: "Riot Games",
      publisher: "Riot Games",
      rating: 4.4,
      totalReviews: 26783,
      price: 0,
      imageUrl: ""
    },
    {
      id: 10,
      title: "League of Legends",
      description: "MOBA competitivo com mais de 160 campeões únicos.",
      fullDescription: "League of Legends é o MOBA mais popular do mundo. Escolha seu campeão, desenvolva estratégias com sua equipe e destrua o Nexus inimigo em partidas intensas 5v5.",
      platforms: ["PC", "Mobile"],
      genres: ["MOBA", "Estratégia", "Competitivo"],
      releaseDate: "27/10/2009",
      developer: "Riot Games",
      publisher: "Riot Games",
      rating: 4.6,
      totalReviews: 41923,
      price: 0,
      imageUrl: ""
    },
    {
      id: 11,
      title: "The Legend of Zelda: Breath of the Wild",
      description: "Aventura épica em mundo aberto no reino de Hyrule.",
      fullDescription: "Explore o vasto reino de Hyrule nesta aventura revolucionária. Com liberdade total de exploração, física realista e puzzles criativos, Breath of the Wild redefiniu a franquia Zelda.",
      platforms: ["Nintendo Switch", "Wii U"],
      genres: ["Ação", "Aventura", "Mundo Aberto"],
      releaseDate: "03/03/2017",
      developer: "Nintendo EPD",
      publisher: "Nintendo",
      rating: 4.9,
      totalReviews: 33421,
      price: 299.90,
      imageUrl: ""
    },
    {
      id: 12,
      title: "Genshin Impact",
      description: "RPG de ação gratuito com mundo aberto e sistema gacha.",
      fullDescription: "Explore o mundo mágico de Teyvat neste RPG de ação anime. Colecione personagens únicos, domine diferentes elementos e desvende os mistérios dos Sete.",
      platforms: ["PC", "Mobile", "PlayStation 5", "PlayStation 4"],
      genres: ["RPG", "Ação", "Gacha"],
      releaseDate: "28/09/2020",
      developer: "miHoYo",
      publisher: "miHoYo",
      rating: 4.5,
      totalReviews: 29384,
      price: 0,
      imageUrl: ""
    },
    {
      id: 13,
      title: "Apex Legends",
      description: "Battle Royale com Legends únicos e combate intenso.",
      fullDescription: "Battle Royale baseado em heróis onde equipes de três lutam pela vitória. Cada Legend tem habilidades únicas que criam sinergias estratégicas.",
      platforms: ["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Mobile"],
      genres: ["Battle Royale", "FPS", "Ação"],
      releaseDate: "04/02/2019",
      developer: "Respawn Entertainment",
      publisher: "Electronic Arts",
      rating: 4.3,
      totalReviews: 24567,
      price: 0,
      imageUrl: ""
    },
    {
      id: 14,
      title: "Red Dead Redemption 2",
      description: "Viva a vida de um fora-da-lei no Velho Oeste americano.",
      fullDescription: "Uma história épica sobre honra e lealdade no fim da era dos pistoleiros. Mundo aberto impressionante com detalhes realistas e narrativa envolvente.",
      platforms: ["PC", "PlayStation 4", "Xbox One"],
      genres: ["Ação", "Aventura", "Mundo Aberto"],
      releaseDate: "26/10/2018",
      developer: "Rockstar Studios",
      publisher: "Rockstar Games",
      rating: 4.8,
      totalReviews: 32145,
      price: 179.90,
      imageUrl: ""
    }
  ];
  
  export interface Review {
    id: number;
    gameId: number;
    userId: number;
    userName: string;
    userAvatar: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
  }
  
  export const reviews: Review[] = [
    {
      id: 1,
      gameId: 1,
      userId: 1,
      userName: "João Silva",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
      rating: 5,
      comment: "Obra-prima absoluta. A narrativa é impecável e a jogabilidade é refinada. Uma experiência inesquecível!",
      date: "2024-01-15",
      helpful: 234
    },
    {
      id: 2,
      gameId: 1,
      userId: 2,
      userName: "Maria Santos",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      rating: 4,
      comment: "História emocionante, mas alguns momentos são muito pesados. Gráficos incríveis!",
      date: "2024-01-20",
      helpful: 156
    },
    {
      id: 3,
      gameId: 2,
      userId: 3,
      userName: "Pedro Oliveira",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
      rating: 5,
      comment: "Ainda é incrível depois de tantos anos. GTA Online continua viciante!",
      date: "2024-02-01",
      helpful: 423
    },
    {
      id: 4,
      gameId: 3,
      userId: 4,
      userName: "Ana Costa",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
      rating: 5,
      comment: "Criatividade sem limites! Perfeito para todas as idades.",
      date: "2024-01-28",
      helpful: 567
    },
    {
      id: 5,
      gameId: 4,
      userId: 5,
      userName: "Lucas Ferreira",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas",
      rating: 4,
      comment: "Divertido com amigos, mas pode ser repetitivo. Atualizações constantes mantêm o jogo fresco.",
      date: "2024-02-05",
      helpful: 198
    }
  ];
  