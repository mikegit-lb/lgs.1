// Practice drills for units 1-5 (batch A). Original LGS-style content, A2-B1.
export const PRACTICE_UNITS_1_5 = [
  // ---------- Unit 1: Friendship ----------
  {
    id: 'p1-1',
    unit: 1,
    type: 'vocabulary',
    stem: 'My friend Arda never tells lies, even when the truth is difficult to say. He is a very _____ person.\n\nWhich word fits the blank?',
    exhibit: null,
    options: ['generous', 'selfish', 'honest', 'shy'],
    answer: 2,
    explanationTr:
      'Cümle Arda\'nın asla yalan söylemediğini anlatıyor; bu yüzden doğru kelime "honest" (dürüst) olur. "Generous" (cömert) paylaşmakla, "shy" (utangaç) çekingenlikle ilgilidir; "selfish" (bencil) ise olumsuz bir özelliktir ve cümleyle uyuşmaz.',
  },
  {
    id: 'p1-2',
    unit: 1,
    type: 'dialogue',
    stem: 'Which option best fills the blank in the dialogue?',
    exhibit: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Burak', text: 'Hey Ece, did you bring my book back?' },
        { speaker: 'Ece', text: 'Yes, here it is. _____ I spilled some juice on the cover by mistake.' },
        { speaker: 'Burak', text: "Oh no! Well, don't worry about it. Accidents happen." },
      ],
    },
    options: ['I apologise, Burak.', 'Congratulations, Burak!', 'Never mind, Burak.', "You're welcome, Burak."],
    answer: 0,
    explanationTr:
      'Ece kitabın kapağına yanlışlıkla meyve suyu döktüğünü söylüyor, Burak da "Don\'t worry about it" diyerek özrü kabul ediyor. Bu yüzden boşluğa bir özür cümlesi gelir: "I apologise, Burak." "Never mind" özür dileyen kişinin değil, özrü kabul eden kişinin söylediği bir ifadedir.',
  },
  {
    id: 'p1-3',
    unit: 1,
    type: 'paragraph',
    stem: 'According to the text, which of the following is TRUE about Nehir?',
    exhibit: {
      kind: 'passage',
      title: 'My Best Friend',
      text:
        'My best friend is Nehir. We met in the first grade, and we have been friends for seven years. Nehir is not as talkative as me; she is a bit shy with new people. However, she is the most reliable person I know. When I broke my arm last year, she visited me every day and brought my homework. She also shares her snacks with everyone, so she is very generous. She always has my back.',
    },
    options: [
      'She talks more than the writer.',
      'She met the writer last year.',
      'She broke her arm last year.',
      'She helped the writer when the writer was hurt.',
    ],
    answer: 3,
    explanationTr:
      'Yazar geçen yıl kolunu kırdığında Nehir\'in her gün onu ziyaret edip ödevlerini getirdiğini söylüyor; yani D doğrudur. "Not as talkative as me" Nehir\'in yazardan daha az konuştuğunu gösterir (A yanlış). Birinci sınıfta tanışmışlar (B yanlış) ve kolunu kıran Nehir değil, yazardır (C yanlış).',
  },

  // ---------- Unit 2: Teen Life ----------
  {
    id: 'p2-1',
    unit: 2,
    type: 'visual',
    stem: 'According to the messages, which of the following is TRUE?',
    exhibit: {
      kind: 'poster',
      heading: 'Class 8-B Group Chat',
      lines: [
        'Mert (18:05): Who wants to play basketball in the park on Saturday afternoon?',
        "Ece (18:07): Sorry, I can't stand basketball! I prefer swimming.",
        "Kaan (18:10): Count me in, Mert! I'm free after 2 p.m.",
        'Ece (18:12): Kaan, how about swimming together on Sunday morning?',
        'Kaan (18:15): Sure, sounds fun!',
      ],
    },
    options: [
      'Ece is going to play basketball on Saturday.',
      'Kaan is going to do two different activities at the weekend.',
      'Mert prefers swimming to basketball.',
      'Kaan is busy all day on Saturday.',
    ],
    answer: 1,
    explanationTr:
      'Kaan cumartesi Mert\'le basketbol oynamayı ("Count me in") ve pazar sabahı Ece\'yle yüzmeyi kabul ediyor; yani hafta sonu iki farklı etkinlik yapacak (B). Ece basketbolu hiç sevmiyor (A yanlış), yüzmeyi tercih eden Mert değil Ece\'dir (C yanlış) ve Kaan cumartesi saat 2\'den sonra boştur (D yanlış).',
  },
  {
    id: 'p2-2',
    unit: 2,
    type: 'paragraph',
    stem: 'Which of the following is TRUE about Barış according to the text?',
    exhibit: {
      kind: 'passage',
      title: "Barış's Week",
      text:
        'Barış is fifteen, and his weekdays are very busy. He always gets up at 6:30 and catches the school bus at 7:15. After school, he usually goes to a football course for two hours. He often does his homework after dinner, and he rarely watches TV on weekdays. At the weekend, things are different. He sometimes sleeps until ten and hangs out with his cousins. However, he never plays computer games before he finishes his homework.',
    },
    options: [
      'He watches TV every evening on weekdays.',
      'He goes to a football course in the mornings.',
      'He finishes his homework before he plays computer games.',
      'He always sleeps until ten at the weekend.',
    ],
    answer: 2,
    explanationTr:
      'Metinde Barış\'ın ödevini bitirmeden asla bilgisayar oyunu oynamadığı söyleniyor; yani önce ödevini bitirir (C). Hafta içi "rarely" (nadiren) televizyon izler (A yanlış), futbol kursuna okuldan sonra gider (B yanlış) ve hafta sonu "sometimes" (bazen) saat ona kadar uyur, "always" değil (D yanlış).',
  },
  {
    id: 'p2-3',
    unit: 2,
    type: 'vocabulary',
    stem: 'Defne is really into _____. Every weekend, she takes pictures of birds and flowers with her new camera.\n\nWhich word fits the blank?',
    exhibit: null,
    options: ['photography', 'cooking', 'chess', 'knitting'],
    answer: 0,
    explanationTr:
      'Defne her hafta sonu yeni fotoğraf makinesiyle kuşların ve çiçeklerin fotoğraflarını çekiyor; bu yüzden hobisi "photography" (fotoğrafçılık) olmalıdır. "Cooking" (yemek yapmak), "chess" (satranç) ve "knitting" (örgü örmek) fotoğraf makinesiyle ilgili değildir.',
  },

  // ---------- Unit 3: In The Kitchen ----------
  {
    id: 'p3-1',
    unit: 3,
    type: 'visual',
    stem: 'According to the recipe card, which of the following is TRUE?',
    exhibit: {
      kind: 'table',
      caption: 'Pancakes for Four People',
      headers: ['Ingredient', 'Quantity'],
      rows: [
        ['Flour', '2 cups'],
        ['Milk', '1 glass'],
        ['Eggs', '2'],
        ['Sugar', '2 spoons'],
        ['Salt', 'a pinch'],
        ['Butter', '50 grams'],
      ],
    },
    options: [
      'You need more eggs than cups of flour.',
      "The recipe doesn't need any salt.",
      'You need three eggs for this recipe.',
      'You need as many eggs as spoons of sugar.',
    ],
    answer: 3,
    explanationTr:
      'Tarifte 2 yumurta ve 2 kaşık şeker var; sayıları eşit olduğu için "as many eggs as spoons of sugar" doğrudur (D). Yumurta sayısı (2) un miktarına (2 su bardağı) eşittir, fazla değildir (A yanlış); tarifte bir tutam tuz vardır (B yanlış) ve üç değil iki yumurta gerekir (C yanlış).',
  },
  {
    id: 'p3-2',
    unit: 3,
    type: 'dialogue',
    stem: 'Which choice correctly fills the gap in the conversation?',
    exhibit: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Can', text: 'Mum, I want to make an omelette for breakfast. Do we have any eggs?' },
        { speaker: 'Mum', text: '_____' },
        { speaker: 'Can', text: 'Great! Could you pass me three of them, please?' },
      ],
    },
    options: [
      "No, we don't have any milk.",
      'Yes, there are some in the fridge.',
      'Yes, there is much sugar in the cupboard.',
      "No, I can't cook today.",
    ],
    answer: 1,
    explanationTr:
      'Can yumurta olup olmadığını soruyor ve cevaptan sonra "Great! Üç tanesini verir misin?" diyor. Demek ki annesi evde yumurta olduğunu söylemiştir: "Yes, there are some in the fridge." A ve D olumsuz cevaplardır, C ise yumurtadan değil şekerden bahseder.',
  },
  {
    id: 'p3-3',
    unit: 3,
    type: 'vocabulary',
    stem: 'Could you buy a _____ of milk on your way home? We need it for breakfast tomorrow.\n\nWhich word fits the blank?',
    exhibit: null,
    options: ['slice', 'pinch', 'carton', 'loaf'],
    answer: 2,
    explanationTr:
      'Süt sıvıdır ve marketten kutu içinde alınır; bu yüzden "a carton of milk" (bir kutu süt) doğrudur. "A slice of" (bir dilim) peynir ya da ekmek için, "a pinch of" (bir tutam) tuz için, "a loaf of" (bir somun) ise ekmek için kullanılır.',
  },

  // ---------- Unit 4: On The Phone ----------
  {
    id: 'p4-1',
    unit: 4,
    type: 'dialogue',
    stem: 'Which option completes the phone conversation correctly?',
    exhibit: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Zeynep', text: "Hi Kaan! Would you like to come to my sister's graduation party on Sunday?" },
        { speaker: 'Kaan', text: '_____ What time does it start?' },
        { speaker: 'Zeynep', text: 'At five, in our garden.' },
        { speaker: 'Kaan', text: 'Great. Thanks for the invitation. See you on Sunday!' },
      ],
    },
    options: [
      "Sure, I'd love to.",
      "Sorry, I'm busy on Sunday.",
      "I'd love to, but I can't.",
      'Could you call me back later?',
    ],
    answer: 0,
    explanationTr:
      'Kaan partinin saatini soruyor ve sonunda "See you on Sunday!" diyor; yani daveti kabul etmiştir: "Sure, I\'d love to." B ve C daveti reddeden cümlelerdir. D ise konuşmayı ertelemek için kullanılır ve hemen ardından saati sormakla uyuşmaz.',
  },
  {
    id: 'p4-2',
    unit: 4,
    type: 'dialogue',
    stem: 'Which option best completes Selin\'s answer?',
    exhibit: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Ali', text: 'Hi Selin. How about going to the science museum with me tomorrow?' },
        { speaker: 'Selin', text: "I'd love to, but _____" },
        { speaker: 'Ali', text: "Oh, I'm sorry to hear that. Get well soon! Maybe next week, then." },
      ],
    },
    options: [
      "I'm free all day tomorrow.",
      'I really like museums.',
      'that sounds great.',
      'I have a bad cold.',
    ],
    answer: 3,
    explanationTr:
      '"I\'d love to, but …" kalıbı kibarca reddetmek için kullanılır ve ardından bir neden gelir. Ali\'nin "Get well soon!" (geçmiş olsun) demesi Selin\'in hasta olduğunu gösterir, bu yüzden doğru cevap "I have a bad cold." olur. Diğer seçenekler bir reddetme nedeni değildir.',
  },
  {
    id: 'p4-3',
    unit: 4,
    type: 'paragraph',
    stem: 'What is the purpose of the text?',
    exhibit: {
      kind: 'passage',
      title: 'Good Phone Manners',
      text:
        'Making a phone call is easy, but good manners are important. When you call someone, say hello and tell them your name first. If the person you want is not available, you can leave a message or ask them to call you back. Do not call people very early in the morning or late at night. In public places such as buses, speak quietly. Finally, never hang up without saying goodbye.',
    },
    options: [
      'To explain how mobile phones work.',
      'To give advice about polite phone calls.',
      'To compare home phones and mobile phones.',
      'To invite people to a new phone shop.',
    ],
    answer: 1,
    explanationTr:
      'Metin telefonda kibar olmak için öneriler sıralıyor: adını söylemek, mesaj bırakmak, erken ya da geç saatte aramamak, toplu taşımada sessiz konuşmak ve vedalaşmadan kapatmamak. Amacı kibar telefon görüşmeleri hakkında tavsiye vermektir (B). Telefonların nasıl çalıştığı, karşılaştırma ya da dükkân daveti metinde yoktur.',
  },

  // ---------- Unit 5: The Internet ----------
  {
    id: 'p5-1',
    unit: 5,
    type: 'paragraph',
    stem: 'What is the text mainly about?',
    exhibit: {
      kind: 'passage',
      title: "Efe's Story",
      text:
        "Last month, Efe started getting unkind comments under his photos. Someone was laughing at his clothes and calling him names. At first, Efe kept it a secret and felt very sad. Then his sister noticed the problem. She helped him take screenshots of the messages, block the bully and report the account. They also told Efe's teacher. Now Efe feels much better, and he knows that cyberbullying is never the victim's fault.",
    },
    options: [
      'How Efe chose new clothes for his photos.',
      'Why Efe stopped using the internet forever.',
      'How Efe dealt with cyberbullying with help from others.',
      "How Efe's sister became a teacher.",
    ],
    answer: 2,
    explanationTr:
      'Metin, Efe\'nin internette kötü yorumlara maruz kalmasını ve kız kardeşi ile öğretmeninin yardımıyla bu siber zorbalıkla nasıl başa çıktığını anlatıyor (C). Kıyafet seçmek, interneti tamamen bırakmak ya da ablasının öğretmen olması metinde geçmez.',
  },
  {
    id: 'p5-2',
    unit: 5,
    type: 'visual',
    stem: 'According to the chart, which of the following is TRUE?',
    exhibit: {
      kind: 'barChart',
      title: 'Average Time Spent Online per Day by Age Group',
      unitLabel: 'hours',
      bars: [
        { label: '10–12', value: 2 },
        { label: '13–15', value: 4 },
        { label: '16–18', value: 6 },
        { label: '19–25', value: 5 },
      ],
    },
    options: [
      'People aged 16–18 spend three times as many hours online as children aged 10–12.',
      'The 19–25 age group spends the most time online.',
      'People aged 13–15 spend more time online than people aged 19–25.',
      'Children aged 10–12 spend half as much time online as people aged 19–25.',
    ],
    answer: 0,
    explanationTr:
      '16–18 yaş grubu günde 6 saat, 10–12 yaş grubu 2 saat internette; 6, 2\'nin üç katıdır, yani A doğrudur. En çok zaman geçiren grup 19–25 değil 16–18\'dir (B yanlış); 13–15 yaş grubu 4 saatle 19–25\'ten (5 saat) daha az zaman geçirir (C yanlış); 2 saat, 5 saatin yarısı değildir (D yanlış).',
  },
  {
    id: 'p5-3',
    unit: 5,
    type: 'vocabulary',
    stem: 'A stranger keeps sending you strange messages online. You should _____ him so that he cannot contact you again.\n\nWhich word fits the blank?',
    exhibit: null,
    options: ['download', 'share', 'follow', 'block'],
    answer: 3,
    explanationTr:
      'Tanımadığın birinin seninle bir daha iletişim kurmasını engellemek için onu "block" (engellemek) etmelisin. "Download" (indirmek) ve "share" (paylaşmak) bu durumla ilgisizdir; "follow" (takip etmek) ise tam tersine o kişiyle bağlantıyı artırır.',
  },
];
