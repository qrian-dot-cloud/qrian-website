const WORKS = [
  //music
  {
    title: "BOSS",
    tags: ["music", "release", "digital single"],
    zone: "music",
    link: "boss.html",
    desc: "Digital Single Release (written, composed, produced, mixed by QRIAN)",
    img: "assets/images/world/boss.webp"
  },
  {
    title: "QRIAN (EP)",
    tags: ["music", "release", "debut", "EP", "cross-cultural identity"],
    zone: "music",
    link: "qrian-ep.html",
    desc: "Debut EP Release (written, composed, produced, mixed by QRIAN)",
    img: "assets/images/world/qrian-ep.webp"
  },
  {
    title: "With This",
    tags: ["music", "release", "digital single", "debut"],
    zone: "music",
    link: "with-this.html",
    desc: "Debut Single Release (written, composed, produced, mixed by QRIAN)",
    img: "assets/images/world/with-this.webp"
  },
  {
    title: "BYULGORAE",
    tags: ["curation", "liveevent", "music", "performance"],
    zone: "music",
    link: "byulgorae.html",
    desc: "Live Event (organised, hosted by QRIAN)",
    img: "assets/images/world/byulgorae.webp"
  },
  {
  title: "Speaking in QRIAN",
  tags: ["music", "performance", "live", "DJing"],
  zone: "music",
  link: "speaking-in-qrian.html",
  desc: "Live Music Performance & DJing (live performance sets, archived DJ mixsets)",
  img: "assets/images/world/speaking-in-qrian.webp"
  },
  
  //collabrative projects
  {
    title: "Lunar Abyss",
    tags: ["collaborative", "mediafacade", "projectionmapping", "audio-visual"],
    zone: "collaborative",
    link: "lunar-abyss.html",
    desc: "Media Facade (audio-visual design, projection mapping, environmental narrative)",
    img: "assets/images/world/lunar-abyss.webp"
  },
  {
    title: "The Planet Of Pets",
    tags: ["collaborative", "interactive", "mediawall", "audio-visual"],
    zone: "collaborative",
    link: "the-planet-of-pets.html",
    desc: "Interactive Media Wall (drawing interface, kinetic audio-visual interaction, AI modeling)",
    img: "assets/images/world/the-planet-of-pets.webp"
  },
  {
    title: "Meme Machine",
    tags: ["collaborative", "AI", "language", "culture", "bias", "data", "perception"],
    zone: "collaborative",
    link: "meme-machine.html",
    desc: "Practice-Based Research (computational perception, cultural lens, data imperialism)",
    img: "assets/images/world/meme-machine.webp"
  },

  //independent projects - series <neither 0 nor 1>
  {
    title: "Gaslighting",
    tags: ["neither0nor1", "physical-computing", "perception", "emotion", "installation"],
    series: "Neither 0 Nor 1",
    zone: "interactive",
    link: "gaslighting.html",
    desc: "Interactive Installation (organic elements, sound synthesis, LEDs)",
    img: "assets/images/world/gaslighting.webp"
  },
  {
    title: "Asian Women vs Women in Asia",
    tags: ["neither0nor1", "audio-visual", "cross-cultural identity", "data", "performance"],
    series: "Neither 0 Nor 1",
    zone: "performance",
    link: "asian-women-vs-women-in-asia.html",
    desc: "Audio-Visual Performance (voices, microphones, real-time data)",
    img: "assets/images/world/asian-women-vs-women-in-asia.webp"
  },
  {
    title: "The Freelancer, Never Feeling Free",
    tags: ["neither0nor1", "music", "songwriting", "performance"],
    series: "Neither 0 Nor 1",
    zone: "performance",
    link: "the-freelancer-never-feeling-free.html",
    desc: "Live Electronic Music Performance (original songwriting, production, voice)",
    img: "assets/images/world/the-freelancer-never-feeling-free.webp"
  },
  {
    title: "AI: An Imposter or Improver?",
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
    tags: ["machine-learning", "emotion", "language", "cross-cultural identity", "voice"],
    zone: "interactive",
    link: "are-we-feeling-the-same.html",
    desc: "Practice-Based Research (machine learning, cross-lingual emotion classification, voices)",
    img: "assets/images/world/are-we-feeling-the-same.webp"
  },
  {
    title: "Between Clap and Slap",
    tags: ["machine-learning", "embodiment", "perception", "sound", "gesture"],
    zone: "interactive",
    link: "between-clap-and-slap.html",
    desc: "Practice-Based Research (machine listening, perceptual mediation, algorithmic authority)",
    img: "assets/images/world/between-clap-and-slap.webp"
  },
  
  //independent projects - recent series
  {
    title: "Spring v01",
    tags: ["thechimes", "audio-visual", "gesture", "sound", "synthesis", "embodiment"],
    series: "The Chimes",
    zone: "interactive",
    link: "spring-v01.html",
    desc: "Audio-Visual System (gesture, sound synthesis, embodiment)",
    img: "assets/images/world/spring-v01.webp"
  },
  {
    title: "Proof of Tears",
    tags: ["emosmiths", "MR", "sound", "synthesis", "voice", "emotion", "sci-fi", "installation"],
    series: "Emosmiths",
    zone: "interactive",
    link: "proof-of-tears.html",
    desc: "Interactive Installation (mixed reality, sound synthesis, soft sculpture)",
    img: "assets/images/world/proof-of-tears.webp"
  },

  //independent projects - recent interactive ones
  {
    title: "Read My Face Out Loud",
    tags: ["audio-visual", "gesture", "sound", "synthesis", "emotion", "performance"],
    zone: "interactive",
    link: "read-my-face-out-loud.html",
    desc: "Audio-Visual Performance (facial data API, sound synthesis, embodiment)",
    img: "assets/images/world/read-my-face-out-loud.webp"
  },
  {
    title: "Mindful Resonance",
    tags: ["MR", "sketch", "sound", "gesture", "embodiment"],
    zone: "interactive",
    link: "mindful-resonance.html",
    desc: "Mixed Reality System (quest3, gesture, sound synthesis)",
    img: "assets/images/world/mindful-resonance.webp"
  },
  {
    title: "Liminal Rock",
    tags: ["sketch", "VR", "emotion"],
    zone: "interactive",
    link: "liminal-rock.html",
    desc: "Virtual Reality Experience (quest3, scene/sound design, spatial narrative)",
    img: "assets/images/world/liminal-rock.webp"
  }
];
