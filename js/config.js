/* ===== Ustawienia strony — edytuj tylko ten plik ===== */

// Dane produktu (wstawiane w miejsca z atrybutem data-product)
const PRODUCT = {
  name: "ErektoMax",
  status: "Suplement diety wspierający libido i potencję u mężczyzn",
  price: "119", // aktualna cena, zł
  lowestPrice: "238", // najniższa cena z 30 dni przed obniżką, zł
  form: "Kapsułki",
  quantity: "30 kapsułek w opakowaniu",
  features: "Specjalnie wyselekcjonowane składniki, aby maksymalnie wesprzeć Cię w działaniu",
};

// Webhook (Make), na który trafiają zgłoszenia z formularza
const WEBHOOK_URL = "https://hook.eu2.make.com/empturs640mn6adye81n9typ8a7qhnf5";

// Meta Pixel ładuje się dopiero po zgodzie na cookies
const META_PIXEL_ID = "1570463194854392";

// Opinie klientów — tylko prawdziwe, dopuszczone do publikacji.
// Pola name, date, rating (1–5), photo są opcjonalne, text jest wymagany.
const REVIEWS = [
  {
    name: "Krzysztof M.",
    rating: 5,
    text: "Wow! To jest, czego szukałem. Najważniejsze, że moja żona jest bardzo zadowolona :) Polecam serdecznie, mega efekty!",
  },
  {
    name: "Tomek",
    rating: 5,
    text: "Jestem bardzo zadowolony z kuracji którą mi zaproponowano. Stosowałem już kilka innych, ale ten jest najlepszy! Dzięki i będę kontynuował, pozdrawiam.",
  },
  {
    name: "Wiktor W.",
    rating: 5,
    text: "Biorę suplement diety regularnie, dzięki czemu już problemy u mnie nie występują. Bardzo duża różnica zaszłą w moim organizmie, polecam.",
  },
  {
    name: "Zdzisław Kawa",
    rating: 5,
    text: "Produkt inny niż pozostałe, skład bardzo fajny i przede wszystkim dobre ilości składników. Będę wracał po ten produkt!",
  },
  {
    name: "Klient",
    rating: 5,
    text: "Kupiłem na próbę, a zakup okazał się strzałem w 10! Żadnych skutków ubocznych, a zmiana bardzo duża dla mnie, czuję moc po kapsułkach.",
  },
];
