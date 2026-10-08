// LGS 8. sınıf İngilizce ünite kataloğu (özgün içerik, A2–B1).
// Sınav içeriği İngilizce; dilbilgisi açıklamaları ve ipuçları Türkçe.

export const UNITS = [
  {
    id: 1,
    name: 'Friendship',
    trName: 'Arkadaşlık',
    words: [
      { en: 'loyal', tr: 'sadık' },
      { en: 'generous', tr: 'cömert' },
      { en: 'shy', tr: 'utangaç' },
      { en: 'honest', tr: 'dürüst' },
      { en: 'reliable', tr: 'güvenilir' },
      { en: 'selfish', tr: 'bencil' },
      { en: 'supportive', tr: 'destekleyici' },
      { en: 'apologise', tr: 'özür dilemek' },
      { en: 'forgive', tr: 'affetmek' },
      { en: 'misunderstanding', tr: 'yanlış anlaşılma' },
    ],
    phrases: [
      "I'm really sorry about that.",
      'I apologise for being late.',
      "Never mind. It's OK.",
      "Don't worry about it.",
      'She always has my back.',
    ],
    grammar: {
      title: 'Karşılaştırma yapıları (comparatives) ve "as … as"',
      points: [
        'Kısa sıfatlara -er eklenir, uzun sıfatların önüne "more" gelir; ardından "than" kullanılır (taller than, more generous than).',
        '"as + sıfat + as" iki kişinin bir özellikte eşit olduğunu anlatır.',
        '"not as + sıfat + as" birinin diğerinden daha az o özelliğe sahip olduğunu anlatır.',
      ],
      examples: [
        'Ayşe is more generous than her brother.',
        'My new friend is as honest as my best friend.',
        'Can is not as shy as he was last year.',
      ],
    },
    model: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Elif', text: 'Hi Deniz. Are you angry with me?' },
        { speaker: 'Deniz', text: 'A little. You forgot my birthday party.' },
        { speaker: 'Elif', text: "I'm really sorry. I was at my grandmother's house all day." },
        { speaker: 'Deniz', text: 'Why didn\'t you call me?' },
        { speaker: 'Elif', text: 'My phone was dead. I apologise. It won\'t happen again.' },
        { speaker: 'Deniz', text: "Never mind. It's OK. You're still my best friend." },
        { speaker: 'Elif', text: 'Thanks. Let me buy you an ice cream this weekend!' },
        { speaker: 'Deniz', text: 'Great! Ice cream is better than cake anyway.' },
      ],
    },
    tipTr:
      'Diyalog sorularında boşluktan sonraki cümleye mutlaka bak: karşı taraf "Never mind" diyorsa boşluğa bir özür cümlesi gelir.',
  },
  {
    id: 2,
    name: 'Teen Life',
    trName: 'Gençlik Hayatı',
    words: [
      { en: 'hobby', tr: 'hobi' },
      { en: 'free time', tr: 'boş zaman' },
      { en: 'hang out', tr: 'takılmak, vakit geçirmek' },
      { en: 'social media', tr: 'sosyal medya' },
      { en: 'follower', tr: 'takipçi' },
      { en: 'peer pressure', tr: 'akran baskısı' },
      { en: 'addicted', tr: 'bağımlı' },
      { en: 'prefer', tr: 'tercih etmek' },
      { en: 'can\'t stand', tr: 'katlanamamak, hiç sevmemek' },
    ],
    phrases: [
      'I usually hang out with my friends at the weekend.',
      "I'm really into playing chess.",
      'I prefer reading to watching TV.',
      "I can't stand waking up early.",
    ],
    grammar: {
      title: 'Geniş zaman (present simple) ve sıklık zarfları',
      points: [
        'Geniş zaman alışkanlıkları ve rutinleri anlatır; he/she/it ile fiile -s/-es eklenir.',
        'Sıklık zarfları (always, usually, often, sometimes, rarely, never) ana fiilden önce, "be" fiilinden sonra gelir.',
      ],
      examples: [
        'Mert often plays basketball after school.',
        'I never check my phone during dinner.',
        'My sister is always online in the evening.',
      ],
    },
    model: {
      kind: 'passage',
      title: 'My Free Time',
      text:
        "Hi, I'm Zeynep and I'm fourteen. On weekdays I don't have much free time because I study for the LGS. At the weekend, I usually hang out with my friends in the park. We sometimes play volleyball. I'm also into drawing, so I often draw comics in my room. I like social media, but I never use it for more than an hour a day. I don't want to become addicted to my phone.",
    },
    tipTr:
      'Sıklık zarflarının yüzde sırasını ezberle: always (%100) > usually > often > sometimes > rarely > never (%0). Tablo sorularında bu sıra çok sorulur.',
  },
  {
    id: 3,
    name: 'In The Kitchen',
    trName: 'Mutfakta',
    words: [
      { en: 'chop', tr: 'doğramak' },
      { en: 'boil', tr: 'kaynatmak, haşlamak' },
      { en: 'fry', tr: 'kızartmak' },
      { en: 'stir', tr: 'karıştırmak' },
      { en: 'pour', tr: 'dökmek' },
      { en: 'add', tr: 'eklemek' },
      { en: 'ingredient', tr: 'malzeme' },
      { en: 'recipe', tr: 'tarif' },
      { en: 'a pinch of', tr: 'bir tutam' },
      { en: 'a bowl of', tr: 'bir kase' },
    ],
    phrases: [
      'First, chop the onions.',
      'Then, add some salt.',
      'After that, stir it for two minutes.',
      'Finally, serve it hot.',
    ],
    grammar: {
      title: 'Sıralama sözcükleri, emir kipi ve sayılabilen/sayılamayan isimler',
      points: [
        'Tariflerde emir kipi kullanılır ve adımlar First, Then, Next, After that, Finally ile sıralanır.',
        '"many" sayılabilen, "much" sayılamayan isimlerle kullanılır (many eggs, much sugar).',
        '"some" olumlu cümlelerde, "any" olumsuz ve soru cümlelerinde kullanılır.',
      ],
      examples: [
        'First, boil the water. Then, add the pasta.',
        'How many eggs do we need?',
        "We don't have any milk, but we have some butter.",
      ],
    },
    model: {
      kind: 'passage',
      title: 'Easy Menemen',
      text:
        'Menemen is a popular Turkish breakfast. You need two tomatoes, one green pepper, two eggs, a little olive oil and a pinch of salt. First, chop the pepper and fry it in the oil for three minutes. Then, add the chopped tomatoes and cook them until they are soft. After that, break the eggs into the pan and stir gently. Finally, add the salt and serve it hot with fresh bread.',
    },
    tipTr:
      'Tarif sorularında sıralama sözcüklerini (First, Then, After that, Finally) işaretle; doğru sırayı soran sorular bu sözcüklerle kolayca çözülür.',
  },
  {
    id: 4,
    name: 'On The Phone',
    trName: 'Telefonda',
    words: [
      { en: 'call back', tr: 'geri aramak' },
      { en: 'hang up', tr: 'telefonu kapatmak' },
      { en: 'hold on', tr: 'hatta kalmak, beklemek' },
      { en: 'leave a message', tr: 'mesaj bırakmak' },
      { en: 'take a message', tr: 'mesaj almak (not almak)' },
      { en: 'invitation', tr: 'davet' },
      { en: 'accept', tr: 'kabul etmek' },
      { en: 'refuse', tr: 'reddetmek' },
      { en: 'available', tr: 'müsait' },
    ],
    phrases: [
      'Would you like to come to the cinema with me?',
      "I'd love to, but I have to study.",
      "Sorry, I can't. I'm busy on Saturday.",
      'Can I speak to Ali, please?',
      'Could you call me back later?',
    ],
    grammar: {
      title: 'Davet etme, kabul etme, reddetme ve kibar rica',
      points: [
        'Davet: "Would you like to + fiil?" ya da "How about + fiil-ing?" kalıpları kullanılır.',
        'Kabul: "Sure! / I\'d love to." Reddetme: "I\'d love to, but …" ya da "Sorry, I can\'t." ve ardından bir neden.',
        'Kibar rica için "Can / Could I …?" ve "Could you …?" kullanılır; "Could" daha kibardır.',
      ],
      examples: [
        'Would you like to join our picnic on Sunday?',
        "I'd love to, but I have a piano lesson.",
        'Could you tell her that I called, please?',
      ],
    },
    model: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Emre', text: 'Hello, can I speak to Selin, please?' },
        { speaker: 'Selin', text: "Hi Emre, it's me. What's up?" },
        { speaker: 'Emre', text: "Would you like to come to my house on Friday? We're having a movie night." },
        { speaker: 'Selin', text: "I'd love to, but I can't. I have a dentist appointment." },
        { speaker: 'Emre', text: "That's a pity. How about Saturday, then?" },
        { speaker: 'Selin', text: "Sure, I'm available on Saturday. What time?" },
        { speaker: 'Emre', text: 'At six. See you then!' },
        { speaker: 'Selin', text: 'Great. Thanks for the invitation. Bye!' },
      ],
    },
    tipTr:
      '"I\'d love to" tek başına kabul anlamı taşır, ama arkasından "but" geliyorsa cümle bir reddetmedir. Seçeneklerde bu ayrıma dikkat et.',
  },
  {
    id: 5,
    name: 'The Internet',
    trName: 'İnternet',
    words: [
      { en: 'password', tr: 'şifre' },
      { en: 'personal information', tr: 'kişisel bilgi' },
      { en: 'cyberbullying', tr: 'siber zorbalık' },
      { en: 'stranger', tr: 'yabancı (tanımadığın kişi)' },
      { en: 'download', tr: 'indirmek' },
      { en: 'share', tr: 'paylaşmak' },
      { en: 'block', tr: 'engellemek' },
      { en: 'report', tr: 'şikâyet etmek, bildirmek' },
      { en: 'netiquette', tr: 'internet görgü kuralları' },
    ],
    phrases: [
      'You should use a strong password.',
      "You mustn't share your password with anyone.",
      'Never meet strangers from the internet.',
      'Tell an adult if someone bullies you online.',
    ],
    grammar: {
      title: 'Tavsiye ve zorunluluk: should / shouldn\'t, must / mustn\'t',
      points: [
        '"should / shouldn\'t" tavsiye verir: yapman iyi olur / yapmasan iyi olur.',
        '"must" güçlü zorunluluk, "mustn\'t" yasak bildirir: kesinlikle yapmamalısın.',
        'Her iki yapıdan sonra fiil yalın hâlde gelir (should use, mustn\'t share).',
      ],
      examples: [
        "You shouldn't spend too much time online.",
        'You must ask your parents before you download an app.',
        "You mustn't click on links from strangers.",
      ],
    },
    model: {
      kind: 'passage',
      title: 'Stay Safe Online',
      text:
        'The internet is useful for homework and for chatting with friends, but it can also be dangerous. You should create a strong password and change it often. You mustn\'t share personal information like your address or phone number. If a stranger sends you a message, don\'t answer. If someone is cyberbullying you, block and report them, and tell an adult you trust. Finally, be polite online and think before you share anything.',
    },
    tipTr:
      'Kural ve uyarı afişlerinde "mustn\'t" = yasak, "don\'t have to" = gerekli değil. Bu ikisi farklı anlamdadır; seçeneklerde sık sık karıştırılır.',
  },
  {
    id: 6,
    name: 'Adventures',
    trName: 'Maceralar',
    words: [
      { en: 'rafting', tr: 'rafting (bot ile nehirde iniş)' },
      { en: 'paragliding', tr: 'yamaç paraşütü' },
      { en: 'scuba diving', tr: 'tüplü dalış' },
      { en: 'rock climbing', tr: 'kaya tırmanışı' },
      { en: 'brave', tr: 'cesur' },
      { en: 'thrilling', tr: 'heyecan verici' },
      { en: 'dangerous', tr: 'tehlikeli' },
      { en: 'equipment', tr: 'ekipman, malzeme' },
      { en: 'get lost', tr: 'kaybolmak' },
      { en: 'miss the bus', tr: 'otobüsü kaçırmak' },
    ],
    phrases: [
      'It was the most thrilling day of my life!',
      "I'd rather go rafting than go paragliding.",
      'We got lost in the forest.',
      'What a terrible trip!',
    ],
    grammar: {
      title: 'Geçmiş zaman (past simple) ve şimdiki zamanın hikâyesi (past continuous)',
      points: [
        'Past simple geçmişte tamamlanmış olayları anlatır; düzenli fiillere -ed eklenir (climbed), düzensiz fiillerin ikinci hâli kullanılır (go → went).',
        'Past continuous (was/were + fiil-ing) geçmişte bir anda devam eden eylemi anlatır.',
        '"while" ile devam eden uzun eylem, "when" ile onu bölen kısa eylem verilir.',
      ],
      examples: [
        'We went scuba diving in Kaş last summer.',
        'While we were climbing the rock, it started to rain.',
        'I was taking photos when I dropped my phone.',
      ],
    },
    model: {
      kind: 'passage',
      title: 'An Unforgettable Trip',
      text:
        'Last July, my family and I went to Antalya for a rafting tour. The guide gave us helmets and life jackets, and we listened to the safety rules carefully. While we were going down the river, the boat hit a big rock and my brother fell into the water! Luckily, he was wearing his life jacket, so the guide pulled him back quickly. We were all scared, but in the end it was a thrilling day.',
    },
    tipTr:
      'Okuma metinlerinde olayların sırasını soran sorular çok çıkar. "while" ve "when" bağlaçları hangi olayın önce başladığını gösterir.',
  },
  {
    id: 7,
    name: 'Tourism',
    trName: 'Turizm',
    words: [
      { en: 'accommodation', tr: 'konaklama' },
      { en: 'sightseeing', tr: 'gezip görme' },
      { en: 'historical site', tr: 'tarihi yer' },
      { en: 'guided tour', tr: 'rehberli tur' },
      { en: 'souvenir', tr: 'hatıra eşya' },
      { en: 'reservation', tr: 'rezervasyon' },
      { en: 'single ticket', tr: 'tek yön bilet' },
      { en: 'return ticket', tr: 'gidiş-dönüş bilet' },
      { en: 'expensive', tr: 'pahalı' },
      { en: 'affordable', tr: 'uygun fiyatlı' },
    ],
    phrases: [
      'Excuse me, how can I get to the museum?',
      'Go straight and turn left at the traffic lights.',
      "It's next to the post office.",
      'How much is a return ticket?',
    ],
    grammar: {
      title: 'Gelecek planları: "be going to" ve "will"; yol tarifi',
      points: [
        '"be going to" önceden yapılmış planları anlatır.',
        '"will" konuşma anında verilen kararları ve tahminleri anlatır.',
        'Yol tarifinde emir kipi kullanılır: go straight, turn left/right, take the second street.',
      ],
      examples: [
        "We're going to visit Ephesus next summer.",
        "It's hot. I think I'll buy a cold drink.",
        'Turn right and the hotel is on your left.',
      ],
    },
    model: {
      kind: 'dialogue',
      lines: [
        { speaker: 'Tourist', text: 'Excuse me, how can I get to Galata Tower?' },
        { speaker: 'Kerem', text: "Go straight along this street and turn left at the bank." },
        { speaker: 'Tourist', text: 'Is it far from here?' },
        { speaker: 'Kerem', text: "No, it's about ten minutes on foot. You can also take the tram." },
        { speaker: 'Tourist', text: "I'll walk, then. Is there a good place for souvenirs near it?" },
        { speaker: 'Kerem', text: "Yes, there are lots of small shops opposite the tower, and they're affordable." },
        { speaker: 'Tourist', text: 'Thank you very much!' },
      ],
    },
    tipTr:
      'Yol tarifi sorularında haritadaki başlangıç noktasını ve yönleri (left/right, opposite, next to, between) parmağınla takip ederek ilerle.',
  },
  {
    id: 8,
    name: 'Chores',
    trName: 'Ev İşleri',
    words: [
      { en: 'do the laundry', tr: 'çamaşır yıkamak' },
      { en: 'do the washing-up', tr: 'bulaşık yıkamak' },
      { en: 'make the bed', tr: 'yatağı toplamak' },
      { en: 'take out the rubbish', tr: 'çöpü çıkarmak' },
      { en: 'vacuum', tr: 'elektrik süpürgesi ile süpürmek' },
      { en: 'iron', tr: 'ütülemek' },
      { en: 'tidy up', tr: 'toparlamak, düzenlemek' },
      { en: 'water the plants', tr: 'çiçekleri sulamak' },
      { en: 'responsibility', tr: 'sorumluluk' },
    ],
    phrases: [
      'Whose turn is it to do the washing-up?',
      'I have to tidy up my room every Saturday.',
      "You don't have to iron your T-shirts.",
      'I hate doing the laundry.',
    ],
    grammar: {
      title: 'Zorunluluk: have to / don\'t have to; "too" ve "enough"',
      points: [
        '"have to / has to" bir zorunluluğu, "don\'t / doesn\'t have to" ise gereklilik olmadığını anlatır.',
        '"too + sıfat" gereğinden fazla anlamı verir (too tired); "sıfat + enough" yeterli anlamı verir (old enough).',
      ],
      examples: [
        'My brother has to take out the rubbish every evening.',
        "I don't have to cook because my dad cooks dinner.",
        "I'm too tired to vacuum, but I'm old enough to do the laundry.",
      ],
    },
    model: {
      kind: 'passage',
      title: 'Sharing the Housework',
      text:
        "In my family, everybody has a responsibility at home. My mum does the laundry and my dad cooks dinner. My little sister is too young to use the vacuum cleaner, but she is old enough to water the plants. I have to make my bed every morning and do the washing-up after dinner. At the weekend we all tidy up the house together. I don't love chores, but sharing them is fair.",
    },
    tipTr:
      'Önce tablonun/grafiğin başlıklarını oku (satırlar ve sütunlar neyi gösteriyor?), sonra her seçeneği veriyle tek tek karşılaştır.',
  },
  {
    id: 9,
    name: 'Science',
    trName: 'Bilim',
    words: [
      { en: 'invention', tr: 'icat' },
      { en: 'inventor', tr: 'mucit' },
      { en: 'discover', tr: 'keşfetmek' },
      { en: 'experiment', tr: 'deney' },
      { en: 'scientist', tr: 'bilim insanı' },
      { en: 'laboratory', tr: 'laboratuvar' },
      { en: 'develop', tr: 'geliştirmek' },
      { en: 'research', tr: 'araştırma' },
      { en: 'result', tr: 'sonuç' },
    ],
    phrases: [
      'The telephone was invented by Alexander Graham Bell.',
      'Scientists do experiments to find answers.',
      'What a useful invention!',
      'It is used for measuring temperature.',
    ],
    grammar: {
      title: 'Edilgen yapı (passive voice) ve amaç bildirme: "to + fiil" / "so that"',
      points: [
        'Edilgen yapı: am/is/are veya was/were + fiilin üçüncü hâli (V3). Eylemi yapanı belirtmek için "by" kullanılır.',
        'Amaç bildirmek için "to + fiil" ya da "so that + cümle" kullanılır: … için / … sın diye.',
      ],
      examples: [
        'Penicillin was discovered by Alexander Fleming in 1928.',
        'Microscopes are used to see very small things.',
        'She wears goggles so that her eyes are safe.',
      ],
    },
    model: {
      kind: 'passage',
      title: 'A Turkish Scientist',
      text:
        'Aziz Sancar is a Turkish scientist. He was born in Mardin in 1946. He studied medicine in Istanbul and then went to the USA to do research. He worked in a laboratory for many years so that he could understand how our cells repair their DNA. In 2015, he was awarded the Nobel Prize in Chemistry. Today, his research is used to develop new treatments for cancer.',
    },
    tipTr:
      'Metinde "was/were + V3" gördüğünde cümle edilgendir: önemli olan eylemi kimin yaptığı değil, neyin yapıldığıdır. "by"dan sonra gelen kişi eylemi yapandır.',
  },
  {
    id: 10,
    name: 'Natural Forces',
    trName: 'Doğal Afetler',
    words: [
      { en: 'earthquake', tr: 'deprem' },
      { en: 'flood', tr: 'sel' },
      { en: 'volcano', tr: 'yanardağ' },
      { en: 'tornado', tr: 'hortum' },
      { en: 'drought', tr: 'kuraklık' },
      { en: 'wildfire', tr: 'orman yangını' },
      { en: 'emergency kit', tr: 'acil durum çantası' },
      { en: 'shelter', tr: 'sığınak, barınak' },
      { en: 'precaution', tr: 'önlem' },
      { en: 'damage', tr: 'hasar' },
    ],
    phrases: [
      'Drop, cover and hold on!',
      'Stay away from windows during an earthquake.',
      'Prepare an emergency kit for your family.',
      'If there is a flood, go to higher ground.',
    ],
    grammar: {
      title: 'Birinci tip koşul cümleleri (first conditional) ile uyarılar',
      points: [
        'Yapı: If + geniş zaman (present simple), … will + fiil. Gerçek ve olası durumları anlatır.',
        '"If" cümlesi başta ya da sonda olabilir; başta ise iki cümle arasına virgül konur.',
        'Uyarılarda ana cümlede emir kipi de kullanılabilir: If there is a fire, call 112.',
      ],
      examples: [
        'If you stay near the window, the glass will hurt you.',
        "We won't have enough water if it doesn't rain this year.",
        'If the ground shakes, get under a strong table.',
      ],
    },
    model: {
      kind: 'passage',
      title: 'Be Ready for an Earthquake',
      text:
        'Turkey is on an active fault line, so earthquakes happen often. We cannot stop them, but we can take precautions. Every family should prepare an emergency kit with water, food, a torch and a first aid box. Fix heavy furniture to the walls. If an earthquake starts, drop, cover and hold on. Stay away from windows. If you are outside, move to an open area. If everyone is ready, there will be less damage and fewer injuries.',
    },
    tipTr:
      'Koşul cümlelerinde "if" kısmı sebebi, diğer kısım sonucu verir. "What will happen if …?" sorularında cevabı metindeki sonuç cümlesinde ara.',
  },
];
