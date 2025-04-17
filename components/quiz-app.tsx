'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle } from 'lucide-react'

// Define the question type
interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
  lastAnswered?: number
  lastShown?: number // Add this new property
  correctCount: number
  incorrectCount: number
}

// Sample questions - replace these with your actual questions
const sampleQuestions: Question[] = [
  {
    id: 'q6_1',
    text: 'Je možné LP Stavba, Domácnost, Jiná stavba, ATYP v produktu Můj majetek 2.0 uvést do role pojištěného i IČO?',
    options: [
      'pouze pokud je fyzická osoba podnikající',
      'ano, fyzická osoba podnikající i právnická osoba podnikající',
      'ne, IČO může být pouze v roli pojistníka',
    ],
    correctAnswer: 'ano, fyzická osoba podnikající i právnická osoba podnikající',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q31_1',
    text: 'Asistenci můžeme rozdělit do:',
    options: ['dvou okruhů - start a cíl', 'nerozdělujeme', 'tří okruhů - technická, právní a IT'],
    correctAnswer: 'tří okruhů - technická, právní a IT',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q46_1',
    text: 'Je základní asistence povinná?',
    options: ['Ne', 'Ano', 'Základní asistence je volitelná a záleží na klientovi, zda se pro ni rozhodne.'],
    correctAnswer: 'Ano',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q57_1',
    text: 'Jakou maximální škodu může žádat zaměstnavatel po svém zaměstnanci:',
    options: [
      'čtyřapůlnásobek jeho průměrného měsíčního výdělku',
      'čtyřnásobek jeho průměrného měsíčního výdělku',
      'pětinásobek jeho průměrného měsíčního výdělku',
    ],
    correctAnswer: 'čtyřapůlnásobek jeho průměrného měsíčního výdělku',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q36_1',
    text: 'V domácnosti nepojistíme:',
    options: ['Věci pronajímatele', 'Věci podnájemníků', 'Věci nájemníků'],
    correctAnswer: 'Věci podnájemníků',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q14_1',
    text: 'U pojištění domácnosti v produktu Můj majetek 2.0 je limit pro samostatně nebytové prostory:',
    options: ['limitem na první riziko', 'samostatným limitem nad pojistnou částku domácnosti', 'sublimitem pojistné částky domácnosti'],
    correctAnswer: 'samostatným limitem nad pojistnou částku domácnosti',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q40_1',
    text: 'Jakou je možno poskytnout slevu na pojistném, pokud je v pojištění staveb pojišťována budova ve výstavbě nebo novostavba (nikoli rekonstrukce stávajícího objektu)?',
    options: [
      'Trvalá sleva ve výši 40 %, pokud byla stavba zahájena do 1 měsíce od vydání stavebního povolení.',
      'automatickou slevu za novostavbu ve výši 5% (navíc je možné uplatnit obchodní slevu)',
      'Ve výši 30 %, pokud byla smlouva sepsána do 12 měsíců od vydání stavebního povolení.',
    ],
    correctAnswer: 'automatickou slevu za novostavbu ve výši 5% (navíc je možné uplatnit obchodní slevu)',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q19_1',
    text: 'Co nelze pojistit v rámci pojištění domácnosti?',
    options: [
      'Soubor hmotných movitých věcí, které tvoří vybavení domácnosti.',
      'Stavební součásti tvořící vnitřní prostor bytu a souvisejících prostor.',
      'Hodnotu věcí, která vyplývá z autorského práva.',
    ],
    correctAnswer: 'Hodnotu věcí, která vyplývá z autorského práva.',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q24_1',
    text: 'Vedlejší stavba (LP Stavba):',
    options: ['Nesmí být určena k bydlení', 'Může být určena k bydlení', 'Nepojistíme'],
    correctAnswer: 'Může být určena k bydlení',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q20_1',
    text: 'U volitelného připojištění Porosty na pozemku a zahradní architektura nepojistíme:',
    options: ['živé ploty', 'jednoleté rostliny', 'trvalky'],
    correctAnswer: 'jednoleté rostliny',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q47_1',
    text: 'Základní asistence je:',
    options: ['Zdarma, pokud má člověk sjednáno pojištění odpovědnosti.', 'Zdarma', 'Za 1,- ročně.'],
    correctAnswer: 'Zdarma',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q23_1',
    text: 'Nebytové prostory v rámci domácnosti lze pojistit:',
    options: [
      'Pouze na adrese, kde se nachází pojištěná domácnost',
      'Kdekoliv na území ČR',
      'Pouze v obci, kde se nachází pojištěná domácnost',
    ],
    correctAnswer: 'Kdekoliv na území ČR',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q2',
    text: 'Pojištění Mazlíček je určeno pro:',
    options: ['Psy a kočky', 'Exotická zvířata', 'Jakákoliv malá domácí zvířata (max. do velikosti ovcí a koz)'],
    correctAnswer: 'Psy a kočky',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q6',
    text: 'U pojištění Mazlíček lze na jedné smlouvě pojistit:',
    options: [
      'Až 5 zvířat včetně jejich vzájemné kombinace',
      'Až 10 zvířat včetně jejich vzájemné kombinace',
      'Až 3 zvířata včetně jejich vzájemné kombinace',
    ],
    correctAnswer: 'Až 5 zvířat včetně jejich vzájemné kombinace',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q10_1',
    text: 'Co to jsou v rámci pojistných podmínek pro Můj majetek 2.0 ekologické náklady?',
    options: [
      'tento pojem se přímo ve VPP nevyskytuje, jedná se o žolíka, kdy pojišťovna v případě totální škody na LP stavba vyplatí dvojnásobek PČ',
      'tento pojem se přímo ve VPP nevyskytuje, ale jedná se o náklady, které pojišťovna vyplatí v případě částečné škody',
      'tento pojem se přímo ve VPP nevyskytuje, ale jedná se o náklady, které budou vyplaceny nad PČ u LP Stavba a to v případě škody nad 50 % pojistné částky',
    ],
    correctAnswer:
      'tento pojem se přímo ve VPP nevyskytuje, ale jedná se o náklady, které budou vyplaceny nad PČ u LP Stavba a to v případě škody nad 50 % pojistné částky',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q8_1',
    text: 'Jak jsou pojištěny porosty na pozemku v rámci LP Stavba?',
    options: [
      'jako připojištění a to na jednoznačně vyjmenovaná pojistná nebezpečí dle VPP – živel, vodovodní škody, P/Z, odcizení, vandal, sprejer, přepětí, sklo',
      'jako předmět pojištění a to na všechna pojistná nebezpečí sjednaná v PS – dle sjednaného typu balíčku',
      'jako předmět pojištění a to na jednoznačně vyjmenovaná pojistná nebezpečí dle VPP – živel, vodovodní škody, P/Z, odcizení, vandal, sprejer, přepětí, sklo',
    ],
    correctAnswer:
      'jako připojištění a to na jednoznačně vyjmenovaná pojistná nebezpečí dle VPP – živel, vodovodní škody, P/Z, odcizení, vandal, sprejer, přepětí, sklo',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q58_1',
    text: 'Kolektivní odpovědnost lze sjednat od:',
    options: ['8 osob', '10 osob', '15 osob'],
    correctAnswer: '10 osob',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q45_1',
    text: 'Pojištění odpovědnosti z běžného občanského života se nevztahuje na:',
    options: ['Jízdu na motokárách', 'Létání s dronem', 'Jízda na koni'],
    correctAnswer: 'Jízdu na motokárách',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q1_1',
    text: 'V jaké ceně bude v případě poškození pojišťovna plnit z pojištění domácnosti, pokud byla časová cena pojištěné věci (sedací souprava) bezprostředně před vznikem pojistné události nižší než 50 % její nové ceny?',
    options: ['V nové ceně', 'V obvyklé ceně', 'V časové ceně'],
    correctAnswer: 'V nové ceně',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q29_1',
    text: 'V LP Pojištění obytných budov, bytů a souvisejících staveb pojistíme mimo jiné:',
    options: [
      'stavební materiál, dočasné objekty zařízení staveniště s výjimkou stavebních mechanismů a nářadí potřebné ke stavbě, údržbě a rekonstrukci',
      'stavební materiál, dočasné objekty zařízení staveniště, stavební mechanismy potřebné ke stavbě, údržbě a rekonstrukci s výjimkou nářadí',
      'stavební materiál, dočasné objekty zařízení staveniště, stavební mechanismy a nářadí potřebné ke stavbě, údržbě a rekonstrukci s výjimkou ručního nářadí',
    ],
    correctAnswer:
      'stavební materiál, dočasné objekty zařízení staveniště, stavební mechanismy a nářadí potřebné ke stavbě, údržbě a rekonstrukci s výjimkou ručního nářadí',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q59_1',
    text: 'Pojištění odpovědnosti z výkonu povolání se nevztahuje (pokud není ujednáno jinak) na:',
    options: ['GIBS (Generální inspekce bezpečnostních sborů)', 'Policie ČR', 'Hasičský záchranný sbor'],
    correctAnswer: 'Hasičský záchranný sbor',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q60_1',
    text: 'Připojištění Ztráty svěřených věcí se nevztahuje:',
    options: ['Ztrátu mobilního telefonu', 'Ztrátu univerzálního klíče od celé firmy', 'Odcizení mobilního telefonu'],
    correctAnswer: 'Odcizení mobilního telefonu',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q50_1',
    text: 'Jaká je podmínka pro sjednání Chytrého cestovního pojištění?',
    options: ['Žádná podmínka není', 'Sjednání občanské odpovědnosti', 'Sjednání pojištění staveb nebo pojištění domácnosti'],
    correctAnswer: 'Žádná podmínka není',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q27_1',
    text: 'V případě pojištění sportovního vybavení v Atyp – AKTIV:',
    options: [
      'Musíme ve smlouvě identifikovat předmět pojištění, pokud poptávaný limit je vyšší než 100 tis. Kč.',
      'Nemusíme ve smlouvě identifikovat předmět pojištění.',
      'Musíme ve smlouvě identifikovat předmět pojištění.',
    ],
    correctAnswer: 'Musíme ve smlouvě identifikovat předmět pojištění, pokud poptávaný limit je vyšší než 100 tis. Kč.',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q26_1',
    text: 'V rozsahu pojištění Atyp – Zahradní technika je místem pojištění:',
    options: [
      'Adresa včetně nebytových prostor, pozemek (zahrada či dvůr) jenž je v jednotném funkčním celku s místem pojištění',
      'Adresa včetně nebytových prostor, pozemek (zahrada či dvůr) jenž je v jednotném funkčním celku s místem pojištění a bezprostřední okolí mimo toto místo.',
      'Adresa včetně nebytových prostor',
    ],
    correctAnswer: 'Adresa včetně nebytových prostor, pozemek (zahrada či dvůr) jenž je v jednotném funkčním celku s místem pojištění',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q48_1',
    text: 'Jaký je maximální počet výjezdů do zahraničí v rámci Chytrého cestovního pojištění?',
    options: ['Není omezen', '36 výjezdů za rok', '10 výjezdů za rok'],
    correctAnswer: 'Není omezen',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q56_1',
    text: 'Musí být osoby, které chci pojistit chytrým pojištěním uvedeny ve smlouvě?',
    options: [
      'Nemusí, pojištění se automaticky vztahuje na osoby, kteří žijí ve společné domácnosti – manžel/ka, partner/ka, registrovaný partner/ka a děti do 26 let.',
      'Ano, všechny osoby musí být uvedeny v roli pojištěný',
      'Nemusí, pokud to jsou příbuzní v řadě přímé.',
    ],
    correctAnswer: 'Ano, všechny osoby musí být uvedeny v roli pojištěný',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q7_1',
    text: 'Jsou předmětem pojištění v rámci pojištění staveb vířivky (myšleno pevné, nikoli nafukovací)',
    options: [
      'ne',
      'ano, jsou pojištěny v rámci vedlejších staveb',
      'ano, ale pouze pokud je zapuštěná minimálně z 1/2 své výšky v okolním terénu',
    ],
    correctAnswer: 'ano, jsou pojištěny v rámci vedlejších staveb',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q32_1',
    text: 'Trvale užívaným bytem se rozumí byt obývaný více jak:',
    options: ['180 dnů v roce', '120 dnů v roce', '60 dnů v roce'],
    correctAnswer: '180 dnů v roce',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q54_1',
    text: 'Chytré cestovní pojištění se vztahuje na tyto typy cest:',
    options: [
      'turistické a poznávací cesty, studijní pobyty, rekreační sporty',
      'turistické, pracovní poznávací cesty, studijní pobyty, rekreační sporty',
      'turistické a poznávací cesty, studijní pobyty, rekreační sporty a organizovaný sport',
    ],
    correctAnswer: 'turistické, pracovní poznávací cesty, studijní pobyty, rekreační sporty',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q15_1',
    text: 'Pokud jsou v novém produktu Můj majetek 2.0 movité věci umístěny v nebytových prostorech přímo komunikačně propojených s bytem pojištěné domácnosti (LP pojištění domácnosti), tak hodnota těchto věcí se:',
    options: [
      'je pojištěna na první riziko',
      'se započítává do pojistné částky pojištěné domácnosti',
      'započítává do limitu pro nebytové prostory',
    ],
    correctAnswer: 'se započítává do pojistné částky pojištěné domácnosti',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q33_1',
    text: 'V domácnosti nepojistíme:',
    options: ['zvířata chovaná k výdělečné činnosti', 'věci sloužící k výdělečné činnosti', 'věci návštěv'],
    correctAnswer: 'zvířata chovaná k výdělečné činnosti',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q52_1',
    text: 'Chytré cestovní pojištění lze sjednat max. do věku:',
    options: ['70 let', '65 let', 'Není žádný věkový limit'],
    correctAnswer: 'Není žádný věkový limit',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q49_1',
    text: 'Jaká je maximální nepřetržitá délka pobytu v zahraničí v rámci Chytrého cestovního pojištění?',
    options: ['max. 30 dní', 'Není stanovena', 'max. 60 dní'],
    correctAnswer: 'max. 60 dní',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q39_1',
    text: 'Je možné u pojištění staveb získat bonus na pojistném za bezeškodní průběh?',
    options: ['Ano, za každý rok pojištění 5 %, max. 20 %.', 'Ne', 'Ano, pouze u smluv na dobu neurčitou.'],
    correctAnswer: 'Ne',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q30_1',
    text: 'Asistence je rozdělena:',
    options: [
      'do tří variant - Základ, Nadstandard a Premium',
      'do dvou variant - Základ a Nadstandard',
      'do čtyř variant - Start, Standard, Exclusiv a Comfort',
    ],
    correctAnswer: 'do dvou variant - Základ a Nadstandard',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q25_1',
    text: 'Kdy využívám pojištění Atyp?',
    options: [
      'Když žádným ze standardních pojištění není možné uspokojit zcela individuální potřeby klienta.',
      'Když se obchodník domnívá, že daná věc v domácnosti (např. drahá podlahová krytina) by měla být pojištěna se se souhlasem upisovatele.',
      'Když nemohu najít položku, kterou bych danou stavbu (vedlejší stavbu) pojistil.',
    ],
    correctAnswer: 'Když žádným ze standardních pojištění není možné uspokojit zcela individuální potřeby klienta.',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q53_1',
    text: 'Jaký je limit na léčebné výlohy u Chytrého cestovního pojištění:',
    options: ['50 000 000', '80 000 000', '100 000 000'],
    correctAnswer: '100 000 000',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q16_1',
    text: 'Do jakého limitu jsou automaticky pojištěny vedlejší stavby v rámci LP Stavba v novém produktu Můj majetek 2.0?',
    options: [
      '15 % ze základní pojistné částky stavby',
      '5 % ze základní pojistné částky stavby',
      '20 % ze základní pojistné částky stavby',
    ],
    correctAnswer: '15 % ze základní pojistné částky stavby',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q22_1',
    text: 'V jakém limitu je vzdálená pomoc u IT asistence?',
    options: ['45min/5x ročně', '60min/5x ročně', '30min/5x ročně'],
    correctAnswer: '60min/5x ročně',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q42_1',
    text: 'U pojištění odpovědnosti v běžném občanském životě jsou spolu s pojištěným také pojištění:',
    options: [
      'manžel/ka, druh/družka, registr.partner, děti do 30 let (musí být svobodné, bezdětné a s pojištěným sdílet společnou domácnost)',
      'Vedle pojištěného jsou dalšími spolupojištěnými osobami všechny fyzické osoby,které spolu s pojištěným trvale žijí ve společné domácnosti a podílí se na jejím chodu.',
      'manžel/ka, druh/družka, registr.partner, děti do 18 let (musí být svobodné, bezdětné a s pojištěným sdílet společnou domácnost)',
    ],
    correctAnswer:
      'Vedle pojištěného jsou dalšími spolupojištěnými osobami všechny fyzické osoby,které spolu s pojištěným trvale žijí ve společné domácnosti a podílí se na jejím chodu.',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q18_1',
    text: 'Připojištění Aktiv, které se týká jakéhokoliv sportovního vybavení oprávněných osob sloužící k soukromému použití pro amatérský sport, se sjednává s územním rozsahem:',
    options: ['Evropa', 'Svět', 'Česká republika'],
    correctAnswer: 'Svět',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q12_1',
    text: 'Pojištění bytové jednotky sjednáváme v produktu Můj majetek 2.0 na:',
    options: ['pojistnou částku v nové hodnotě', 'limit plnění', 'pojistnou částka se zohledněním tržních faktorů'],
    correctAnswer: 'pojistnou částka se zohledněním tržních faktorů',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q55_1',
    text: 'Musí všechny osoby pojištěné chytrým cestovním pojištěním cestovat společně?',
    options: ['Ano', 'Ne', 'Nemusí, pokud tuto skutečnost oznámí pojišťovně minimálně 24 hod. před započetím cesty'],
    correctAnswer: 'Ne',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q2_1',
    text: 'Klientovi byl odcizen mobilní telefon z auta. Kdy je tato událost likvidní z pojištění domácnosti?',
    options: ['Pokud byl telefon v uzavřeném zavazadlovém prostoru', 'Pokud byl telefon na palubní desce.', 'Tato událost není likvidní.'],
    correctAnswer: 'Pokud byl telefon v uzavřeném zavazadlovém prostoru',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q44_1',
    text: 'LP Asistence je u pojištění domásnosti nebo obytných budov, bytů a souvisejících staveb:',
    options: ['Nelze sjednat.', 'Povinná.', 'Nepovinná, ale je zdarma.'],
    correctAnswer: 'Povinná.',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q17_1',
    text: 'Vedlejší stavby lze pojistit bez nutnosti úpisu maximálně na:',
    options: ['Na 30 % sjednané pojistné částky pro pojištěnou stavbu.', '5 milionů Kč.', '2 miliony Kč.'],
    correctAnswer: '5 milionů Kč.',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q3_1',
    text: 'Uhradíme z pojištění skla a sanity škody na rámech a osazeních, popř. skleněných mozaikách a jiných formách uměleckého zasklení?',
    options: ['max. 20% za sjednaného limitu', 'ano', 'ne'],
    correctAnswer: 'ano',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q13_1',
    text: 'Bytové jednotky jsou v produktu Můj majetek 2.0:',
    options: ['indexovány indexem cen stavebních děl', 'nejsou indexovány', 'indexovány indexem stavebních prací'],
    correctAnswer: 'indexovány indexem stavebních prací',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q11_1',
    text: 'Vodovodní škody lze u produktu Můj majetek 2.0 odpojistit:',
    options: [
      'u staveb a domácností obydlených méně než 180 dnů v kalendářním roce',
      'u staveb obydlených méně než 250 v kalendářním roce',
      'u staveb obydlených méně než 200 v kalendářním roce',
    ],
    correctAnswer: 'u staveb a domácností obydlených méně než 180 dnů v kalendářním roce',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q21_1',
    text: 'Pokud sjednávám LP Domácnost nebo LP Stavba je povinné sjednat základní asistenci?',
    options: ['Základní asistence je volitelná a záleží na klientovi, zda se pro ni rozhodne.', 'Ano', 'Ne'],
    correctAnswer: 'Ano',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q35_1',
    text: 'V pojištění Můj majetek 2.0 můžeme pojistit:',
    options: [
      'Pouze jednu domácnost',
      'Až pět domácností – pro každou je nutné uvést místo pojištění.',
      'Až tři domácnosti – pro každou je nutné uvést místo pojištění.',
    ],
    correctAnswer: 'Až pět domácností – pro každou je nutné uvést místo pojištění.',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q41_1',
    text: 'Pro dětský kočárek platí v pojištění domácnosti územní rozsah (popř. místo pojištění):',
    options: ['Evropa', 'Svět', 'Česká republika'],
    correctAnswer: 'Svět',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q9_1',
    text: 'U vodovodních škod - lom trubky je limit:',
    options: ['není limit', '200.000', '100.000'],
    correctAnswer: 'není limit',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q5_1',
    text: 'Jak správně pojistit kuchyňskou linku?',
    options: [
      'v rámci pojištění domácnosti musí být pojištěna vždy a to v rámci souboru hmotných movitých věcí',
      've stavbě a v pojištění domácnosti ji považujeme za stavební součásti (o její hodnotu musí být navýšen limit pro stavební součásti)',
      'v atypu',
    ],
    correctAnswer:
      've stavbě a v pojištění domácnosti ji považujeme za stavební součásti (o její hodnotu musí být navýšen limit pro stavební součásti)',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q51_1',
    text: 'Součástí chytrého cestovního pojištění není:',
    options: ['Pojištění odpovědnosti', 'Sublimit na akutní ošetření zubů', 'Pojištění cestovních zavazadel'],
    correctAnswer: 'Pojištění odpovědnosti',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q1_mazlicek',
    text: 'Pojištění mazlíček nabízí možnost výběru:',
    options: [
      'Ze dvou balíčků – Základ a Nadstandard',
      'Ze tří balíčků – Start, Standard, Exklusive',
      'Ze čtyř balíčků – Start, Standard, Exklusive, Comfort',
    ],
    correctAnswer: 'Ze tří balíčků – Start, Standard, Exklusive',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q31_1',
    text: 'Jinou stavbou lze mimo jiné pojistit i zahradní chatku do:',
    options: ['25m2', '15m2', '10m2'],
    correctAnswer: '25m2',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q34_1',
    text: 'U domácnosti podpojištění:',
    options: ['Uplatňujeme, pokud je PČ nižší o 20% než je pojistná hodnota', 'Uplatňujeme vždy', 'Neuplatňujeme'],
    correctAnswer: 'Uplatňujeme, pokud je PČ nižší o 20% než je pojistná hodnota',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q37_1',
    text: 'V pojištění domácnosti jsou za věci za pozemku považovány:',
    options: [
      'zahradní nábytek, dětské herní prvky, zahradní grily, bazény, které nejsou vedlejší stavbou a nafukovací vířivky včetně příslušenství k nim, zvířata (nikoli ale chovaná k výdělečným účelům) a jejich přibytky',
      'jen zahradní nábytek, dětské herní prvky a zahradní grily',
      'jen zahradní nábytek a zahradní grily',
    ],
    correctAnswer:
      'zahradní nábytek, dětské herní prvky, zahradní grily, bazény, které nejsou vedlejší stavbou a nafukovací vířivky včetně příslušenství k nim, zvířata (nikoli ale chovaná k výdělečným účelům) a jejich přibytky',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q10_ekologicke_naklady',
    text: 'Co to jsou v rámci pojistných podmínek pro Můj majetek 2.0 ekologické náklady?',
    options: [
      'tento pojem se přímo ve VPP nevyskytuje, ale jedná se o náklady, které budou vyplaceny nad PČ u LP Stavba a to v případě škody nad 50 % pojistné částky',
      'tento pojem se přímo ve VPP nevyskytuje, ale jedná se o náklady, které pojišťovna vyplatí v případě částečné škody',
      'tento pojem se přímo ve VPP nevyskytuje, jedná se o žolíka, kdy pojišťovna v případě totální škody na LP stavba vyplatí dvojnásobek PČ',
    ],
    correctAnswer:
      'tento pojem se přímo ve VPP nevyskytuje, ale jedná se o náklady, které budou vyplaceny nad PČ u LP Stavba a to v případě škody nad 50 % pojistné částky',
    correctCount: 0,
    incorrectCount: 0,
  },
]

