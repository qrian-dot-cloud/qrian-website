const WORKS = [
  //music
  {
    title: "BOSS",
    year: "2023",
    tags: ["music", "release", "digital single"],
    zone: "music",
    link: "boss.html",
    desc: "Digital Single Release (written, composed, produced, mixed by QRIAN)",
    img: "assets/images/world/boss.webp"
  },
  {
    title: "QRIAN (EP)",
    year: "2019",
    tags: ["music", "release", "debut", "EP", "cross-cultural identity"],
    zone: "music",
    link: "qrian-ep.html",
    desc: "Debut EP Release (written, composed, produced, mixed by QRIAN)",
    img: "assets/images/world/qrian-ep.webp"
  },
  {
    title: "With This",
    year: "2019",
    tags: ["music", "release", "digital single", "debut"],
    zone: "music",
    link: "with-this.html",
    desc: "Debut Single Release (written, composed, produced, mixed by QRIAN)",
    img: "assets/images/world/with-this.webp"
  },
  {
    title: "BYULGORAE",
    year: "2024-",
    tags: ["curation", "liveevent", "music", "performance"],
    zone: "music",
    link: "byulgorae.html",
    desc: "Live Event Production (organised, hosted by QRIAN)",
    img: "assets/images/world/byulgorae.webp"
  },
  {
  title: "Speaking in QRIAN",
  year: "2018-",
  tags: ["music", "performance", "live", "DJing"],
  zone: "music",
  link: "speaking-in-qrian.html",
  desc: "Live Music Performance & DJing (live performance sets, archived DJ mixsets)",
  img: "assets/images/world/speaking-in-qrian.webp"
  },
  
  //collabrative projects
  {
    title: "Lunar Abyss",
    year: "2025",
    tags: ["collaborative", "mediafacade", "projectionmapping", "audio-visual"],
    zone: "collaborative",
    link: "lunar-abyss.html",
    desc: "Media Facade (audio-visual design, projection mapping, environmental narrative)",
    img: "assets/images/world/lunar-abyss.webp"
  },
  {
    title: "The Planet Of Pets",
    year: "2025",
    tags: ["collaborative", "interactive", "media-wall", "audio-visual"],
    zone: "collaborative",
    link: "the-planet-of-pets.html",
    desc: "Interactive Media Wall (drawing interface, kinetic audio-visual interaction, AI modeling)",
    img: "assets/images/world/the-planet-of-pets.webp"
  },
  {
    title: "Meme Machine",
    year: "2025",
    tags: ["collaborative", "AI", "language", "cross-cultural identity", "bias", "data", "perception"],
    zone: "collaborative",
    link: "meme-machine.html",
    desc: "Generative AI Experiment (computational perception, cultural lens, data imperialism)",
    img: "assets/images/world/meme-machine.webp"
  },

  //independent projects - series <neither 0 nor 1>
  {
    title: "Gaslighting",
    year: "2024",
    tags: ["neither0nor1", "physical-computing", "perception", "emotion", "installation"],
    series: "Neither 0 Nor 1",
    zone: "interactive",
    link: "gaslighting.html",
    desc: "Interactive Installation (organic elements, sound synthesis, LEDs)",
    img: "assets/images/world/gaslighting.webp"
  },
  {
    title: "Asian Women vs Women in Asia",
    year: "2024",
    tags: ["neither0nor1", "audio-visual", "cross-cultural identity", "data", "voice", "performance"],
    series: "Neither 0 Nor 1",
    zone: "performance",
    link: "asian-women-vs-women-in-asia.html",
    desc: "Audio-Visual Performance (voices, microphones, real-time data)",
    img: "assets/images/world/asian-women-vs-women-in-asia.webp"
  },
  {
    title: "The Freelancer, Never Feeling Free",
    year: "2024",
    tags: ["neither0nor1", "music", "songwriting", "performance"],
    series: "Neither 0 Nor 1",
    zone: "performance",
    link: "the-freelancer-never-feeling-free.html",
    desc: "Live Electronic Music Performance (original songwriting, production, voice)",
    img: "assets/images/world/the-freelancer-never-feeling-free.webp"
  },
  {
    title: "AI: An Imposter or Improver?",
    year: "2024",
    tags: ["neither0nor1", "film", "documentary", "AI", "perception"],
    series: "Neither 0 Nor 1",
    zone: "film",
    link: "ai-an-imposter-or-an-improver.html",
    desc: "Video (independent experimental-documentary film)",
    img: "assets/images/world/ai-an-imposter-or-an-improver.webp"
  },

  //independent projects - practice-based research
  {
    title: "Are We Feeling The Same?",
    year: "2026",
    tags: ["machine-listening", "machine-learning", "emotion", "language", "cross-cultural identity", "voice", "perception"],
    zone: "interactive",
    link: "are-we-feeling-the-same.html",
    desc: "Machine Listening System (machine learning, cross-lingual emotion classification, voices)",
    img: "assets/images/world/are-we-feeling-the-same.webp"
  },
  {
    title: "Between Clap and Slap",
    year: "2026",
    tags: ["machine-listening", "machine-learning", "embodiment", "perception", "sound", "gesture", "emotion"],
    zone: "interactive",
    link: "between-clap-and-slap.html",
    desc: "Machine Listening System (machine learning, perceptual mediation, algorithmic authority)",
    img: "assets/images/world/between-clap-and-slap.webp"
  },
  
  //independent projects - recent series
  {
    title: "Spring v01",
    year: "2026",
    tags: ["thechimes", "audio-visual", "gesture", "sound", "synthesis", "embodiment"],
    series: "The Chimes",
    zone: "interactive",
    link: "spring-v01.html",
    desc: "Audio-Visual System (gesture, sound synthesis, embodiment)",
    img: "assets/images/world/spring-v01.webp"
  },
  {
    title: "Proof of Tears",
    year: "2026",
    tags: ["emosmiths", "MR", "sound", "synthesis", "voice", "emotion", "sci-fi", "installation", "embodiment"],
    series: "Emosmiths",
    zone: "interactive",
    link: "proof-of-tears.html",
    desc: "Interactive Installation (mixed reality, sound synthesis, soft sculpture)",
    img: "assets/images/world/proof-of-tears.webp"
  },

  //independent projects - recent interactive ones
  {
  title: "Creative Coding Sketches",
  year: "2025-",
  tags: ["sketch", "audio-visual", "interactive", "coding", "sound"],
  zone: "interactive",
  link: "creative-coding-sketches.html",
  desc: "Audio-Visual, Interactive & Poetic Experiments (p5.js/Python, archived coding sketches)",
  img: "assets/images/world/creative-coding-sketches.webp"
  },
  {
    title: "Read My Face Out Loud",
    year: "2025",
    tags: ["audio-visual", "machine-vision", "machine-learning", "sound", "synthesis", "emotion", "performance"],
    zone: "interactive",
    link: "read-my-face-out-loud.html",
    desc: "Audio-Visual Performance (facial emotion recognition API, sound synthesis, embodiment)",
    img: "assets/images/world/read-my-face-out-loud.webp"
  },
  {
    title: "Mindful Resonance",
    year: "2026",
    tags: ["MR", "sketch", "sound", "gesture", "embodiment"],
    zone: "interactive",
    link: "mindful-resonance.html",
    desc: "Mixed Reality System (quest3, gesture, sound synthesis)",
    img: "assets/images/world/mindful-resonance.webp"
  },
  {
    title: "Liminal Rock",
    year: "2026",
    tags: ["sketch", "VR", "emotion", "narrative", "collaborative"],
    zone: "interactive",
    link: "liminal-rock.html",
    desc: "Virtual Reality Experience (quest3, scene/sound design, spatial narrative)",
    img: "assets/images/world/liminal-rock.webp"
  }
];
