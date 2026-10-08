// Final exam: 10 original LGS-style questions, one per unit (e1 = Unit 1 ... e10 = Unit 10).
export const EXAM_QUESTIONS = [
  {
    id: 'e1',
    unit: 1,
    type: 'dialogue',
    stem: 'Which sentence best completes the dialogue?',
    exhibit: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Ayşe', text: "I'm really sorry I missed your birthday party, Kerem. I had a terrible headache." },
        { speaker: 'Kerem', text: '_____' },
        { speaker: 'Ayşe', text: "Thanks for understanding. Let's have pizza this weekend. It's my treat!" },
      ],
    },
    options: [
      'You should apologise to me first.',
      "Don't worry about it. These things happen.",
      'Happy birthday! Here is your present.',
      "I'm afraid I can't come to your party.",
    ],
    answer: 1,
    explanationTr:
      'Ayşe özür diliyor, ardından "Thanks for understanding" (anlayışın için teşekkürler) diyor. Bu yüzden boşluğa özrü kabul eden "Don\'t worry about it. These things happen." gelmelidir. A seçeneği zaten yapılmış bir özrü istiyor, C ve D ise doğum günü partisinin sahibi olan Kerem\'e uymuyor.',
  },
  {
    id: 'e2',
    unit: 2,
    type: 'visual',
    stem: 'According to the table, which of the following is TRUE?',
    exhibit: {
      kind: 'table',
      caption: 'Weekly Free-Time Survey (hours per week)',
      headers: ['Name', 'Playing sports', 'Reading books', 'Playing online games'],
      rows: [
        ['Emre', '6', '2', '5'],
        ['Selin', '3', '5', '1'],
        ['Can', '2', '1', '8'],
        ['Duru', '4', '4', '3'],
      ],
    },
    options: [
      'Can spends more time reading than playing sports.',
      'Selin plays online games more than anyone else.',
      'Emre spends less time on sports than Duru.',
      'Duru spends the same amount of time on sports and reading.',
    ],
    answer: 3,
    explanationTr:
      'Tabloya göre Duru haftada 4 saat spor yapıyor ve 4 saat kitap okuyor, yani iki etkinliğe eşit zaman ayırıyor. Can okumaya 1, spora 2 saat ayırır (A yanlış); en çok online oyun oynayan 8 saatle Can\'dır (B yanlış); Emre 6 saat spor yapar, Duru\'dan fazladır (C yanlış).',
  },
  {
    id: 'e3',
    unit: 3,
    type: 'vocabulary',
    stem: 'First, _____ the onions into small pieces. Then, fry them in a pan with some olive oil.\n\nWhich word best completes the sentence?',
    exhibit: null,
    options: ['chop', 'boil', 'pour', 'taste'],
    answer: 0,
    explanationTr:
      '"Into small pieces" (küçük parçalar halinde) ifadesi doğramayı anlatır; bu yüzden doğru cevap "chop" (doğramak) olur. "Boil" (kaynatmak), "pour" (dökmek) ve "taste" (tadına bakmak) fiilleri soğanı küçük parçalara ayırmak anlamı vermez.',
  },
  {
    id: 'e4',
    unit: 4,
    type: 'dialogue',
    stem: 'Which sentence best completes the dialogue?',
    exhibit: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Mert', text: "Hello, Deniz. It's Mert. We're having a barbecue in our garden on Saturday afternoon. Would you like to join us?" },
        { speaker: 'Deniz', text: '_____ I have to visit my grandparents in İzmir this weekend.' },
        { speaker: 'Mert', text: "Oh, that's a pity. Maybe next time." },
      ],
    },
    options: [
      "Sure, I'd love to. What time should I come?",
      "Hold on, please. I'll get him.",
      "I'd love to, but I can't.",
      'Can I leave a message for him?',
    ],
    answer: 2,
    explanationTr:
      'Deniz hafta sonu büyükanne ve büyükbabasını ziyaret etmek zorunda olduğunu söylüyor, Mert de "That\'s a pity" (ne yazık) diyor. Demek ki Deniz daveti kibarca reddetmiştir: "I\'d love to, but I can\'t." A seçeneği daveti kabul eder; B ve D telefonda başka birini sormak için kullanılır ve bu konuşmaya uymaz.',
  },
  {
    id: 'e5',
    unit: 5,
    type: 'paragraph',
    stem: 'What is the main idea of the text?',
    exhibit: {
      kind: 'passage',
      title: 'Be Smart Online',
      text:
        'Many teenagers spend hours on the internet every day, but not all of them know how to stay safe. First, you should never share personal information, such as your home address or phone number, with people you meet online. Second, create strong passwords and do not tell them to your friends. Also, think carefully before you post a photo, because it can stay on the internet forever. Finally, if someone sends you rude or scary messages, tell an adult you trust immediately.',
    },
    options: [
      'Teenagers should spend less time on the internet.',
      'Strong passwords are the most important part of online safety.',
      'There are some simple rules to protect yourself online.',
      'Posting photos online is a good way to make new friends.',
    ],
    answer: 2,
    explanationTr:
      'Metin internette güvende kalmak için birkaç kural sıralıyor: kişisel bilgi paylaşmamak, güçlü şifre kullanmak, fotoğraf paylaşmadan önce düşünmek ve rahatsız edici mesajları bir yetişkine söylemek. Ana fikir C\'dir. B yalnızca bir ayrıntıdır ve metin şifrenin "en önemli" kural olduğunu söylemez; A ve D metinde yoktur.',
  },
  {
    id: 'e6',
    unit: 6,
    type: 'paragraph',
    stem: 'Which of the following can be inferred from the text?',
    exhibit: {
      kind: 'passage',
      title: 'A Wet Adventure',
      text:
        'Last summer, my cousin Ali and I went rafting on a river near Antalya. Before we started, our guide gave us helmets and life jackets and explained the safety rules. At first, I was very nervous because the water was fast and cold. However, after twenty minutes I started to enjoy it. In the middle of the trip, our raft hit a big rock and Ali fell into the water! Luckily, he was wearing his life jacket, so the guide pulled him out quickly. It was the most exciting day of my holiday.',
    },
    options: [
      'The writer did not enjoy rafting at all.',
      'The safety equipment helped Ali when he fell into the river.',
      'Ali was the guide on the rafting trip.',
      'The writer went rafting alone last summer.',
    ],
    answer: 1,
    explanationTr:
      'Ali suya düştüğünde can yeleği giydiği için rehber onu hızlıca sudan çıkarabilmiştir; yani güvenlik ekipmanı ona yardımcı olmuştur (B). Yazar yirmi dakika sonra eğlenmeye başlamıştır (A yanlış), Ali yazarın kuzenidir, rehber değildir (C yanlış) ve yazar kuzeniyle gitmiştir, yalnız değil (D yanlış).',
  },
  {
    id: 'e7',
    unit: 7,
    type: 'visual',
    stem: 'According to the poster, which of the following is TRUE?',
    exhibit: {
      kind: 'poster',
      heading: 'DISCOVER ISTANBUL: Old City Walking Tour',
      lines: [
        'See the Blue Mosque, Hagia Sophia and the Grand Bazaar',
        'Tours start at 9:00 a.m. and 2:00 p.m. every day except Monday',
        'Duration: 3 hours',
        'Adults: 400 TL | Students: 250 TL | Children under 7: free',
        'Meeting point: Sultanahmet Square',
        'Book online at least one day before your tour.',
      ],
    },
    options: [
      'A student can join the afternoon tour on Friday for 250 TL.',
      'The morning tour finishes at 11:00 a.m.',
      'Tourists can join a tour on Monday afternoon.',
      'Children under seven pay 250 TL for the tour.',
    ],
    answer: 0,
    explanationTr:
      'Turlar pazartesi hariç her gün 14.00\'te de başlar ve öğrenci ücreti 250 TL\'dir; bu yüzden A doğrudur. Sabah turu 9.00\'da başlar ve 3 saat sürer, yani 12.00\'de biter (B yanlış). Pazartesi tur yoktur (C yanlış), 7 yaş altı çocuklar ücretsizdir (D yanlış).',
  },
  {
    id: 'e8',
    unit: 8,
    type: 'visual',
    stem: 'Which of the following is TRUE according to the graph?',
    exhibit: {
      kind: 'barChart',
      title: 'Time Spent on Household Chores per Week',
      unitLabel: 'hours',
      bars: [
        { label: 'Mum', value: 12 },
        { label: 'Dad', value: 9 },
        { label: 'Elif', value: 5 },
        { label: 'Burak', value: 3 },
      ],
    },
    options: [
      'Burak does more chores than Elif.',
      'Dad spends the most time on chores in the family.',
      'Elif and Burak together spend more time on chores than Dad.',
      'Mum spends four times as many hours on chores as Burak.',
    ],
    answer: 3,
    explanationTr:
      'Grafiğe göre anne haftada 12, Burak 3 saat ev işi yapıyor; 12 saat, 3 saatin dört katıdır (D). Burak (3) Elif\'ten (5) az çalışır (A yanlış); en çok çalışan baba değil annedir (B yanlış); Elif ve Burak toplam 8 saat çalışır, bu da babanın 9 saatinden azdır (C yanlış).',
  },
  {
    id: 'e9',
    unit: 9,
    type: 'paragraph',
    stem: 'The word "noticed" in the text is closest in meaning to _____.',
    exhibit: {
      kind: 'passage',
      title: 'A Lucky Mistake',
      text:
        'In 1928, the Scottish scientist Alexander Fleming was studying bacteria in his laboratory in London. Before he went on holiday, he left some dishes of bacteria on his table. When he returned, he noticed something strange: a kind of mould was growing on one dish, and the bacteria around it had died. Fleming wanted to understand why, so he did more experiments. He discovered that the mould produced a substance that could kill bacteria. This discovery led to penicillin, a medicine that has saved millions of lives.',
    },
    options: ['forgot', 'saw', 'cleaned', 'invented'],
    answer: 1,
    explanationTr:
      'Fleming tatilden döndüğünde tabaklardan birinde küfün büyüdüğünü ve çevresindeki bakterilerin öldüğünü fark etmiştir. Bu bağlamda "noticed" (fark etti) kelimesinin en yakın anlamı "saw" (gördü) olur. "Forgot" (unuttu), "cleaned" (temizledi) ve "invented" (icat etti) cümlenin anlamına uymaz.',
  },
  {
    id: 'e10',
    unit: 10,
    type: 'vocabulary',
    stem: 'During an earthquake, you should stay away from windows and _____ under a strong table until the shaking stops.\n\nWhich option best completes the sentence?',
    exhibit: null,
    options: ['evacuate', 'flood', 'take cover', 'erupt'],
    answer: 2,
    explanationTr:
      'Deprem sırasında pencerelerden uzak durup sağlam bir masanın altına sığınmak gerekir; "take cover" (sığınmak, korunmak) bu anlamı verir. "Evacuate" binayı boşaltmak demektir ve masanın altında yapılamaz; "flood" (sel olmak) ve "erupt" (yanardağın püskürmesi) insanın yaptığı bir eylem değildir.',
  },
];