export function QuizApp() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  // Initialize questions from localStorage or use sample questions
  useEffect(() => {
    const storedQuestions = localStorage.getItem('bankingQuizQuestions')
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions))
    } else {
      setQuestions(sampleQuestions)
    }
  }, [])

  // Save questions to localStorage whenever they change
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem('bankingQuizQuestions', JSON.stringify(questions))
    }
  }, [questions])

  // Select a new question when needed
  useEffect(() => {
    if (questions.length > 0 && !currentQuestion) {
      selectNextQuestion()
    }
  }, [questions, currentQuestion])

  // Algorithm to select the next question based on spaced repetition
  const selectNextQuestion = () => {
    if (questions.length === 0) return

    // Calculate a score for each question (lower is more likely to be shown)
    const now = Date.now()
    const scoredQuestions = questions.map(q => {
      // Base score on correct/incorrect ratio and time since last seen
      const correctRatio = q.correctCount / (q.correctCount + q.incorrectCount + 1)
      const daysSinceLastSeen = q.lastAnswered ? (now - q.lastAnswered) / (1000 * 60 * 60 * 24) : 100

      // Calculate time since this question was last shown (to prevent immediate repeats)
      const minutesSinceLastShown = q.lastShown ? (now - q.lastShown) / (1000 * 60) : 1000

      // Add a significant penalty for recently shown questions (ensures variety)
      const recencyPenalty = minutesSinceLastShown < 1 ? 1000 : 0

      // Questions answered correctly more often and seen recently get higher scores (less likely to be shown)
      // Questions answered incorrectly more often and not seen recently get lower scores (more likely to be shown)
      // But we add the recency penalty to prevent immediate repeats
      const score = correctRatio * 10 - daysSinceLastSeen * (1 - correctRatio) + recencyPenalty

      return { question: q, score }
    })

    // Sort by score (ascending)
    scoredQuestions.sort((a, b) => a.score - b.score)

    // Exclude the current question from selection if possible
    const filteredQuestions =
      currentQuestion && scoredQuestions.length > 1 ? scoredQuestions.filter(q => q.question.id !== currentQuestion.id) : scoredQuestions

    // Select one of the top questions (or fewer if we have fewer questions)
    // Increase this number to add more variety
    const topN = Math.min(3, filteredQuestions.length)
    const randomIndex = Math.floor(Math.random() * topN)
    const nextQuestion = filteredQuestions[randomIndex].question

    // Update the lastShown timestamp for the selected question
    setQuestions(questions.map(q => (q.id === nextQuestion.id ? { ...q, lastShown: now } : q)))

    setCurrentQuestion(nextQuestion)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCorrect(null)
  }

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered || !currentQuestion) return

    setSelectedAnswer(answer)
    const correct = answer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setIsAnswered(true)

    // Update question stats
    setQuestions(
      questions.map(q => {
        if (q.id === currentQuestion.id) {
          return {
            ...q,
            lastAnswered: Date.now(),
            correctCount: correct ? q.correctCount + 1 : q.correctCount,
            incorrectCount: correct ? q.incorrectCount : q.incorrectCount + 1,
          }
        }
        return q
      })
    )
  }

  // Handle next question button
  const handleNextQuestion = () => {
    setCurrentQuestion(null)
  }

  // Reset all progress
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      const resetQuestions = questions.map(q => ({
        ...q,
        lastAnswered: undefined,
        correctCount: 0,
        incorrectCount: 0,
      }))
      setQuestions(resetQuestions)
      setCurrentQuestion(null)
      localStorage.removeItem('bankingQuizQuestions')
    }
  }

  if (!currentQuestion) {
    return <div className='text-center'>Loading questions...</div>
  }

  return (
    <div className='space-y-6'>
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-xl'>{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedAnswer === option
                    ? isCorrect
                      ? 'success'
                      : 'destructive'
                    : isAnswered && option === currentQuestion.correctAnswer
                    ? 'success'
                    : 'outline'
                }
                className={`w-full justify-start text-left p-4 h-auto ${
                  isAnswered ? 'cursor-default' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
              >
                {option}
                {isAnswered && option === selectedAnswer && isCorrect && <CheckCircle className='ml-auto h-5 w-5' />}
                {isAnswered && option === selectedAnswer && !isCorrect && <XCircle className='ml-auto h-5 w-5' />}
                {isAnswered && !isCorrect && option === currentQuestion.correctAnswer && <CheckCircle className='ml-auto h-5 w-5' />}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          {isAnswered && (
            <Alert variant={isCorrect ? 'success' : 'destructive'} className='w-full'>
              <AlertDescription>
                {isCorrect ? 'Correct! Well done.' : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`}
              </AlertDescription>
            </Alert>
          )}
          {isAnswered && (
            <Button onClick={handleNextQuestion} className='w-full'>
              Next Question
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className='flex justify-between'>
        <div className='text-sm text-gray-500'>Questions in rotation: {questions.length}</div>
        <Button variant='outline' size='sm' onClick={handleReset}>
          Reset Progress
        </Button>
      </div>
    </div>
  )
}
