// Practice drills for units 6-10 (batch B). Original LGS-style content, A2-B1.
export const PRACTICE_UNITS_6_10 = [
  // ---------- Unit 6: Adventures ----------
  {
    id: 'p6-1',
    unit: 6,
    type: 'paragraph',
    stem: 'According to the text, which of the following happened FIRST?',
    exhibit: {
      kind: 'passage',
      title: 'A Rainy Climb',
      text:
        'Last October, my class went on a trip to Uludağ. We left school at seven in the morning. While we were climbing a forest path, it started to rain heavily. A few minutes later, my friend Kerem slipped on a wet rock and hurt his ankle. Luckily, our teacher had a first-aid kit, so she helped him. When we finally reached the top, the rain stopped and we saw a wonderful view. It was a tiring but thrilling day.',
    },
    options: [
      'The class saw a wonderful view.',
      'It started to rain heavily.',
      'Kerem hurt his ankle.',
      'The rain stopped.',
    ],
    answer: 1,
    explanationTr:
      'Metne göre sınıf orman yolunda tırmanırken önce yağmur başlıyor; birkaç dakika sonra Kerem ıslak kayada kayıp bileğini incitiyor; zirveye varınca yağmur duruyor ve manzarayı görüyorlar. Bu yüzden ilk olan olay "It started to rain heavily." (B) seçeneğidir.',
  },
  {
    id: 'p6-2',
    unit: 6,
    type: 'vocabulary',
    stem: 'We were walking in a big forest without a map, and after two hours we _____. Luckily, a park ranger helped us find the right path.\n\nWhich option fits the blank?',
    exhibit: null,
    options: ['missed the bus', 'won the race', 'took a shower', 'got lost'],
    answer: 3,
    explanationTr:
      'Haritasız ormanda yürüyorlar ve bir korucu doğru yolu bulmalarına yardım ediyor; demek ki kaybolmuşlardır: "got lost" (kaybolduk). "Missed the bus" (otobüsü kaçırdık), "won the race" (yarışı kazandık) ve "took a shower" (duş aldık) ormanda yolu bulma durumuyla ilgili değildir.',
  },
  {
    id: 'p6-3',
    unit: 6,
    type: 'visual',
    stem: 'Which of the following is TRUE according to the park rules?',
    exhibit: {
      kind: 'poster',
      heading: 'SKY HIGH Adventure Park: Rules',
      lines: [
        'Visitors under 12 must climb with an adult.',
        'You must wear a helmet on all activities.',
        "You mustn't take food or drinks onto the climbing walls.",
        "You don't have to bring your own equipment. We provide it free.",
        'Open 10:00–18:00 every day except Tuesday.',
      ],
    },
    options: [
      'A 13-year-old visitor can climb without an adult.',
      'Visitors have to bring their own helmets.',
      'You can have a snack on the climbing walls.',
      'The park is open every day of the week.',
    ],
    answer: 0,
    explanationTr:
      'Kurala göre yalnızca 12 yaşından küçükler bir yetişkinle tırmanmak zorundadır; 13 yaşındaki biri yetişkin olmadan tırmanabilir (A). Ekipman (kask dahil) ücretsiz verilir (B yanlış), tırmanma duvarlarına yiyecek götürmek yasaktır, "mustn\'t" (C yanlış) ve park salı günleri kapalıdır (D yanlış).',
  },

  // ---------- Unit 7: Tourism ----------
  {
    id: 'p7-1',
    unit: 7,
    type: 'dialogue',
    stem: "Which option best completes the tourist's question?",
    exhibit: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Tourist', text: 'Excuse me. _____' },
        { speaker: 'Local', text: 'Go straight along this street and turn right at the bank. The museum is opposite the park.' },
        { speaker: 'Tourist', text: 'Thanks for the directions!' },
      ],
    },
    options: [
      'How much is a return ticket?',
      'What time does the museum close?',
      'How can I get to the museum?',
      'Could you take a photo of us?',
    ],
    answer: 2,
    explanationTr:
      'Yerel kişi "düz git, bankadan sağa dön, müze parkın karşısında" diyerek yol tarifi veriyor. Demek ki turist müzeye nasıl gideceğini sormuştur: "How can I get to the museum?" Bilet fiyatı, kapanış saati ya da fotoğraf isteği bu yol tarifiyle uyuşmaz.',
  },
  {
    id: 'p7-2',
    unit: 7,
    type: 'visual',
    stem: 'Look at the table. Which of the following is correct?',
    exhibit: {
      kind: 'table',
      caption: 'Hotels in Cappadocia (price per night)',
      headers: ['Hotel', 'Price', 'Breakfast', 'Swimming pool', 'Distance to centre'],
      rows: [
        ['Cave Rooms', '1,800 TL', 'Yes', 'No', '1 km'],
        ['Sunrise Hotel', '2,500 TL', 'Yes', 'Yes', '3 km'],
        ['Valley Inn', '1,200 TL', 'No', 'No', '5 km'],
        ['Stone House', '2,100 TL', 'No', 'Yes', '2 km'],
      ],
    },
    options: [
      'The cheapest hotel is the closest to the centre.',
      'Only one hotel offers both breakfast and a swimming pool.',
      'Stone House is more expensive than Sunrise Hotel.',
      'Cave Rooms has a swimming pool.',
    ],
    answer: 1,
    explanationTr:
      'Hem kahvaltısı hem havuzu olan tek otel Sunrise Hotel\'dir (B). En ucuz otel Valley Inn\'dir ama merkeze en uzak (5 km) olandır (A yanlış); Stone House (2.100 TL) Sunrise Hotel\'den (2.500 TL) ucuzdur (C yanlış); Cave Rooms\'un havuzu yoktur (D yanlış).',
  },
  {
    id: 'p7-3',
    unit: 7,
    type: 'paragraph',
    stem: 'What did the writer NOT like about the trip?',
    exhibit: {
      kind: 'passage',
      title: 'My Weekend in Safranbolu',
      text:
        'Hi everyone! Last weekend my family and I visited Safranbolu. We stayed in an old Ottoman house. It was affordable, and the owners were very friendly. On Saturday, we joined a guided tour of the historical sites, and the old streets looked amazing. I also bought some Turkish delight as souvenirs for my friends. The only bad thing was the weather. It rained all day on Sunday, so we couldn\'t walk around the town. I hope to go back in summer.',
    },
    options: [
      'The hotel was too expensive.',
      'The guided tour was boring.',
      'The owners of the house were unfriendly.',
      'It rained all day on Sunday.',
    ],
    answer: 3,
    explanationTr:
      'Yazar "The only bad thing was the weather" diyor: pazar günü bütün gün yağmur yağdığı için kasabayı gezememişler (D). Konaklama uygun fiyatlıdır (A yanlış), rehberli turda sokaklar harika görünüyordu (B yanlış) ve ev sahipleri çok güler yüzlüydü (C yanlış).',
  },

  // ---------- Unit 8: Chores ----------
  {
    id: 'p8-1',
    unit: 8,
    type: 'visual',
    stem: 'Based on the chart, which statement is correct?',
    exhibit: {
      kind: 'barChart',
      title: 'Class 8-A: Students Who Do Each Chore Every Day',
      unitLabel: 'students',
      bars: [
        { label: 'Make the bed', value: 18 },
        { label: 'Do the washing-up', value: 6 },
        { label: 'Take out the rubbish', value: 9 },
        { label: 'Water the plants', value: 12 },
      ],
    },
    options: [
      'Most students do the washing-up every day.',
      'More students take out the rubbish than water the plants.',
      'Six more students make the bed than water the plants.',
      'The same number of students do the washing-up and take out the rubbish.',
    ],
    answer: 2,
    explanationTr:
      'Her gün yatağını toplayan 18, çiçek sulayan 12 öğrenci var; aradaki fark 18 − 12 = 6\'dır (C). Bulaşık yıkayan öğrenci sayısı en azdır, 6 (A yanlış); çöp çıkaran 9 öğrenci çiçek sulayan 12 öğrenciden azdır (B yanlış); 6 ile 9 eşit değildir (D yanlış).',
  },
  {
    id: 'p8-2',
    unit: 8,
    type: 'dialogue',
    stem: 'Which request completes the conversation?',
    exhibit: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Mum', text: "Deniz, I'm very busy with dinner. _____" },
        { speaker: 'Deniz', text: "Of course, Mum. I'll take it out right now." },
      ],
    },
    options: [
      'Could you take out the rubbish, please?',
      'Whose turn is it to iron the clothes?',
      'Would you like to watch a film with me?',
      'Did you make your bed this morning?',
    ],
    answer: 0,
    explanationTr:
      'Deniz "I\'ll take it out right now" (hemen dışarı çıkarırım) diyor; bu cevap çöpü çıkarma ricasına uyar: "Could you take out the rubbish, please?" Ütü sırası, film daveti ya da yatak toplama sorusu "take it out" cevabıyla uyuşmaz.',
  },
  {
    id: 'p8-3',
    unit: 8,
    type: 'vocabulary',
    stem: 'My little brother has dirty socks and T-shirts everywhere. Today he has to _____ because he has nothing clean to wear.\n\nWhich phrase fits the blank?',
    exhibit: null,
    options: ['water the plants', 'do the laundry', 'make the bed', 'vacuum the carpet'],
    answer: 1,
    explanationTr:
      'Kardeşinin kirli çorapları ve tişörtleri var ve giyecek temiz bir şeyi kalmamış; bu yüzden çamaşır yıkaması gerekir: "do the laundry". Çiçek sulamak, yatak toplamak ve halıyı süpürmek temiz kıyafet sorununu çözmez.',
  },

  // ---------- Unit 9: Science ----------
  {
    id: 'p9-1',
    unit: 9,
    type: 'paragraph',
    stem: 'According to the text, which of the following is TRUE about Aziz Sancar?',
    exhibit: {
      kind: 'passage',
      title: 'A Scientist from Savur',
      text:
        'Aziz Sancar was born in 1946 in Savur, a small town in Mardin. He studied medicine at Istanbul University and worked as a doctor in his hometown for a short time. However, he was more interested in research, so he went to the USA to study biology. In his laboratory, he did many experiments on how our cells repair damaged DNA. In 2015, he won the Nobel Prize in Chemistry together with two other scientists.',
    },
    options: [
      'He won the Nobel Prize alone.',
      'He never worked as a doctor.',
      'He studied biology before medicine.',
      'His research was about how cells repair DNA.',
    ],
    answer: 3,
    explanationTr:
      'Metne göre Aziz Sancar laboratuvarında hücrelerin hasarlı DNA\'yı nasıl onardığı üzerine deneyler yapmıştır (D). Nobel Ödülü\'nü iki bilim insanıyla birlikte almıştır (A yanlış), kısa bir süre doktor olarak çalışmıştır (B yanlış) ve önce tıp, sonra biyoloji okumuştur (C yanlış).',
  },
  {
    id: 'p9-2',
    unit: 9,
    type: 'visual',
    stem: 'Some students did an experiment. According to the results, which statement is correct?',
    exhibit: {
      kind: 'table',
      caption: 'Which Material Keeps an Ice Cube Frozen Longest?',
      headers: ['Material around the ice cube', 'Time until it melted (minutes)'],
      rows: [
        ['Aluminium foil', '35'],
        ['Wool', '90'],
        ['Paper', '50'],
        ['No cover', '30'],
      ],
    },
    options: [
      'The ice cube with no cover melted last.',
      'Paper kept the ice frozen longer than wool.',
      'The ice cube in wool lasted an hour longer than the ice cube with no cover.',
      'Aluminium foil was the best material in the experiment.',
    ],
    answer: 2,
    explanationTr:
      'Yün içindeki buz 90 dakikada, örtüsüz buz 30 dakikada erimiş; aradaki fark 60 dakika, yani bir saattir (C). Örtüsüz buz ilk erimiştir (A yanlış), kâğıt (50) yünden (90) daha kısa süre korumuştur (B yanlış) ve en iyi malzeme alüminyum folyo değil yündür (D yanlış).',
  },
  {
    id: 'p9-3',
    unit: 9,
    type: 'vocabulary',
    stem: 'Thomas Edison was a famous _____. He had more than a thousand patents for inventions such as the phonograph and the light bulb.\n\nWhich word fits the blank?',
    exhibit: null,
    options: ['astronaut', 'inventor', 'explorer', 'athlete'],
    answer: 1,
    explanationTr:
      'Binden fazla buluş patenti olan kişi bir mucittir; bu yüzden doğru kelime "inventor" (mucit) olur. "Astronaut" (astronot) uzaya giden, "explorer" (kâşif) yeni yerler keşfeden, "athlete" (sporcu) ise spor yapan kişidir.',
  },

  // ---------- Unit 10: Natural Forces ----------
  {
    id: 'p10-1',
    unit: 10,
    type: 'paragraph',
    stem: 'What is the main purpose of the text?',
    exhibit: {
      kind: 'passage',
      title: 'Before the Ground Shakes',
      text:
        "Turkey has many earthquakes, so every family should be ready before one happens. First, prepare an emergency kit. Put water, some food that doesn't go bad, a torch, extra batteries, a whistle and a first-aid kit in a bag, and keep it near the door. Second, fix heavy furniture such as bookcases to the wall so that it cannot fall. Finally, choose a safe meeting place outside, like a park, and make sure everyone in the family knows it.",
    },
    options: [
      'To explain how families can prepare for an earthquake.',
      'To describe what happened during a famous earthquake.',
      'To compare different kinds of natural disasters.',
      'To advertise a shop that sells torches and batteries.',
    ],
    answer: 0,
    explanationTr:
      'Metin depremden önce ailelerin yapması gerekenleri sıralıyor: acil durum çantası hazırlamak, ağır eşyaları duvara sabitlemek ve bir buluşma yeri seçmek. Amacı ailelerin depreme nasıl hazırlanacağını anlatmaktır (A). Belirli bir deprem, afet karşılaştırması ya da mağaza reklamı metinde yoktur.',
  },
  {
    id: 'p10-2',
    unit: 10,
    type: 'visual',
    stem: 'Which of the following can we learn from the warning?',
    exhibit: {
      kind: 'poster',
      heading: 'FLOOD WARNING: Riverside District',
      lines: [
        'Heavy rain is expected from Thursday evening until Saturday morning.',
        'The river may rise by up to 2 metres.',
        'Move to higher ground if water enters your street.',
        "You mustn't walk or drive through flood water.",
        'Schools in Riverside District will be closed on Friday.',
        'Emergency number: 112',
      ],
    },
    options: [
      'The rain will stop on Thursday evening.',
      'It is safe to drive through flood water slowly.',
      "Students in Riverside District won't go to school on Friday.",
      'Everyone must leave the city before Thursday.',
    ],
    answer: 2,
    explanationTr:
      'Uyarıda Riverside bölgesindeki okulların cuma günü kapalı olacağı yazıyor; yani öğrenciler cuma okula gitmeyecek (C). Yağmur perşembe akşamı başlayıp cumartesi sabahına kadar sürecek (A yanlış), sel suyunda yürümek ya da araba sürmek yasaktır (B yanlış) ve şehri terk etmekle ilgili bir bilgi yoktur (D yanlış).',
  },
  {
    id: 'p10-3',
    unit: 10,
    type: 'dialogue',
    stem: 'Which piece of advice completes the dialogue?',
    exhibit: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Ece', text: "Dad, there's a very strong storm tonight. What should we do?" },
        { speaker: 'Dad', text: '_____ Strong winds can break the glass.' },
        { speaker: 'Ece', text: "OK, I'll close the curtains and sit in the hallway." },
      ],
    },
    options: [
      'You should open all the windows.',
      'You should stay away from the windows.',
      'You should go outside and take photos.',
      "You shouldn't charge your phone.",
    ],
    answer: 1,
    explanationTr:
      'Babası güçlü rüzgârın camları kırabileceğini söylüyor, Ece de perdeleri kapatıp koridorda oturacağını belirtiyor. Bu yüzden tavsiye "You should stay away from the windows." olmalıdır. Pencereleri açmak ya da dışarı çıkmak tehlikelidir; telefonu şarj etmemek ise camlarla ilgili değildir.',
  },
];
