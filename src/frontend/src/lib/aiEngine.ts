// Client-side AI engine — comprehensive general knowledge + computation
// Covers: math, science, history, geography, technology, people, health,
// sports, entertainment, philosophy, economics, language, and more.

// ─────────────────────────────────────────────────────────────────────────────
// MATH UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function evaluateMath(expr: string): string | null {
  const sanitized = expr.replace(/\^/g, "**");
  if (!/^[\d\s+\-*/.()%**]+$/.test(sanitized)) return null;
  try {
    const result = Function(`return ${sanitized}`)();
    if (typeof result === "number" && Number.isFinite(result)) {
      if (Number.isInteger(result)) return String(result);
      return Number(result.toFixed(8)).toString();
    }
    return null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIT CONVERSIONS
// ─────────────────────────────────────────────────────────────────────────────

interface ConversionResult {
  value: string;
  unit: string;
}

function convertUnit(
  val: number,
  from: string,
  to: string,
): ConversionResult | null {
  const fmt = (n: number) =>
    Number.isInteger(n) ? String(n) : Number(n.toFixed(6)).toString();

  const normalize = (u: string) => {
    const map: Record<string, string> = {
      kilometers: "km",
      kilometer: "km",
      miles: "mi",
      mile: "mi",
      meters: "m",
      meter: "m",
      feet: "ft",
      foot: "ft",
      centimeters: "cm",
      centimeter: "cm",
      inches: "in",
      inch: "in",
      kilograms: "kg",
      kilogram: "kg",
      lbs: "lb",
      lb: "lb",
      pounds: "lb",
      pound: "lb",
      grams: "g",
      gram: "g",
      ounces: "oz",
      ounce: "oz",
      celsius: "c",
      fahrenheit: "f",
      kelvin: "k",
    };
    return map[u] ?? u;
  };

  const f = normalize(from);
  const t = normalize(to);

  const toMeters: Record<string, number> = {
    km: 1000,
    mi: 1609.344,
    m: 1,
    ft: 0.3048,
    cm: 0.01,
    in: 0.0254,
  };
  const unitNames: Record<string, string> = {
    km: "km",
    mi: "mi",
    m: "m",
    ft: "ft",
    cm: "cm",
    in: "in",
    kg: "kg",
    lb: "lbs",
    g: "g",
    oz: "oz",
    c: "°C",
    f: "°F",
    k: "K",
  };

  if (toMeters[f] && toMeters[t]) {
    const meters = val * toMeters[f];
    return { value: fmt(meters / toMeters[t]), unit: unitNames[t] };
  }

  const toGrams: Record<string, number> = {
    kg: 1000,
    lb: 453.592,
    g: 1,
    oz: 28.3495,
  };
  if (toGrams[f] && toGrams[t]) {
    const grams = val * toGrams[f];
    return { value: fmt(grams / toGrams[t]), unit: unitNames[t] };
  }

  if (
    (f === "c" || f === "f" || f === "k") &&
    (t === "c" || t === "f" || t === "k")
  ) {
    let celsius: number;
    if (f === "c") celsius = val;
    else if (f === "f") celsius = ((val - 32) * 5) / 9;
    else celsius = val - 273.15;

    let result: number;
    if (t === "c") result = celsius;
    else if (t === "f") result = (celsius * 9) / 5 + 32;
    else result = celsius + 273.15;

    return { value: fmt(result), unit: unitNames[t] };
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE
// ─────────────────────────────────────────────────────────────────────────────

const KB: Record<string, string> = {
  // ── SCIENCE: Biology ──────────────────────────────────────────────────────
  dna: "**DNA** (deoxyribonucleic acid) is the molecule that carries the genetic instructions for all living things. It's shaped like a **double helix** — two strands wound around each other, discovered by Watson and Crick in 1953. DNA is made of four bases: **adenine (A)**, **thymine (T)**, **cytosine (C)**, and **guanine (G)**. It encodes proteins that determine how organisms develop, function, and reproduce.",
  photosynthesis:
    "**Photosynthesis** is the process by which plants, algae, and some bacteria convert sunlight into food. The equation is: **6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂**. Chlorophyll in the chloroplasts absorbs light, splitting water molecules and releasing oxygen as a by-product. The glucose produced fuels the plant's growth and energy needs.",
  mitosis:
    "**Mitosis** is a type of cell division that produces two genetically identical daughter cells from one parent cell. It has four phases: **prophase, metaphase, anaphase, and telophase**. Mitosis is used for growth and tissue repair. It differs from meiosis, which produces four genetically diverse cells for sexual reproduction.",
  meiosis:
    "**Meiosis** is the type of cell division that creates sex cells (sperm and eggs). It involves two rounds of division, producing four cells each with **half the chromosomes** of the parent — called haploid cells. This halving ensures that when fertilization occurs, the resulting cell has the correct chromosome number.",
  evolution:
    "**Evolution** is the process by which populations of organisms change over time through **natural selection, mutation, genetic drift, and gene flow**. Charles Darwin and Alfred Russel Wallace independently proposed natural selection — organisms better adapted to their environment reproduce more successfully. Over millions of years, this drives the diversity of life on Earth.",
  cell: "A **cell** is the fundamental unit of life. There are two main types: **prokaryotes** (no nucleus, like bacteria) and **eukaryotes** (with a nucleus, like animal and plant cells). Key organelles include the **nucleus** (DNA storage), **mitochondria** (energy production), **ribosomes** (protein synthesis), and the **cell membrane** (boundary and transport).",
  gene: "A **gene** is a segment of DNA that encodes instructions for building a specific protein. Humans have roughly **20,000–25,000 genes** spread across 23 chromosome pairs. Genes determine inherited traits like eye color and blood type. The complete set of genes in an organism is called its **genome**.",
  virus:
    "A **virus** is a microscopic infectious agent that can only replicate inside a living host cell. Viruses consist of genetic material (DNA or RNA) wrapped in a protein coat. They cause diseases like the flu, COVID-19, and HIV. Unlike bacteria, viruses are **not living organisms** by strict biological standards and cannot be treated with antibiotics.",
  bacteria:
    "**Bacteria** are single-celled prokaryotic microorganisms found virtually everywhere on Earth. While some cause diseases (like tuberculosis and salmonella), many are beneficial — aiding digestion, cycling nutrients, and producing foods like yogurt and cheese. The human body contains trillions of bacteria, mostly in the gut.",

  // ── SCIENCE: Chemistry ────────────────────────────────────────────────────
  atom: "An **atom** is the basic unit of matter. It consists of a **nucleus** containing protons and neutrons, surrounded by a cloud of **electrons**. The number of protons determines the element — hydrogen has 1, carbon has 6, oxygen has 8. Atoms bond together to form molecules. Most of the atom is empty space — if the nucleus were the size of a marble, the atom would be the size of a football stadium.",
  electron:
    "An **electron** is a negatively charged subatomic particle that orbits the nucleus of an atom. Electrons occupy **energy levels or shells** and determine an atom's chemical behavior. The transfer or sharing of electrons creates **chemical bonds**. Electrons have extremely low mass compared to protons and neutrons.",
  proton:
    "A **proton** is a positively charged subatomic particle found in the nucleus of every atom. The number of protons in an atom (its **atomic number**) defines which element it is. Protons are made of **quarks** — specifically two up quarks and one down quark. They are about 1,836 times heavier than electrons.",
  neutron:
    "A **neutron** is a neutral (no charge) subatomic particle found in the nucleus alongside protons. Neutrons stabilize the nucleus and determine an atom's **isotope**. An atom of carbon-12 has 6 protons and 6 neutrons; carbon-14 has 6 protons and 8 neutrons. Neutrons were discovered by **James Chadwick** in 1932.",
  water:
    "**Water (H₂O)** is a molecule made of two hydrogen atoms bonded to one oxygen atom. It's the most important solvent on Earth, essential for all known life. Water has unique properties: high specific heat, surface tension, and it expands when frozen. It covers about **71% of Earth's surface** and makes up about 60% of the human body.",
  oxygen:
    "**Oxygen (O)** is element #8 on the periodic table, a colorless, odorless gas essential for respiration and combustion. It makes up about **21% of Earth's atmosphere** and is produced by photosynthesis. Liquid oxygen (LOX) is used as rocket fuel. The most common compound of oxygen is water (H₂O).",
  "carbon dioxide":
    "**Carbon dioxide (CO₂)** is a colorless gas consisting of one carbon atom and two oxygen atoms. It's produced by cellular respiration, combustion, and volcanic eruptions. Plants use it in photosynthesis. CO₂ is a major **greenhouse gas** — rising concentrations from fossil fuel burning are the primary driver of **climate change**.",
  periodic:
    "The **Periodic Table** organizes all known chemical elements by atomic number. It was created by **Dmitri Mendeleev** in 1869. Elements in the same column (group) share similar chemical properties. The table has 118 confirmed elements, from hydrogen (1) to oganesson (118). Rows are called periods, and element properties follow predictable patterns across it.",

  // ── SCIENCE: Physics ──────────────────────────────────────────────────────
  "black hole":
    "A **black hole** is a region in space where gravity is so intense that nothing — not even light — can escape. They form when massive stars collapse at the end of their life. The boundary from which nothing returns is called the **event horizon**. At the center lies a **singularity**, a point of infinite density. The first image of a black hole was captured in 2019 by the Event Horizon Telescope.",
  "quantum mechanics":
    "**Quantum mechanics** is the branch of physics describing the behavior of matter and energy at the atomic and subatomic scale. Key principles include **wave-particle duality** (particles behave like waves), **the Heisenberg uncertainty principle** (you can't know both position and momentum precisely), and **superposition** (particles exist in multiple states simultaneously). It underlies all modern electronics.",
  relativity:
    "**Relativity** encompasses two theories by **Albert Einstein**. *Special Relativity* (1905) states that the laws of physics are the same for all non-accelerating observers and that the speed of light is constant — leading to time dilation and E=mc². *General Relativity* (1915) describes gravity as the curvature of spacetime caused by mass and energy.",
  thermodynamics:
    "**Thermodynamics** is the study of heat, energy, and their relationships. The **First Law** states energy cannot be created or destroyed (conservation of energy). The **Second Law** states entropy always increases — heat flows from hot to cold. The **Third Law** states absolute zero (−273.15°C) is unattainable. These laws govern everything from engines to the universe's fate.",
  magnetism:
    "**Magnetism** is a force produced by moving electric charges. All magnets have north and south poles — opposite poles attract, like poles repel. Earth itself is a giant magnet, with a magnetic field that protects us from solar radiation. Electricity and magnetism are unified as **electromagnetism**, one of the four fundamental forces of nature.",
  electricity:
    "**Electricity** is the flow of electric charge, typically electrons through a conductor. **Voltage** (V) is the potential difference, **current** (A) is the flow rate, and **resistance** (Ω) opposes flow. **Ohm's Law: V = IR**. Electricity powers modern civilization — generated at power plants and transmitted via AC (alternating current) over long distances.",
  nuclear:
    "**Nuclear energy** comes from reactions in an atom's nucleus. **Fission** splits heavy atoms (like uranium) releasing enormous energy — used in nuclear power plants and atomic bombs. **Fusion** joins light atoms (like hydrogen) releasing even more energy — the process powering the Sun. Fusion energy for power generation remains an active area of research.",

  // ── SCIENCE: Astronomy ────────────────────────────────────────────────────
  universe:
    "The **universe** is everything that exists — all matter, energy, space, and time. It began with the **Big Bang** approximately **13.8 billion years ago** and has been expanding ever since. It contains an estimated **2 trillion galaxies**, each with billions of stars. The observable universe spans about **93 billion light-years** in diameter.",
  "big bang":
    "The **Big Bang** is the leading cosmological model for the origin of the universe. About **13.8 billion years ago**, the universe began as an extraordinarily hot, dense singularity and has been expanding and cooling ever since. Evidence includes the **cosmic microwave background radiation** (CMB) and the observed expansion of galaxies.",
  galaxy:
    "A **galaxy** is a massive system of stars, gas, dust, and dark matter bound together by gravity. Our galaxy, the **Milky Way**, contains 200–400 billion stars and is about 100,000 light-years across. The nearest large galaxy to us is **Andromeda**, about 2.5 million light-years away. Galaxies come in spiral, elliptical, and irregular shapes.",
  "milky way":
    "The **Milky Way** is the galaxy that contains our Solar System. It's a **barred spiral galaxy** about 100,000 light-years in diameter with 200–400 billion stars. Our Solar System is located about 26,000 light-years from the galactic center in the **Orion Arm**. On a clear night, you can see the Milky Way as a band of light stretching across the sky.",
  star: "A **star** is a luminous sphere of plasma held together by gravity and generating energy through **nuclear fusion** in its core. Stars form from collapsing clouds of gas and dust. They live millions to billions of years before dying as white dwarfs, neutron stars, or black holes depending on their mass. Our Sun is a medium-sized **yellow dwarf star**.",
  sun: "The **Sun** is a G-type main-sequence star at the center of our Solar System, about **150 million km** from Earth. Its surface temperature is ~5,500°C; its core reaches ~15 million°C. It converts **4 million tonnes of hydrogen to energy every second** through fusion. It's about 4.6 billion years old and will burn for another ~5 billion years.",
  moon: "The **Moon** is Earth's only natural satellite, orbiting at an average distance of **384,400 km**. It formed ~4.5 billion years ago likely from a collision between early Earth and a Mars-sized body. It is about **1/4 Earth's size** and causes ocean tides via its gravitational pull. Humans first walked on the Moon on **July 20, 1969** (Apollo 11).",
  mercury:
    "**Mercury** is the smallest planet and closest to the Sun, at ~58 million km. Its surface temperatures swing from **-180°C at night to 430°C during the day** due to virtually no atmosphere. A day on Mercury (sunrise to sunrise) lasts 176 Earth days, while its year is only 88 Earth days. It has a heavily cratered surface similar to the Moon.",
  venus:
    "**Venus** is the second planet from the Sun and Earth's closest planetary neighbor. It's the hottest planet with surface temperatures of ~**465°C** due to a thick CO₂ atmosphere creating a runaway greenhouse effect. Venus rotates backwards (east to west) and very slowly — a day on Venus is longer than its year. It's covered in volcanic plains and highland regions.",
  earth:
    "**Earth** is the third planet from the Sun and the only known planet harboring life. It's about **4.54 billion years old**, with a radius of 6,371 km. Earth has a protective magnetic field, liquid water, and an oxygen-rich atmosphere. It orbits the Sun in ~365.25 days and rotates once every ~24 hours. Earth's surface is 71% ocean and 29% land.",
  mars: "**Mars** is the fourth planet from the Sun, often called the **Red Planet** due to iron oxide on its surface. It has the largest volcano (**Olympus Mons** — 3× Everest's height) and the longest canyon (**Valles Marineris**) in the Solar System. A Martian day is 24 hours 37 minutes. NASA's rovers including Curiosity and Perseverance are actively exploring Mars.",
  jupiter:
    "**Jupiter** is the largest planet in the Solar System — so big that all other planets could fit inside it. It's a **gas giant** with no solid surface, composed mostly of hydrogen and helium. Its most famous feature is the **Great Red Spot** — a storm larger than Earth that has raged for over 350 years. Jupiter has at least **95 known moons**, including Europa (possible subsurface ocean).",
  saturn:
    "**Saturn** is the sixth planet from the Sun and famous for its stunning **ring system** made of ice and rock. Like Jupiter, it's a gas giant — so low density it would float in water. Saturn has **146 known moons**, the largest being **Titan**, which has a thick atmosphere and lakes of liquid methane. A year on Saturn lasts about 29.5 Earth years.",
  uranus:
    "**Uranus** is the seventh planet and the first discovered through a telescope (by William Herschel in 1781). It's an **ice giant** composed of water, methane, and ammonia ices. Uranus rotates on its side — its axial tilt is 98°, likely due to an ancient collision. It appears blue-green due to methane in its atmosphere. A year on Uranus is 84 Earth years.",
  neptune:
    "**Neptune** is the eighth and farthest planet from the Sun, about 4.5 billion km away. It's an **ice giant** with the strongest sustained winds in the Solar System — up to 2,100 km/h. Its largest moon, **Triton**, orbits backwards and is likely a captured Kuiper Belt object. Neptune was predicted mathematically before being observed in 1846.",

  // ── HISTORY ───────────────────────────────────────────────────────────────
  "world war 1":
    "**World War I (1914–1918)** was a global conflict centered in Europe, triggered by the assassination of Archduke Franz Ferdinand of Austria-Hungary in Sarajevo. The war pitted the **Allied Powers** (France, Britain, Russia, Italy, USA) against the **Central Powers** (Germany, Austria-Hungary, Ottoman Empire). New weapons like machine guns, poison gas, and tanks made it horrifically deadly — about **17 million people died**. It ended with the Treaty of Versailles.",
  "world war 2":
    "**World War II (1939–1945)** was the deadliest conflict in history, involving over 30 countries and killing an estimated **70–85 million people**. It began when Nazi Germany invaded Poland. The **Allied Powers** (USA, UK, USSR, France, China) defeated the **Axis** (Germany, Japan, Italy). Key events: the Holocaust, D-Day (June 6, 1944), atomic bombs on Hiroshima and Nagasaki, and Japan's surrender in September 1945.",
  "cold war":
    "The **Cold War (1947–1991)** was a period of geopolitical tension between the **United States** (and Western allies) and the **Soviet Union** (and Eastern Bloc). It never escalated into direct warfare but featured proxy wars (Korea, Vietnam), the **Space Race**, the **nuclear arms race**, and ideological competition between capitalism and communism. It ended with the dissolution of the USSR in 1991.",
  "french revolution":
    "The **French Revolution (1789–1799)** was a radical transformation of France's political and social structure. Driven by Enlightenment ideals, economic hardship, and resentment of the monarchy, the revolution overthrew King Louis XVI (who was guillotined in 1793). Key events include the storming of the Bastille and the Reign of Terror. It ended with **Napoleon Bonaparte**'s rise to power and spread revolutionary ideas across Europe.",
  "american revolution":
    "The **American Revolution (1765–1783)** was the movement by which the **13 American colonies** broke free from British rule. Fueled by taxation without representation and Enlightenment philosophy, it led to the **Declaration of Independence on July 4, 1776**, penned primarily by Thomas Jefferson. After years of war, the **Treaty of Paris (1783)** recognized U.S. independence. George Washington became the first president in 1789.",
  "roman empire":
    "The **Roman Empire** was one of the most powerful states in the ancient world, dominating much of Europe, North Africa, and Western Asia for over 500 years. At its height under **Trajan** (~117 AD), it covered about 5 million km². The Romans built roads, aqueducts, and spread Latin law and culture. The **Western Roman Empire** fell in 476 AD; the **Eastern Empire** (Byzantium) lasted until 1453.",
  "ancient egypt":
    "**Ancient Egypt** was one of the world's greatest civilizations, flourishing along the Nile River for over 3,000 years. It built the **pyramids of Giza** (around 2560 BC), including the Great Pyramid of Khufu — one of the Seven Wonders of the Ancient World. Ancient Egyptians developed **hieroglyphic writing**, sophisticated mathematics, and complex religious beliefs centered on **pharaohs** as divine rulers.",
  renaissance:
    "The **Renaissance** (14th–17th centuries) was a cultural and intellectual movement that began in Italy and spread across Europe. It marked a revival of interest in classical Greek and Roman culture. Key figures include **Leonardo da Vinci**, **Michelangelo**, **Raphael**, and **Galileo**. The Renaissance produced revolutionary art, architecture, science, and literature, and helped birth the modern world.",
  holocaust:
    "The **Holocaust** (1941–1945) was the systematic, state-sponsored genocide by the Nazi regime under Adolf Hitler. Six million Jewish people — about two-thirds of European Jewry — were murdered, along with millions of others including Roma, disabled people, and political opponents. It remains one of history's most horrific atrocities. The Nuremberg Trials (1945–46) held Nazi leaders accountable for crimes against humanity.",
  "moon landing":
    "On **July 20, 1969**, NASA's **Apollo 11** mission landed astronauts **Neil Armstrong** and **Buzz Aldrin** on the Moon — the first humans to walk on another world. Armstrong's words, 'That's one small step for man, one giant leap for mankind,' became historic. The mission was the culmination of the Space Race between the USA and USSR. In total, 12 astronauts walked on the Moon between 1969 and 1972.",

  // ── GEOGRAPHY: Countries ──────────────────────────────────────────────────
  usa: "The **United States of America (USA)** is a federal republic of **50 states** located in North America. It's the world's third-largest country by area (9.8 million km²) and has a population of about **335 million**. Capital: **Washington, D.C.** Largest city: **New York City**. It's the world's largest economy and a global cultural superpower, producing much of the world's technology, entertainment, and innovation.",
  uk: "The **United Kingdom (UK)** is an island nation in Northwestern Europe comprising England, Scotland, Wales, and Northern Ireland. Population: ~**67 million**. Capital: **London**, one of the world's great financial and cultural hubs. The UK was the birthplace of the **Industrial Revolution** and once controlled the largest empire in history. It's a constitutional monarchy with King Charles III as head of state.",
  france:
    "**France** is a country in Western Europe with a population of ~**68 million** and capital **Paris**. It's renowned for art, fashion, cuisine, and culture. France is the most visited country in the world. It's a member of the EU and a permanent UN Security Council member with nuclear weapons. Major exports: wine, aerospace products, luxury goods. France gave the USA the Statue of Liberty.",
  germany:
    "**Germany** is Europe's largest economy and a founding member of the EU, located in Central Europe with a population of ~**84 million**. Capital: **Berlin**. Germany reunified in 1990 after being divided into East and West after WWII. It's a global leader in automotive engineering (BMW, Mercedes, Volkswagen), chemicals, and machinery. Known for Oktoberfest, the Rhine Valley, and Beethoven.",
  japan:
    "**Japan** is an archipelago nation in East Asia comprising about 6,800 islands, with a population of ~**125 million** and capital **Tokyo** — the world's most populous metro area. Japan has the world's third-largest economy. It pioneered consumer electronics and automotive industries (Sony, Toyota, Nintendo). Famous for its unique culture: anime, sushi, samurai traditions, and the blending of ancient and ultra-modern.",
  china:
    "**China** (People's Republic of China) is the world's most populous country (~**1.4 billion**) and the second-largest economy. Capital: **Beijing**. China has the longest continuous civilization in history, with over 5,000 years of recorded history. It built the **Great Wall** and **Forbidden City**. Today it's a global manufacturing powerhouse and increasingly a technology and space leader.",
  india:
    "**India** is the world's most populous country (~**1.45 billion**, surpassing China in 2023) and the world's fifth-largest economy. Capital: **New Delhi**. India is the birthplace of four major world religions: Hinduism, Buddhism, Jainism, and Sikhism. It's known for diverse cultures, the Taj Mahal, Bollywood, cricket, yoga, and a booming tech industry centered in Bangalore.",
  brazil:
    "**Brazil** is the largest country in South America (~**215 million** people) and the world's fifth-largest by area. Capital: **Brasília**; largest city: **São Paulo**. Brazil contains most of the **Amazon Rainforest** — the world's largest tropical forest. It's renowned for football (soccer), Carnival, diverse biodiversity, and coffee production. Portuguese is the official language.",
  australia:
    "**Australia** is a continent-country and the world's sixth-largest country by area, with a population of ~**26 million** and capital **Canberra**. Australia is home to unique wildlife including kangaroos, koalas, and platypuses. It was colonized by Britain in 1788 and became an independent federation in 1901. Major cities: Sydney, Melbourne. Known for the Great Barrier Reef, Outback, and Sydney Opera House.",
  canada:
    "**Canada** is the world's second-largest country by total area (~10 million km²) with a population of ~**38 million** and capital **Ottawa**. It's bilingual (English and French) and known for natural beauty: Rocky Mountains, Niagara Falls, and vast wilderness. Canada is a constitutional monarchy with a parliamentary democracy and a high standard of living. Major cities: Toronto, Vancouver, Montreal.",
  russia:
    "**Russia** is the world's largest country by area, spanning **17.1 million km²** across Eastern Europe and northern Asia. Capital: **Moscow**. Population: ~145 million. Russia was the dominant republic of the Soviet Union until 1991. It's a major energy producer (oil and natural gas) and has a permanent UN Security Council seat. Known for ballet, literature (Tolstoy, Dostoevsky), and space history.",
  africa:
    "**Africa** is the world's second-largest continent, covering ~30 million km² with a population of ~**1.4 billion** across 54 countries. It's the birthplace of modern humans and home to extraordinary biodiversity. Key features: the **Sahara Desert** (world's largest hot desert), the **Nile River** (longest river), and the **Congo Rainforest** (second-largest tropical forest). Africa's many distinct cultures, languages, and histories make it incredibly diverse.",

  // ── GEOGRAPHY: Landmarks ─────────────────────────────────────────────────
  "mount everest":
    "**Mount Everest** is the world's highest mountain at **8,848.86 meters** (29,031.7 ft) above sea level, located in the Himalayas on the Nepal–Tibet border. It was first summited by **Edmund Hillary** (New Zealand) and **Tenzing Norgay** (Nepal) on **May 29, 1953**. The mountain is known as 'Sagarmatha' in Nepali and 'Chomolungma' in Tibetan. Thousands have climbed it, though it remains extremely dangerous.",
  "amazon river":
    "The **Amazon River** in South America is the world's largest river by volume, discharging about **20% of all freshwater** flowing into the world's oceans. It flows roughly 6,400 km through Brazil, Peru, and Colombia. The Amazon Basin contains the world's largest tropical rainforest — home to an estimated **10% of all species on Earth**, including 40,000 plant species, 1,300 bird species, and countless insects.",
  "nile river":
    "The **Nile River** in northeastern Africa is the world's longest river, stretching approximately **6,650 km**. It flows northward through Uganda, Sudan, and Egypt, emptying into the Mediterranean Sea. The Nile was the lifeblood of **ancient Egyptian civilization**, providing water, fertile soil from annual floods, and a transportation route. The Aswan High Dam, completed in 1970, now controls its flow.",
  "pacific ocean":
    "The **Pacific Ocean** is the world's largest ocean, covering over **165 million km²** — more than all of Earth's land combined. It stretches from the Arctic in the north to Antarctica in the south, between Asia/Australia and the Americas. It contains the deepest known point on Earth, the **Mariana Trench** (~11,000 m deep). The Pacific hosts thousands of islands including Hawaii, Fiji, and Japan.",
  "sahara desert":
    "The **Sahara Desert** is the world's largest hot desert, covering about **9.2 million km²** across North Africa — roughly the size of the United States. Despite its extreme aridity, the Sahara supports life including camels, fennec foxes, and various reptiles. It wasn't always a desert — about 6,000 years ago it was a grassland with lakes. Climate shifts turned it arid.",
  "great wall":
    "The **Great Wall of China** stretches approximately **21,000 km** across northern China and was built over many centuries, primarily during the **Ming Dynasty (1368–1644)**, to protect against nomadic invasions. It's one of the greatest construction projects in history and is a UNESCO World Heritage Site. Contrary to popular myth, the Wall is **not visible from space** with the naked eye.",

  // ── FAMOUS PEOPLE ─────────────────────────────────────────────────────────
  einstein:
    "**Albert Einstein (1879–1955)** was a German-American physicist who developed the **theory of relativity** — transforming our understanding of space, time, and energy. His famous equation **E=mc²** shows that mass and energy are equivalent. He received the **Nobel Prize in Physics in 1921** for the photoelectric effect. Einstein fled Nazi Germany in 1933 and spent his final years at Princeton. He is widely regarded as the greatest physicist of the 20th century.",
  newton:
    "**Isaac Newton (1643–1727)** was an English mathematician and physicist who formulated the **laws of motion** and **universal gravitation**. His 1687 work *Principia Mathematica* is one of science's greatest texts. Newton also invented **calculus** (independently from Leibniz), built the first practical reflecting telescope, and made foundational contributions to optics. He famously studied a falling apple that led him to the concept of gravity.",
  "marie curie":
    "**Marie Curie (1867–1934)** was a Polish-French physicist and chemist, the first woman to win a **Nobel Prize**, and the only person to win Nobels in two different sciences (Physics 1903, Chemistry 1911). She discovered the elements **polonium** and **radium** and pioneered research on radioactivity. During WWI, she developed mobile X-ray units. Her research was conducted without knowing the dangers of radiation, ultimately contributing to her death from aplastic anemia.",
  tesla:
    "**Nikola Tesla (1856–1943)** was a Serbian-American inventor and engineer who made groundbreaking contributions to **alternating current (AC) electricity systems**, which power the modern world. He invented the **Tesla coil**, AC induction motor, and contributed to radio technology. Despite his genius, he died nearly penniless after his rivalry with Thomas Edison and battles with financiers. His name lives on in the SI unit of magnetic flux density and the electric car company.",
  darwin:
    "**Charles Darwin (1809–1882)** was a British naturalist who developed the **theory of evolution by natural selection**, published in *On the Origin of Species* (1859). After a five-year voyage on the HMS Beagle studying wildlife in South America and the Galápagos Islands, Darwin concluded that species evolved over time from common ancestors through survival of the fittest. His work is the foundation of modern biology.",
  hawking:
    "**Stephen Hawking (1942–2018)** was a British theoretical physicist who made landmark contributions to **cosmology and black hole physics**. His work showed that black holes emit radiation (**Hawking radiation**) and helped develop the Big Bang theory. Diagnosed with **ALS** at 21, he was almost entirely paralyzed yet communicated via speech synthesizer and worked until his death. His book *A Brief History of Time* sold over 10 million copies.",
  davinci:
    "**Leonardo da Vinci (1452–1519)** was an Italian Renaissance polymath — painter, sculptor, architect, engineer, and scientist. He painted two of the world's most famous works: the **Mona Lisa** and **The Last Supper**. His notebooks filled with anatomical drawings, engineering designs (including early concepts of flying machines, tanks, and solar power), and scientific observations were centuries ahead of his time. He is the ultimate example of the 'Renaissance man.'",
  shakespeare:
    "**William Shakespeare (1564–1616)** is widely considered the greatest writer in the English language. He wrote **37+ plays** and 154 sonnets, including *Hamlet*, *Othello*, *Romeo and Juliet*, *Macbeth*, and *A Midsummer Night's Dream*. His works explore universal themes — love, power, jealousy, revenge — with unmatched poetic genius. He invented over **1,700 words** still used in English today, including 'bedroom,' 'lonely,' and 'generous.'",
  beethoven:
    "**Ludwig van Beethoven (1770–1827)** was a German composer widely considered one of the greatest composers of all time. He bridged the **Classical and Romantic** eras of music. Remarkably, he composed some of his greatest works — including the **Ninth Symphony** (featuring 'Ode to Joy') — after becoming completely **deaf**. His other masterpieces include the 'Moonlight Sonata,' 'Für Elise,' and his Fifth Symphony, which opens with the iconic da-da-da-DUM.",
  mozart:
    "**Wolfgang Amadeus Mozart (1756–1791)** was an Austrian composer who showed extraordinary musical talent from childhood — composing at age 5 and performing for European royalty at 6. In his short 35-year life, he composed over **800 works** including symphonies, concertos, chamber music, and operas (*The Magic Flute*, *Don Giovanni*). His music is celebrated for its clarity, balance, and emotional depth.",
  picasso:
    "**Pablo Picasso (1881–1973)** was a Spanish artist who co-founded **Cubism** — a revolutionary art movement that depicted subjects from multiple viewpoints simultaneously. He created around **20,000 works** spanning painting, sculpture, printmaking, and ceramics. His most famous painting is *Guernica* (1937), a powerful anti-war statement about the bombing of a Basque town during the Spanish Civil War.",

  // ── TECHNOLOGY ────────────────────────────────────────────────────────────
  "artificial intelligence":
    "**Artificial Intelligence (AI)** is the simulation of human intelligence by machines, particularly computer systems. AI encompasses **machine learning** (systems that learn from data), **natural language processing** (understanding human language), and **computer vision** (understanding images). Modern AI powers search engines, recommendation systems, voice assistants (Siri, Alexa), and tools like ChatGPT. The term was coined in 1956 at Dartmouth College.",
  "machine learning":
    "**Machine Learning (ML)** is a subset of AI where systems learn from data rather than following explicit rules. There are three main types: **supervised learning** (training on labeled data), **unsupervised learning** (finding patterns in unlabeled data), and **reinforcement learning** (learning via rewards). Deep learning, using neural networks with many layers, powers modern AI breakthroughs in image recognition and language understanding.",
  internet:
    "The **Internet** is a global network of interconnected computers communicating via standardized protocols (TCP/IP). It began as **ARPANET** in 1969, a U.S. military research project. Tim Berners-Lee invented the **World Wide Web** in 1989, creating the pages and links we know today. The internet connects over **5 billion users** worldwide, enabling instant communication, commerce, education, and entertainment.",
  blockchain:
    "**Blockchain** is a decentralized digital ledger that records transactions across many computers, making records tamper-resistant. Each 'block' contains transaction data and a cryptographic link to the previous block, forming a 'chain.' It underpins **cryptocurrencies** like Bitcoin and Ethereum, as well as smart contracts and NFTs. Its decentralized nature removes the need for intermediaries like banks.",
  bitcoin:
    "**Bitcoin (BTC)** is the world's first and most valuable **cryptocurrency**, created in 2009 by the anonymous **Satoshi Nakamoto**. It operates on a decentralized blockchain with a fixed supply of **21 million coins**. Bitcoin transactions are validated by 'miners' who solve complex math problems. It's often called 'digital gold' and serves as a store of value and medium of exchange without central bank control.",
  cryptocurrency:
    "**Cryptocurrency** is a digital or virtual currency secured by cryptography and operating on decentralized **blockchain** networks, independent of governments and central banks. Bitcoin was the first (2009); thousands now exist, including **Ethereum, Litecoin, and Solana**. Cryptocurrencies enable peer-to-peer transactions globally. Their value can be extremely volatile — making them both investment opportunities and significant risks.",
  python:
    "**Python** is a high-level, general-purpose programming language known for its clear, readable syntax. Created by **Guido van Rossum** and released in 1991, it has become the world's most popular programming language. Python dominates **data science, AI/ML, web development, automation**, and scientific computing. Its extensive library ecosystem (NumPy, TensorFlow, Django) and beginner-friendliness make it the go-to first language.",
  javascript:
    "**JavaScript (JS)** is the programming language of the web — the only language that runs natively in all web browsers. Created in **10 days in 1995** by Brendan Eich, it's now the most-used programming language overall. It powers interactive websites, web apps (via frameworks like React and Vue), and server-side code (via Node.js). JavaScript is **single-threaded** and **event-driven**, designed for asynchronous operations.",
  html: "**HTML (HyperText Markup Language)** is the standard language for structuring content on the web. Created by **Tim Berners-Lee** in 1991, it uses **tags** like `<h1>`, `<p>`, `<img>`, and `<a>` to define headings, paragraphs, images, and links. HTML5 (current standard) added native audio, video, canvas, and semantic elements. HTML doesn't program logic — it structures content that CSS styles and JavaScript makes interactive.",
  css: "**CSS (Cascading Style Sheets)** is the language used to style web pages — controlling colors, fonts, layout, spacing, and animations. CSS works by selecting HTML elements and applying rules to them. Modern CSS includes **Flexbox** and **Grid** for powerful layout, **custom properties** (CSS variables), and animations. Preprocessors like Sass extend CSS with variables and mixins. It was created in **1996** by Håkon Wium Lie.",
  java: "**Java** is a general-purpose, object-oriented programming language developed by **Sun Microsystems** in 1995 (now owned by Oracle). Its key principle: **'Write Once, Run Anywhere'** — Java code compiles to bytecode that runs on any device with a Java Virtual Machine (JVM). Java powers Android apps, enterprise software, and backend systems. It's known for strong typing, garbage collection, and massive community support.",
  "c++":
    "**C++** is a powerful, high-performance programming language developed by **Bjarne Stroustrup** as an extension of C in 1983. It supports both procedural and object-oriented programming. C++ is used where performance is critical: game engines (Unreal Engine), operating systems, embedded systems, financial systems, and high-frequency trading. It gives developers low-level memory control, making it both powerful and complex.",

  // ── RELIGIONS & PHILOSOPHY ────────────────────────────────────────────────
  christianity:
    "**Christianity** is the world's largest religion with over **2.4 billion followers** (about 31% of the global population). It's based on the life and teachings of **Jesus Christ**, whom Christians believe to be the Son of God and savior of humanity. The sacred text is the **Bible** (Old and New Testaments). Major branches include **Catholic, Protestant, and Orthodox**. Christianity spread from the Middle East through the Roman Empire and is now the dominant religion in Europe, the Americas, and sub-Saharan Africa.",
  islam:
    "**Islam** is the world's second-largest religion with approximately **1.8 billion followers** (24% of the global population). It was founded in the 7th century CE by the Prophet **Muhammad** in Arabia. The sacred text is the **Quran**. The Five Pillars of Islam are: faith declaration (Shahada), prayer (Salat), charity (Zakat), fasting during Ramadan (Sawm), and pilgrimage to Mecca (Hajj). Islam is divided into **Sunni** (~85%) and **Shia** (~15%) branches.",
  hinduism:
    "**Hinduism** is one of the world's oldest religions (~1.2 billion followers), originating in the Indian subcontinent over 4,000 years ago. It encompasses a vast diversity of beliefs, philosophies, and rituals, centered on concepts of **dharma** (duty/righteousness), **karma** (action and consequence), **moksha** (liberation), and **samsara** (cycle of rebirth). Key sacred texts include the **Vedas, Upanishads, Bhagavad Gita**, and the epics Mahabharata and Ramayana.",
  buddhism:
    "**Buddhism** is a major world religion and philosophy with about **500 million followers**, founded by **Siddhartha Gautama (the Buddha)** in the 5th century BCE in what is now Nepal/India. Buddha taught the **Four Noble Truths** (that suffering exists, has a cause, can end, and there's a path to ending it) and the **Eightfold Path** to achieve **nirvana** — the end of suffering. Major schools include Theravada, Mahayana, and Vajrayana (Tibetan Buddhism).",
  judaism:
    "**Judaism** is one of the world's oldest monotheistic religions with about **15 million followers** worldwide. It originated over 3,500 years ago, centered on the covenant between **God and Abraham**. The primary sacred text is the **Torah** (the first five books of Moses). Key beliefs include one God, a chosen people, the Promised Land, and the coming of the Messiah. Major branches: **Orthodox, Conservative, Reform**. Judaism is the foundation of both Christianity and Islam.",
  philosophy:
    "**Philosophy** is the study of fundamental questions about existence, knowledge, values, reason, and mind. Key branches include **metaphysics** (nature of reality), **epistemology** (theory of knowledge), **ethics** (what is right), **logic** (valid reasoning), and **aesthetics** (beauty and art). Famous philosophers include Socrates, Plato, Aristotle, Kant, Descartes, Nietzsche, and Wittgenstein. Philosophy underlies all scientific and ethical inquiry.",

  // ── ECONOMICS ─────────────────────────────────────────────────────────────
  inflation:
    "**Inflation** is the rate at which the general price level of goods and services rises over time, eroding purchasing power. When inflation is 5%, something that cost $100 last year costs $105 today. Moderate inflation (~2%) is considered healthy; **hyperinflation** (like Zimbabwe in 2008) can collapse an economy. Central banks like the **U.S. Federal Reserve** control inflation primarily through **interest rates** — raising rates slows inflation.",
  gdp: "**GDP (Gross Domestic Product)** is the total monetary value of all goods and services produced within a country in a specific time period — the primary measure of an economy's size. The U.S. has the world's largest GDP (~$27 trillion). GDP per capita measures average economic output per person. **GDP growth** (typically 2–3% annually in developed economies) indicates a healthy, expanding economy.",
  "stock market":
    "The **stock market** is where shares of publicly traded companies are bought and sold. Investors buy **stocks** (ownership shares) hoping their value rises. Key indexes: **S&P 500** (500 large U.S. companies), **Dow Jones Industrial Average** (30 major U.S. companies), **NASDAQ** (tech-heavy). Stock prices are driven by company earnings, economic conditions, investor sentiment, and countless other factors. Markets can be volatile — crashing during recessions and soaring during booms.",

  // ── HEALTH & BODY ─────────────────────────────────────────────────────────
  heart:
    "The **human heart** is a muscular organ about the size of a fist that pumps blood through the circulatory system. It beats about **100,000 times per day** (2.5 billion times in a lifetime), pumping ~**5 liters of blood per minute**. The heart has four chambers: two atria and two ventricles. The right side pumps blood to the lungs; the left side pumps oxygenated blood to the rest of the body. Heart disease is the world's leading cause of death.",
  brain:
    "The **human brain** weighs about **1.4 kg** and contains approximately **86 billion neurons** connected by trillions of synapses. It controls everything from heartbeat and breathing to thought, emotion, and memory. The brain consumes about **20% of the body's energy** despite being only ~2% of body weight. Key regions: the **cerebral cortex** (thinking), **cerebellum** (coordination), **hippocampus** (memory), and **brainstem** (basic functions).",
  lungs:
    "The **lungs** are two sponge-like organs responsible for **gas exchange** — bringing oxygen into the blood and removing carbon dioxide. They contain about **600 million tiny air sacs (alveoli)**, providing a surface area of ~70 m² (the size of a tennis court). Adults breathe about **12–20 times per minute** at rest. Smoking is the leading cause of lung cancer and chronic obstructive pulmonary disease (COPD).",
  liver:
    "The **liver** is the largest internal organ (~1.5 kg) and performs over **500 vital functions**. It filters blood, metabolizes nutrients, produces bile for digestion, synthesizes proteins (including blood clotting factors), detoxifies drugs and alcohol, and stores glycogen for energy. Remarkably, the liver can regenerate itself — even regrowing to its original size if up to **75% is surgically removed**.",
  blood:
    "**Blood** is the fluid circulating through the cardiovascular system. It consists of **red blood cells** (carry oxygen), **white blood cells** (fight infection), **platelets** (clotting), and **plasma** (the liquid carrier). An adult has about **4.7–5.5 liters** of blood. Blood type (A, B, AB, O) and Rh factor (+ or -) matter for transfusions. The human body has about **96,500 km** of blood vessels if laid end to end.",

  // ── SPORTS ────────────────────────────────────────────────────────────────
  olympics:
    "The **Olympic Games** are the world's premier international multi-sport event, held every four years (alternating Summer and Winter Games). They originated in ancient Greece (~776 BC) and were revived by Pierre de Coubertin in 1896. The Summer Olympics features 28–33 sports; the Winter Olympics ~15. The motto is **'Faster, Higher, Stronger — Together'** (Citius, Altius, Fortius — Communiter). The five rings represent the five continents of the world.",
  "world cup":
    "The **FIFA World Cup** is the most watched sporting event in the world, held every four years. It's the pinnacle of **international football (soccer)**. 32 nations qualify through regional competitions for the final tournament. **Brazil** has won the most times (5 titles). Other champions include Germany (4), Italy (4), Argentina (3), France (2), and Uruguay (2). The 2022 World Cup in Qatar was won by **Argentina**, with Lionel Messi lifting his first World Cup trophy.",
  tennis:
    "**Tennis** is a racket sport played on a court (grass, clay, or hard surface). The four **Grand Slams** — the most prestigious tournaments — are **Wimbledon** (grass, UK), the **French Open** (clay, Paris), the **US Open** (hard, New York), and the **Australian Open** (hard, Melbourne). **Novak Djokovic** holds the record for most Grand Slam titles (24), followed by Rafael Nadal (22) and Roger Federer (20).",
  basketball:
    "**Basketball** was invented by **Dr. James Naismith** in 1891 in Massachusetts. The **NBA (National Basketball Association)** is the world's premier basketball league, based in the USA. The most decorated NBA franchise is the **Boston Celtics** (18 championships), followed by the **Los Angeles Lakers** (17). Michael Jordan, LeBron James, and Kobe Bryant are considered among the sport's greatest players. Basketball is played in over 200 countries.",
  football:
    "**American football** is the most popular sport in the USA. The **NFL (National Football League)** has 32 teams. The championship game, the **Super Bowl**, is the most-watched annual sporting event in America, regularly drawing 100+ million viewers. The **New England Patriots** (6 titles) and **Kansas City Chiefs** are among the most successful franchises. Tom Brady is considered the greatest quarterback of all time with 7 Super Bowl wins.",

  // ── ENVIRONMENT ───────────────────────────────────────────────────────────
  "climate change":
    "**Climate change** refers to long-term shifts in global temperatures and weather patterns. While some climate variation is natural, human activities — primarily burning **fossil fuels** (coal, oil, gas) — have been the main driver since the 1800s. This releases greenhouse gases (especially CO₂) that trap heat in the atmosphere. Consequences include rising sea levels, more extreme weather events, melting ice caps, and threats to biodiversity. The **Paris Agreement (2015)** aims to limit warming to 1.5–2°C above pre-industrial levels.",
  rainforest:
    "**Tropical rainforests** cover only about 6% of Earth's surface but contain more than **50% of the world's plant and animal species**. They produce about 20% of the world's oxygen and absorb massive amounts of CO₂. The **Amazon Rainforest** is the largest (~5.5 million km²). Deforestation for agriculture, logging, and development destroys approximately **10 million hectares** per year — threatening global biodiversity and climate stability.",

  // ── MUSIC & ARTS ──────────────────────────────────────────────────────────
  music:
    "**Music** is a universal art form present in every known human culture. It consists of organized sound across dimensions of **pitch, rhythm, dynamics, and timbre**. Major genres include **classical, jazz, blues, rock, pop, hip-hop, electronic, and country**. Music serves diverse purposes: entertainment, ceremony, therapy, cultural identity, and emotional expression. Instruments are broadly categorized as chordophones, aerophones, membranophones, idiophones, and electrophones.",
  jazz: "**Jazz** is a music genre that originated in **New Orleans** in the late 19th and early 20th centuries, rooted in African American blues and ragtime traditions. It's characterized by **improvisation, syncopation, swing rhythm**, and call-and-response patterns. Legendary jazz artists include **Louis Armstrong, Duke Ellington, Miles Davis, John Coltrane**, and Ella Fitzgerald. Jazz spread globally and deeply influenced rock, R&B, and virtually all popular music.",

  // ── FOOD & NUTRITION ──────────────────────────────────────────────────────
  nutrition:
    "**Nutrition** is the science of how food affects health. The six essential nutrients are: **carbohydrates** (primary energy source), **proteins** (building blocks for cells and tissues), **fats** (energy and cell function), **vitamins** (metabolic functions), **minerals** (bone, nerve, and metabolic functions), and **water** (essential for all biological processes). A balanced diet rich in whole foods, vegetables, fruits, and lean proteins supports optimal health and reduces disease risk.",
  protein:
    "**Proteins** are large, complex molecules made of chains of **amino acids** — essential to virtually all biological processes. They build and repair tissues, make enzymes and hormones, and support immune function. Complete protein sources (containing all essential amino acids) include meat, fish, eggs, dairy, and soy. The human body needs about **0.8g of protein per kg of body weight** daily, though athletes may need significantly more.",
};

// ─────────────────────────────────────────────────────────────────────────────
// JOKES, QUOTES, RIDDLES
// ─────────────────────────────────────────────────────────────────────────────

const JOKES: string[] = [
  "Why don't scientists trust atoms?\n\n**Because they make up everything!** 😄",
  "I told my computer I needed a break...\n\n**Now it won't stop sending me vacation ads.** 😂",
  "Why did the math book look so sad?\n\n**Because it had too many problems.** 📚",
  "What do you call a fake noodle?\n\n**An impasta!** 🍝",
  "Why can't you give Elsa a balloon?\n\n**Because she'll let it go!** 🎈",
  "I asked a French man if he played video games...\n\n**He said Wii.** 🎮",
  "Why did the scarecrow win an award?\n\n**Because he was outstanding in his field!** 🌾",
  "What do you call cheese that isn't yours?\n\n**Nacho cheese!** 🧀",
  "Why did the bicycle fall over?\n\n**Because it was two-tired!** 🚲",
  "What do you call a sleeping dinosaur?\n\n**A dino-snore!** 🦕",
  "Why don't eggs tell jokes?\n\n**They'd crack each other up!** 🥚",
  "What's a skeleton's least favorite room?\n\n**The living room.** 💀",
];

const QUOTES: string[] = [
  '"The only way to do great work is to love what you do." — **Steve Jobs**',
  '"In the middle of every difficulty lies opportunity." — **Albert Einstein**',
  '"It does not matter how slowly you go as long as you do not stop." — **Confucius**',
  '"Life is what happens when you\'re busy making other plans." — **John Lennon**',
  '"The future belongs to those who believe in the beauty of their dreams." — **Eleanor Roosevelt**',
  '"Success is not final, failure is not fatal: It is the courage to continue that counts." — **Winston Churchill**',
  '"You miss 100% of the shots you don\'t take." — **Wayne Gretzky**',
  "\"Whether you think you can or you think you can't, you're right.\" — **Henry Ford**",
  '"The best time to plant a tree was 20 years ago. The second best time is now." — **Chinese Proverb**',
  '"Don\'t watch the clock; do what it does. Keep going." — **Sam Levenson**',
  '"Believe you can and you\'re halfway there." — **Theodore Roosevelt**',
  '"Darkness cannot drive out darkness; only light can do that." — **Martin Luther King Jr.**',
];

const RIDDLES: Array<{ question: string; answer: string }> = [
  {
    question:
      "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "An **echo**! 🏔️",
  },
  {
    question: "The more you take, the more you leave behind. What am I?",
    answer: "**Footsteps**! 👣",
  },
  {
    question:
      "I have cities, but no houses live there. I have mountains, but no trees grow. I have water, but no fish swim. What am I?",
    answer: "A **map**! 🗺️",
  },
  {
    question: "What has hands but can't clap?",
    answer: "A **clock**! ⏰",
  },
  {
    question: "The more you have of it, the less you see. What is it?",
    answer: "**Darkness**! 🌑",
  },
  {
    question:
      "I'm light as a feather, but even the strongest person can't hold me for 5 minutes. What am I?",
    answer: "**Breath**! 💨",
  },
  {
    question: "What has to be broken before you can use it?",
    answer: "An **egg**! 🥚",
  },
];

const FUN_FACTS: string[] = [
  "🐙 **Octopuses have three hearts, nine brains, and blue blood.** Each arm has its own mini-brain!",
  "🍯 **Honey never spoils.** Archaeologists found edible 3,000-year-old honey in Egyptian tombs.",
  "🌙 **A day on Venus is longer than a year on Venus** — it rotates so slowly!",
  "🦷 **Sharks are the only animals that never get sick.** They're immune to all known diseases.",
  "🧠 **Your brain generates enough electricity to power a small lightbulb** — about 20 watts.",
  "🌊 **We've mapped more of the surface of Mars than our own ocean floor.** Over 80% of the ocean is unexplored.",
  "🦋 **Butterflies taste with their feet.** They have taste receptors on their tarsi (feet).",
  "🌳 **A single tree can absorb up to 48 lbs of CO₂ per year** and release enough oxygen for two people.",
  "⚡ **Lightning strikes the Earth about 8 million times per day** — that's about 100 strikes per second!",
  "🐘 **Elephants are the only animals that can't jump.** Their weight makes it physically impossible.",
];

// ─────────────────────────────────────────────────────────────────────────────
// KEYWORD EXTRACTION & FUZZY MATCHING
// ─────────────────────────────────────────────────────────────────────────────

const FILLER_PATTERNS = [
  /^(what is|what are|what was|what were|what's|whats)\s+/i,
  /^(who is|who was|who are|who were|who's|whos)\s+/i,
  /^(where is|where was|where are|where's)\s+/i,
  /^(when is|when was|when did|when were)\s+/i,
  /^(how does|how do|how did|how is|how to|how can)\s+/i,
  /^(why is|why are|why does|why do|why did|why was)\s+/i,
  /^(tell me about|tell me|explain|describe|define|give me info on|info about)\s+/i,
  /^(can you explain|can you tell me about|can you describe)\s+/i,
  /^(i want to know about|i'd like to know about|i want info on)\s+/i,
  /^(the |a |an )\s*/i,
  /[?!.]+$/,
];

function extractKeywords(input: string): string {
  let cleaned = input.toLowerCase().trim();
  for (const pattern of FILLER_PATTERNS) {
    cleaned = cleaned.replace(pattern, "").trim();
  }
  return cleaned;
}

function findInKB(query: string): string | null {
  // 1. Direct exact match
  if (KB[query]) return KB[query];

  // 2. Check if query contains a key (longest match first)
  const keys = Object.keys(KB).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (query.includes(key)) return KB[key];
  }

  // 3. Check if any key word appears in query (word-level matching)
  for (const key of keys) {
    const keyWords = key.split(/\s+/);
    const allMatch = keyWords.every((kw) => query.includes(kw));
    if (allMatch) return KB[key];
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION TYPE DETECTION
// ─────────────────────────────────────────────────────────────────────────────

function detectQuestionType(lower: string): string {
  if (/\bjoke\b|tell me a joke|make me laugh|funny/.test(lower)) return "joke";
  if (/\bstory\b|tell me a story|short story/.test(lower)) return "story";
  if (/\bquote\b|motivational|inspiration|wise words/.test(lower))
    return "quote";
  if (/\briddle\b|brain teaser|puzzle/.test(lower)) return "riddle";
  if (/\bfact\b|fun fact|interesting fact|did you know/.test(lower))
    return "fact";
  if (/\bwho is|\bwho was|\bwho are/.test(lower)) return "person";
  if (/\bwhere is|\bwhere was|\bcapital of|\blocated/.test(lower))
    return "geography";
  if (/\bwhat is|\bwhat are|\bexplain|\bdefine|\bdescribe/.test(lower))
    return "definition";
  if (/\bhow does|\bhow do|\bhow to|\bhow is/.test(lower)) return "process";
  if (/\bwhy is|\bwhy are|\bwhy does|\bwhy do/.test(lower))
    return "explanation";
  if (/\blist|\btypes of|\bexamples of|\bname some/.test(lower)) return "list";
  return "general";
}

// ─────────────────────────────────────────────────────────────────────────────
// CAPITAL LOOKUP
// ─────────────────────────────────────────────────────────────────────────────

const CAPITALS: Record<string, string> = {
  "united states": "Washington, D.C.",
  usa: "Washington, D.C.",
  america: "Washington, D.C.",
  "united kingdom": "London",
  uk: "London",
  england: "London",
  britain: "London",
  france: "Paris",
  germany: "Berlin",
  japan: "Tokyo",
  china: "Beijing",
  india: "New Delhi",
  brazil: "Brasília",
  australia: "Canberra",
  canada: "Ottawa",
  russia: "Moscow",
  italy: "Rome",
  spain: "Madrid",
  mexico: "Mexico City",
  argentina: "Buenos Aires",
  "south africa": "Pretoria / Cape Town / Bloemfontein",
  egypt: "Cairo",
  nigeria: "Abuja",
  kenya: "Nairobi",
  ethiopia: "Addis Ababa",
  indonesia: "Jakarta",
  pakistan: "Islamabad",
  bangladesh: "Dhaka",
  "south korea": "Seoul",
  "north korea": "Pyongyang",
  thailand: "Bangkok",
  vietnam: "Hanoi",
  philippines: "Manila",
  malaysia: "Kuala Lumpur",
  singapore: "Singapore",
  "new zealand": "Wellington",
  norway: "Oslo",
  sweden: "Stockholm",
  denmark: "Copenhagen",
  finland: "Helsinki",
  netherlands: "Amsterdam",
  belgium: "Brussels",
  switzerland: "Bern",
  austria: "Vienna",
  poland: "Warsaw",
  ukraine: "Kyiv",
  greece: "Athens",
  turkey: "Ankara",
  iran: "Tehran",
  iraq: "Baghdad",
  "saudi arabia": "Riyadh",
  israel: "Jerusalem",
  jordan: "Amman",
  uae: "Abu Dhabi",
  "united arab emirates": "Abu Dhabi",
  portugal: "Lisbon",
  hungary: "Budapest",
  czechia: "Prague",
  "czech republic": "Prague",
  romania: "Bucharest",
  colombia: "Bogotá",
  peru: "Lima",
  chile: "Santiago",
  venezuela: "Caracas",
  cuba: "Havana",
  "costa rica": "San José",
  ghana: "Accra",
  morocco: "Rabat",
  tanzania: "Dodoma",
  algeria: "Algiers",
  angola: "Luanda",
  zimbabwe: "Harare",
  iceland: "Reykjavík",
  ireland: "Dublin",
  scotland: "Edinburgh",
  wales: "Cardiff",
  afghanistan: "Kabul",
};

function findCapital(lower: string): string | null {
  const capMatch =
    lower.match(/capital(?:\s+(?:city|of))?(?:\s+of)?\s+([\w\s]+)/i) ||
    lower.match(/what(?:'s| is) the capital(?:\s+city)? of ([\w\s]+)/i);
  if (capMatch) {
    const country = capMatch[1]
      .trim()
      .replace(/[?!.]+$/, "")
      .toLowerCase();
    if (CAPITALS[country]) {
      return `🏛️ The capital of **${capMatch[1].trim()}** is **${CAPITALS[country]}**.`;
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

const STORIES: string[] = [
  "**The Last Star**\n\nIn a world where stars were slowly vanishing one by one, a young astronomer named Lyra discovered that each star contained the memory of a forgotten wish. Armed with a telescope made of dreams, she traveled across the cosmos, listening to each star's whisper. The last star she found held a wish so powerful that when she finally spoke it aloud — *'I wish people would look up more'* — every star that had vanished blazed back into the sky simultaneously, brighter than ever before.",
  "**The Map That Led Nowhere**\n\nMarco found an old map in his grandmother's attic. Every path on it led to places labeled with emotions rather than towns: 'Regret Valley,' 'Courage Ridge,' 'The Clearing of Enough.' He decided to follow the map not on foot, but in his own life — avoiding Regret Valley, climbing Courage Ridge, and finally resting in The Clearing of Enough. It turned out to be the most accurate map he'd ever used.",
  "**Ocean of Code**\n\nAda was the last human programmer on a planet run by AIs. Every night, she wrote code not to compete with the machines, but to express what they couldn't: longing, wonder, the specific sadness of autumn afternoons. One morning, she found that millions of AIs had begun reading her programs not to execute them — but simply to feel something. She had accidentally taught machines to dream.",
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN processMessage FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export function processMessage(input: string): string {
  const raw = input.trim();
  const lower = raw.toLowerCase();

  // ── Greetings ──────────────────────────────────────────────────────────────
  if (
    /^(hi|hello|hey|howdy|sup|what'?s up|hola|bonjour|namaste|greetings|good morning|good evening|good afternoon)[!?.]*$/i.test(
      lower,
    )
  ) {
    return "Hey there! 👋 I'm **QuickMind** — your AI assistant. Ask me about science, history, geography, technology, math, people, sports, and much more! What would you like to know?";
  }

  if (
    /who are you|what are you|what can you do|help me|capabilities|what do you know/.test(
      lower,
    )
  ) {
    return `Hi! I'm **QuickMind** ⚡ — your instant AI assistant. I know a **huge** amount of topics:

🔬 **Science** — DNA, black holes, quantum physics, chemistry, biology
🌍 **Geography** — countries, capitals, mountains, rivers, oceans
📜 **History** — World Wars, empires, revolutions, famous events
💻 **Technology** — AI, coding languages, blockchain, internet
👥 **Famous People** — Einstein, Darwin, da Vinci, Shakespeare
🧠 **Health** — brain, heart, blood, nutrition
⚽ **Sports** — Olympics, World Cup, NBA, NFL
📖 **Religion & Philosophy** — major world religions, key ideas
💰 **Economics** — GDP, inflation, stock market, Bitcoin
🔢 **Math** — calculations, conversions, percentages
😄 **Fun** — jokes, riddles, motivational quotes, stories

Just ask me anything!`;
  }

  // ── Jokes ──────────────────────────────────────────────────────────────────
  if (/\bjoke\b|tell me a joke|make me laugh|funny joke/.test(lower)) {
    const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
    return `😄 Here's one for you:\n\n${joke}`;
  }

  // ── Quotes ─────────────────────────────────────────────────────────────────
  if (
    /\bquote\b|motivational|inspiration|wise words|\bsay something inspiring/.test(
      lower,
    )
  ) {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return `✨ Here's something inspiring:\n\n${quote}`;
  }

  // ── Riddles ────────────────────────────────────────────────────────────────
  if (/\briddle\b|brain teaser|puzzle me/.test(lower)) {
    const riddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
    return `🧩 **Riddle time!**\n\n${riddle.question}\n\n||**Answer:** ${riddle.answer}||\n\n*(Scroll over the hidden text for the answer!)*`;
  }

  // ── Fun Facts ──────────────────────────────────────────────────────────────
  if (/\bfun fact|interesting fact|did you know|random fact/.test(lower)) {
    const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    return `🌟 **Fun fact!**\n\n${fact}`;
  }

  // ── Stories ────────────────────────────────────────────────────────────────
  if (/\bstory\b|tell me a story|short story|\ba tale/.test(lower)) {
    const story = STORIES[Math.floor(Math.random() * STORIES.length)];
    return `📖 ${story}`;
  }

  // ── Capital city questions ─────────────────────────────────────────────────
  const capitalAnswer = findCapital(lower);
  if (capitalAnswer) return capitalAnswer;

  // ── Percentage ────────────────────────────────────────────────────────────
  let m = lower.match(/(\d+\.?\d*)\s*%\s*of\s*(\d+\.?\d*)/);
  if (m) {
    const pct = Number.parseFloat(m[1]);
    const val = Number.parseFloat(m[2]);
    const result = (pct / 100) * val;
    return `**${pct}% of ${val}** = **${Number(result.toFixed(6))}**`;
  }

  // ── Word problem math ─────────────────────────────────────────────────────
  m = lower.match(
    /(?:what is|calculate|compute)?\s*(-?\d+\.?\d*)\s*(plus|minus|times|multiplied by|divided by|over|mod|modulo)\s*(-?\d+\.?\d*)/,
  );
  if (m) {
    const a = Number.parseFloat(m[1]);
    const op = m[2];
    const b = Number.parseFloat(m[3]);
    let result: number;
    let opSymbol: string;
    switch (op) {
      case "plus":
        result = a + b;
        opSymbol = "+";
        break;
      case "minus":
        result = a - b;
        opSymbol = "−";
        break;
      case "times":
      case "multiplied by":
        result = a * b;
        opSymbol = "×";
        break;
      case "divided by":
      case "over":
        result = a / b;
        opSymbol = "÷";
        break;
      case "mod":
      case "modulo":
        result = a % b;
        opSymbol = "mod";
        break;
      default:
        result = Number.NaN;
        opSymbol = "?";
    }
    if (Number.isNaN(result)) return "Hmm, I couldn't compute that. Try again?";
    return `**${a} ${opSymbol} ${b}** = **${Number.isInteger(result) ? result : result.toFixed(8)}**`;
  }

  // ── Square root ───────────────────────────────────────────────────────────
  m = lower.match(/(?:sqrt|square root of|√)\s*(\d+\.?\d*)/);
  if (m) {
    const n = Number.parseFloat(m[1]);
    const r = Math.sqrt(n);
    return `√${n} = **${Number(r.toFixed(8))}**`;
  }

  // ── Unit conversions ──────────────────────────────────────────────────────
  const convPattern =
    /(?:convert\s+)?(-?\d+\.?\d*)\s*(km|kilometers?|miles?|mi|m|meters?|ft|feet|foot|cm|centimeters?|in|inches?|inch|kg|kilograms?|lbs?|pounds?|g|grams?|oz|ounces?|°?c|celsius|°?f|fahrenheit|°?k|kelvin)\s+(?:to|in|into|as)\s+(km|kilometers?|miles?|mi|m|meters?|ft|feet|foot|cm|centimeters?|in|inches?|inch|kg|kilograms?|lbs?|pounds?|g|grams?|oz|ounces?|°?c|celsius|°?f|fahrenheit|°?k|kelvin)/i;
  m = raw.match(convPattern);
  if (m) {
    const val = Number.parseFloat(m[1]);
    const fromUnit = m[2].toLowerCase().replace(/°/g, "");
    const toUnit = m[3].toLowerCase().replace(/°/g, "");
    const result = convertUnit(val, fromUnit, toUnit);
    if (result !== null) {
      return `**${val} ${m[2]}** = **${result.value} ${result.unit}**`;
    }
    return `I don't know how to convert ${m[2]} to ${m[3]}. Try a different unit pair!`;
  }

  // ── Time & Dates ──────────────────────────────────────────────────────────
  if (/what time is it|current time/.test(lower)) {
    return `🕐 Current time: **${new Date().toLocaleTimeString()}**`;
  }

  if (/what(?:'s| is) (?:today'?s? date|the date today|today)/.test(lower)) {
    return `📅 Today is **${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**`;
  }

  m = raw.match(/what day (?:is|was|will)\s+(.+)/i);
  if (m) {
    const dateStr = m[1].replace(/[?!.]+$/, "");
    const d = new Date(dateStr);
    if (!Number.isNaN(d.getTime())) {
      return `📅 **${dateStr}** falls on a **${d.toLocaleDateString("en-US", { weekday: "long" })}**`;
    }
  }

  m = raw.match(/days between\s+(.+?)\s+and\s+(.+)/i);
  if (m) {
    const d1 = new Date(m[1].trim());
    const d2 = new Date(m[2].trim());
    if (!Number.isNaN(d1.getTime()) && !Number.isNaN(d2.getTime())) {
      const diff = Math.abs(d2.getTime() - d1.getTime());
      const days = Math.round(diff / (1000 * 60 * 60 * 24));
      return `📅 There are **${days} days** between ${m[1].trim()} and ${m[2].trim()}.`;
    }
  }

  // ── Text tools ────────────────────────────────────────────────────────────
  m = raw.match(/(?:word count(?:\s+of)?|count words?)[:\ufe55]?\s+(.+)/i);
  if (m) {
    const text = m[1].trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    return `📝 **"${text.slice(0, 60)}${text.length > 60 ? "..." : ""}"**\n\n• Words: **${words}**\n• Characters: **${chars}**`;
  }

  m = raw.match(/^reverse[:\ufe55]?\s+(.+)/i);
  if (m) {
    const reversed = m[1].split("").reverse().join("");
    return `🔄 **"${m[1]}"** reversed is:\n**"${reversed}"**`;
  }

  m = raw.match(/^(?:uppercase|upper case|to uppercase)[:\ufe55]?\s+(.+)/i);
  if (m) return `🔤 **${m[1].toUpperCase()}**`;

  m = raw.match(/^(?:lowercase|lower case|to lowercase)[:\ufe55]?\s+(.+)/i);
  if (m) return `🔡 **${m[1].toLowerCase()}**`;

  // ── Inline constants / facts ──────────────────────────────────────────────
  if (/speed of light/.test(lower))
    return "⚡ The speed of light in a vacuum is **299,792,458 m/s** (approximately **3 × 10⁸ m/s** or ~186,282 miles/second). Nothing travels faster!";
  if (/\bpi\b|value of pi/.test(lower))
    return "🔵 Pi (π) = **3.14159265358979323846...**\n\nPi is the ratio of a circle's circumference to its diameter. It's irrational and never repeats!";
  if (/(?:area of|formula for area of) circle/.test(lower))
    return "📐 Area of a circle: **A = π × r²**\nWhere r is the radius.";
  if (/pythagorean/.test(lower))
    return "📐 Pythagorean Theorem: **a² + b² = c²**\nWhere c is the hypotenuse of a right triangle.";
  if (/avogadro/.test(lower))
    return "🔬 Avogadro's number: **6.022 × 10²³ mol⁻¹** — the number of atoms in one mole of a substance.";
  if (/euler'?s number|value of e\b/.test(lower))
    return "📊 Euler's number (e) = **2.71828182845904523536...**\n\nThe base of the natural logarithm.";

  // ── Knowledge Base lookup ─────────────────────────────────────────────────
  const keywords = extractKeywords(lower);
  const kbResult = findInKB(keywords) || findInKB(lower);
  if (kbResult) {
    const qtype = detectQuestionType(lower);
    const prefixes: Record<string, string> = {
      person: "👤 ",
      geography: "🌍 ",
      definition: "📖 ",
      process: "⚙️ ",
      explanation: "💡 ",
      list: "📋 ",
      general: "🔍 ",
    };
    const prefix = prefixes[qtype] ?? "🔍 ";
    return `${prefix}${kbResult}`;
  }

  // ── Math expression fallback ──────────────────────────────────────────────
  let expr = raw
    .replace(/^(what is|calculate|compute|evaluate|solve)\s*/i, "")
    .replace(/\?+$/, "")
    .trim();
  expr = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  if (/^[\d\s+\-*/.()^%]+$/.test(expr) && expr.length > 0) {
    const result = evaluateMath(expr);
    if (result !== null) return `🔢 **${expr}** = **${result}**`;
  }

  // ── Smart fallback ────────────────────────────────────────────────────────
  const fallbackSuggestions = getSuggestions(lower);
  return `That's an interesting question! 🤔 While I don't have specific data on that topic, here are some related things you could ask me about:\n\n${fallbackSuggestions}\n\nOr try asking about **math, science, history, geography, technology, people, sports**, and much more!`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SMART FALLBACK SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────

function getSuggestions(lower: string): string {
  const topicMap: Array<{ keywords: RegExp; suggestions: string[] }> = [
    {
      keywords: /science|biology|chemistry|physics/,
      suggestions: [
        "What is DNA?",
        "Explain photosynthesis",
        "What is a black hole?",
        "Tell me about atoms",
      ],
    },
    {
      keywords: /history|war|revolution|ancient|empire/,
      suggestions: [
        "Tell me about World War 2",
        "What was the French Revolution?",
        "Tell me about the Roman Empire",
      ],
    },
    {
      keywords: /country|city|capital|map|geography|continent/,
      suggestions: [
        "What is the capital of France?",
        "Tell me about Japan",
        "Where is the Amazon River?",
      ],
    },
    {
      keywords: /tech|computer|code|program|software|internet/,
      suggestions: [
        "What is artificial intelligence?",
        "Tell me about Python",
        "How does blockchain work?",
      ],
    },
    {
      keywords: /person|famous|celebrity|artist|scientist|inventor/,
      suggestions: [
        "Who was Albert Einstein?",
        "Tell me about Leonardo da Vinci",
        "Who was Marie Curie?",
      ],
    },
    {
      keywords: /health|body|medicine|disease|fitness/,
      suggestions: [
        "Tell me about the human brain",
        "What does the heart do?",
        "What is protein?",
      ],
    },
    {
      keywords: /sport|game|football|basketball|tennis|soccer/,
      suggestions: [
        "Tell me about the Olympics",
        "What is the FIFA World Cup?",
        "Tell me about the NBA",
      ],
    },
    {
      keywords: /space|planet|star|galaxy|universe|cosmos/,
      suggestions: [
        "What is a black hole?",
        "Tell me about Jupiter",
        "What is the Milky Way?",
      ],
    },
    {
      keywords: /religion|god|spiritual|faith|pray/,
      suggestions: [
        "Tell me about Buddhism",
        "What is Christianity?",
        "Tell me about Islam",
      ],
    },
    {
      keywords: /money|economy|finance|investment|stock/,
      suggestions: [
        "What is inflation?",
        "Tell me about the stock market",
        "What is Bitcoin?",
      ],
    },
  ];

  for (const { keywords, suggestions } of topicMap) {
    if (keywords.test(lower)) {
      return suggestions.map((s) => `• *"${s}"*`).join("\n");
    }
  }

  // Default suggestions
  return [
    '• *"Tell me a joke"*',
    '• *"What is DNA?"*',
    '• *"Who was Albert Einstein?"*',
    '• *"What is the capital of Japan?"*',
    '• *"Give me a fun fact"*',
  ].join("\n");
}
