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
  correctCount: number
  incorrectCount: number
}

// Sample questions - replace these with your actual questions
const sampleQuestions: Question[] = [
  {
    id: 'q13',
    text: 'Co všechno kryje pojištění Hospitalizace úrazem?',
    options: [
      'Pobyt v nemocnici, lázních, léčebnách, ozdravovnách, rehabilitačních ústavech, LDN a hospicích z důvodu úrazu',
      'Pobyt v nemocnici z důvodu nemoci',
      'Pobyt v nemocnici z důvodu nemoci a úrazu',
    ],
    correctAnswer: 'Pobyt v nemocnici, lázních, léčebnách, ozdravovnách, rehabilitačních ústavech, LDN a hospicích z důvodu úrazu',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q38',
    text: 'Plníme z pojištění Pracovní neschopnosti i za pracovní úrazy a nemoci?',
    options: ['Ano, ale pouze za nemoci z povolání', 'Ano', 'Ne'],
    correctAnswer: 'Ano',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q60',
    text: 'Pokud dojde k úrazu při konání vybraných adrenalinových činností, které jsou uvedeny v benefitu Neplánový adrenalin, dojde k poj. plnění z těchto rizik:',
    options: [
      'Hospitalizace úrazem, Následky závažného úrazu, Smrt úrazem',
      'Hospitalizace úrazem, Trvalé následky úrazu, Smrt úrazem, Pracovní neschopnost',
      'Hospitalizace úrazem, Trvalé následky úrazu, Smrt úrazem, Doba nezbytného léčení',
    ],
    correctAnswer: 'Hospitalizace úrazem, Trvalé následky úrazu, Smrt úrazem, Pracovní neschopnost',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q3',
    text: 'Kdo má právo na plnění z pojištění Můj život 2 v případě smrti pojištěného?',
    options: ['Manžel, manželka', 'Pojistník', 'Obmyšlený, pokud není určen, tak osoby určené podle § 2831 občanského zákoníku'],
    correctAnswer: 'Obmyšlený, pokud není určen, tak osoby určené podle § 2831 občanského zákoníku',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q37',
    text: 'Jaká je maximální progrese u Trvalých následků úrazu?',
    options: ['Trvalé následky jsou vždy bez progresivního plnění', '1000 %', '800 %'],
    correctAnswer: '1000 %',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q104',
    text: 'Jaká je čekací doba u Pojištění asistované reprodukce?',
    options: ['12 měsíců', '6 měsíců', '2 měsíce'],
    correctAnswer: '2 měsíce',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q77',
    text: 'Umožňuje pojištění Můj život 2 mimořádné výběry?',
    options: ['Ano, 12x ročně u investiční varianty', 'Ano, 1x ročně u rizikové varianty', 'Ne'],
    correctAnswer: 'Ano, 12x ročně u investiční varianty',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q102',
    text: 'Jaké všechny podmínky musí splňovat oprávněná osoba, aby bylo plněno při pojistné události z pojištění Ošetřování dítěte?',
    options: [
      'Musí mít příjem jako zaměstnanec nebo OSVČ, je uveden na dokladu o ošetřování jako žadatel o dávku, resp. osoba, která ošetřuje pojištěného',
      'Musí mít příjem jako zaměstnanec nebo OSVČ, nepobírá peněžitou pomoc v mateřství nebo rodičovský příspěvek, je uveden na dokladu o ošetřování jako žadatel o dávku, resp. osoba, která ošetřuje pojištěného, musí nahlásit PU bez zbytečného odkladu',
      'Nepobírá peněžitou pomoc v mateřství nebo rodičovský příspěvek, musí nahlásit PU bez zbytečného odkladu',
    ],
    correctAnswer:
      'Musí mít příjem jako zaměstnanec nebo OSVČ, nepobírá peněžitou pomoc v mateřství nebo rodičovský příspěvek, je uveden na dokladu o ošetřování jako žadatel o dávku, resp. osoba, která ošetřuje pojištěného, musí nahlásit PU bez zbytečného odkladu',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q97',
    text: 'Od kterého dne vyplácíme denní dávku v případě ošetřování dítěte?',
    options: ['Od 28. dne', 'Od 10. dne', 'Od 16. dne'],
    correctAnswer: 'Od 10. dne',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q27',
    text: 'Jaká je čekací doba u pojištění Ztráta soběstačnosti pro pojištěné dítě?',
    options: ['0 měsíců', '6 měsíců, u úrazu odpadá', '12 měsíců'],
    correctAnswer: '0 měsíců',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q16',
    text: 'Do kdy plníme za smrt úrazem a za smrt při dopravní nehodě?',
    options: [
      'Plníme za smrt, ke které dojde ihned při PU',
      'Plníme za smrt, ke které dojde do 3 let od PU',
      'Plníme za smrt, ke které dojde do 1 roku od PU',
    ],
    correctAnswer: 'Plníme za smrt, ke které dojde do 3 let od PU',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q63',
    text: 'Pokud dojde ke změně diagnózy v rámci jedné neschopenky:',
    options: ['Nenabíhá nová karenční doba', 'Nelze uplatnit plnění ani na první stanovenou diagnózu', 'Nabíhá nová karenční doba'],
    correctAnswer: 'Nenabíhá nová karenční doba',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q59',
    text: 'Benefit Program proti rakovině je sjednán automaticky vždy:',
    options: [
      'Když je sjednaná pojistná částka pro případ závažného onemocnění min. 200 000 Kč',
      'Když je sjednané pojištění Závažného onemocnění',
      'Když je sjednaná pojistná částka pro případ závažného onemocnění min. 100 000 Kč',
    ],
    correctAnswer: 'Když je sjednaná pojistná částka pro případ závažného onemocnění min. 200 000 Kč',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q81',
    text: 'Jaké je minimální pojistné v pojištění Můj život 2?',
    options: ['200 Kč', 'Riziková část 300 Kč + investiční část min. 100 Kč', 'Riziková část 300 Kč + investiční část min. 1 Kč'],
    correctAnswer: 'Riziková část 300 Kč + investiční část min. 1 Kč',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q118',
    text: 'Plníme při výplatě za pojistnou událost, ošetřování dospělého, i za pobyt dospělého v nemocnici?',
    options: ['Ano', 'Ne. Je hrazeno ČSSZ', 'Ano. Ale jen v případě hospitalizace úrazem'],
    correctAnswer: 'Ano',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q121',
    text: 'Jaký je limit plnění v případě pojistné události ošetřování dospělého pro OSVČ?',
    options: ['Max. 90 dnů na PU a pojistný rok', 'Max. 30 dnů na PU a pojistný rok', 'Max. 60 dnů na PU a pojistný rok'],
    correctAnswer: 'Max. 90 dnů na PU a pojistný rok',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q71',
    text: 'Pro koho je určen brand Můj život PROFI 2?',
    options: [
      'Pro studenty',
      'Pro klienty, kteří chtějí pouze využít maximalizaci daňových výhod životního pojištění',
      'Pro zaměstnance firem v korporátním segmentu, kterým na smlouvy přispívá zaměstnavatel',
    ],
    correctAnswer: 'Pro zaměstnance firem v korporátním segmentu, kterým na smlouvy přispívá zaměstnavatel',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q58',
    text: 'A Lze sjednat benefit Program proti rakovině bez zkoumání zdravotního stavu?',
    options: ['Ne', 'Ano', 'Ano od pojistné částky 200 000 Kč'],
    correctAnswer: 'Ano',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q67',
    text: 'Jaké je minimální pojistné v brandu Můj život na PENZI 2?',
    options: [
      '300 Kč',
      '100 Kč za celou poj. smlouvu do investic + pojistné za povinnou smrt',
      '200 Kč za celou poj. smlouvu do investic + pojistné za povinnou smrt',
    ],
    correctAnswer: '200 Kč za celou poj. smlouvu do investic + pojistné za povinnou smrt',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q2',
    text: 'Za jakých podmínek, při sjednané variantě s plněním od 1. dne, lze vyplácet denní dávku v případě pracovní neschopnosti?',
    options: [
      'Pokud se jedná o pracovní neschopnost v případě úrazu',
      'Po uplynutí sjednané karenční doby',
      'Po uplynutí sjednané karenční doby a po min. 24 hod. hospitalizaci',
    ],
    correctAnswer: 'Po uplynutí sjednané karenční doby',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q50',
    text: 'V případě pracovní neschopnosti z důvodu jednoho těhotenství je uhrazena doba plnění:',
    options: ['14 dní', '90 dní', '30 dní'],
    correctAnswer: '30 dní',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q5',
    text: 'Jaká je čekací doba u pojištění Invalidní renta?',
    options: ['3 měsíce v případě nemoci, 3 dny v případě úrazu', '0 měsíců', '12 měsíců, v případě úrazu odpadá'],
    correctAnswer: '0 měsíců',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q85',
    text: 'Jaké jsou podmínky pro získání Bonusu za věrnost?',
    options: [
      'Min. pojistné 500 Kč a pojistná částka na riziko Smrti min. 20 000 Kč (po celou dobu trvání smlouvy)',
      'Průměrné měs. pojistné za sjednaná pojištění po slevě min. 800 Kč a pojistná doba delší jak 10 let (podmínky výše měs. pojistného musí být splněny při uzavření nebo při změně poj. smlouvy)',
      'Min. pojistné 500 Kč a pojistná doba delší jak 10 let',
    ],
    correctAnswer:
      'Průměrné měs. pojistné za sjednaná pojištění po slevě min. 800 Kč a pojistná doba delší jak 10 let (podmínky výše měs. pojistného musí být splněny při uzavření nebo při změně poj. smlouvy)',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q109',
    text: 'Čekací doba pro riziko Ošetřování dítěte je:',
    options: ['2. měsíce od sjednání', '1. měsíc od sjednání', '6. měsíců od sjednání'],
    correctAnswer: '2. měsíce od sjednání',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q54',
    text: 'OPCE znamená?',
    options: [
      'Možnost v průběhu trvání pojištění bez zkoumání zdravotního stavu navýšit libovolně pojistnou částku u vybraných pojištění',
      'Možnost v průběhu trvání pojištění bez zkoumání zdravotního stavu navýšit pojistnou částku až o 50 % u vybraných pojištění',
      'Možnost v průběhu trvání pojištění bez zkoumání zdravotního stavu navýšit pojistnou částku o 30 % u vybraných pojištění',
    ],
    correctAnswer:
      'Možnost v průběhu trvání pojištění bez zkoumání zdravotního stavu navýšit pojistnou částku až o 50 % u vybraných pojištění',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q44',
    text: 'Jakou formou, kdy a za jakých podmínek dojde k plnění z pojištění Následky závažného úrazu:',
    options: [
      'Jednorázová výplata poj. částky při trvalém poškození těla alespoň 50 %, která se vyplácí až po ustálení následků po jednom roce',
      'Jednorázová výplata poj. částky při trvalém poškození těla alespoň 60 %, která se vyplácí až po ustálení následků po třech letech',
      'Jednorázová výplata poj. částky při trvalém poškození těla alespoň 65 %, která se vyplácí až po ustálení následků po půl roce',
    ],
    correctAnswer:
      'Jednorázová výplata poj. částky při trvalém poškození těla alespoň 50 %, která se vyplácí až po ustálení následků po jednom roce',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q98',
    text: 'Plníme při výplatě za pojistnou událost, ošetřování dítěte, i za pobyt dítěte v nemocnici?',
    options: ['Ano. Ale jen v případě hospitalizace úrazem', 'Ano', 'Ne. Je hrazeno ČSSZ'],
    correctAnswer: 'Ano',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q31',
    text: 'Odpojistí se varianta Závažného onemocnění po výplatě za jedno závažné onemocnění?',
    options: [
      'Ne. Odpojistí se pouze příslušná skupina diagnóz, která může být v příčinné souvislosti s PU, varianta nezaniká.',
      'Ne',
      'Ano',
    ],
    correctAnswer: 'Ne. Odpojistí se pouze příslušná skupina diagnóz, která může být v příčinné souvislosti s PU, varianta nezaniká.',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q94',
    text: 'Kdy vzniká nárok na výplatu Věrnostního bonusu?',
    options: ['Při dožití a úmrtí povinného pojištěného', 'Po 10 letech trvání poj. smlouvy', 'Jen při dožití smlouvy'],
    correctAnswer: 'Při dožití a úmrtí povinného pojištěného',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q108',
    text: 'Čekací doba pro riziko Hospitalizace:',
    options: ['1. měsíc od sjednání', '6. měsíců od sjednání', '2. měsíce od sjednání'],
    correctAnswer: '2. měsíce od sjednání',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q4',
    text: 'Pojištění Trvalých následků úrazu můžeme sjednat:',
    options: ['Pouze bez progrese', 'Pouze s progresí', 'S progresí i bez progrese'],
    correctAnswer: 'Pouze s progresí',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q21',
    text: 'Jaké všechny varianty výplat nabízíme u pojištění Ztráty soběstačnosti pro děti?',
    options: [
      'Jednorázovou výplatu PČ, Rentu do 18 let věku dítěte, Rentu na 30 let od PU',
      'Jednorázovou výplatu PČ, Rentu do 18 let věku dítěte',
      'Jednorázovou výplatu PČ, Rentu na 30 let od PU',
    ],
    correctAnswer: 'Jednorázovou výplatu PČ, Rentu na 30 let od PU',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q6',
    text: 'Pojistné plnění za Následky závažného úrazu se vyplácí?',
    options: [
      'Jednorázově, po prvním roce, zanechá-li úraz trvalé následky podle Oceňovacích tabulek B ve výši 50% a více % a to v součtu jednotlivých trvalých následků',
      'Jednorázově podle diagnózy stanovené min.65% poškození těla v Oceňovacích tabulkách B a je podmíněno výplatou invalidního důchodu',
      'Jednorázově podle diagnózy stanovené min.50% poškození těla v Oceňovacích tabulkách B a je podmíněno výplatou invalidního důchodu',
    ],
    correctAnswer:
      'Jednorázově, po prvním roce, zanechá-li úraz trvalé následky podle Oceňovacích tabulek B ve výši 50% a více % a to v součtu jednotlivých trvalých následků',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q100',
    text: 'Jaký je limit plnění v případě pojistné události ošetřování dítěte pro zaměstnance?',
    options: [
      'Max. 60 dnů (max.180 dnů za pojistný rok)',
      'Max. 90 dnů na PU (max. 180 dnů za pojistný rok)',
      'Max. 30 dnů na PU a pojistný rok',
    ],
    correctAnswer: 'Max. 90 dnů na PU (max. 180 dnů za pojistný rok)',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q41',
    text: 'Pojištění Závažná poranění zaniká po výplatě pojistného plnění.',
    options: ['Ano', 'Ne', 'Ano, ale jen v případě, kdy došlo k plnění z rozšířené varianty'],
    correctAnswer: 'Ne',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q89',
    text: 'Jaká je min. pojistná částka u pojištění Smrti?',
    options: ['10 000 Kč', '100 000 Kč', '1 000 Kč u rizikové varianty, u investiční varianty min. 10 000 Kč pro povinného pojištěného'],
    correctAnswer: '1 000 Kč u rizikové varianty, u investiční varianty min. 10 000 Kč pro povinného pojištěného',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q46',
    text: 'Doba výplaty pro Rentu do roku (do věku obmyšleného), v případě smrti, začína běžet:',
    options: [
      'Od smrti pojištěného, po sjednanou dobu výplaty (2 – 25 let)',
      'Od sjednání poj. smlouvy, po sjednanou dobu výplaty (2 – 25 let)',
      'Rentu do roku v případě smrti nelze sjednat',
    ],
    correctAnswer: 'Od sjednání poj. smlouvy, po sjednanou dobu výplaty (2 – 25 let)',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q20',
    text: 'Jaký je minimální vstupní věk dítěte u pojištění Ztráty soběstačnosti?',
    options: ['12 měsíců', '6 týdnů', '2 roky'],
    correctAnswer: '12 měsíců',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q27',
    text: 'Jaká je čekací doba u pojištění Ztráta soběstačnosti pro pojištěné dítě?',
    options: ['6 měsíců, u úrazu odpadá', '0 měsíců', '12 měsíců'],
    correctAnswer: '0 měsíců',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q93',
    text: 'Z čeho se počítá sleva za propojištěnost?',
    options: [
      'Z brutto pojistného úrazových rizik',
      'Z bruttopojistného životních rizik + pracovní neschopnosti',
      'Z pojistného za poj. domácnosti, stavby a PMV',
    ],
    correctAnswer: 'Z bruttopojistného životních rizik + pracovní neschopnosti',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q111',
    text: 'Diagnóza Rakovina ve stadiu in-situ je zahrnuta:',
    options: ['V Rozšířené variantě pro dospělé i děti', 'Pouze v Rozšířené variantě pro děti', 'Pouze v Rozšířené variantě pro dospělé'],
    correctAnswer: 'V Rozšířené variantě pro dospělé i děti',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q32',
    text: 'V pojištění Ztráta soběstačnosti pro dospělou osobu můžeme klienta pojistit na:',
    options: [
      'II.+III.+ IV. stupeň – PČ ,II.+III.+IV. stupeň – renta do 18 let',
      'II.+III.+ IV. stupeň – PČ, II.+III.+ IV. stupeň – renta na 30 let a Zproštění od placení v případě ztráty soběstačnosti II.+III.+ IV. st.',
      'II.+III.+ IV. stupeň – renta na 30 let, Zproštění od placení v případě ztráty soběstačnosti II.+III.+ IV. st.',
    ],
    correctAnswer:
      'II.+III.+ IV. stupeň – PČ, II.+III.+ IV. stupeň – renta na 30 let a Zproštění od placení v případě ztráty soběstačnosti II.+III.+ IV. st.',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q91',
    text: 'O kolik % ročně se navýší pojistné z důvodu indexace:',
    options: ['Každý rok min. o 4 %', 'Každý rok min. o 4,2 %', 'Každý rok min. o 2,4 %'],
    correctAnswer: 'Každý rok min. o 4 %',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q40',
    text: 'Jaká je územní platnost pro hopspitalizaci v rehabilitačních zařízeních, LDN ... ?',
    options: ['Svět', 'Evropská unie', 'ČR'],
    correctAnswer: 'Svět',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q66',
    text: 'Brand Můj život na PENZI 2 je určen?',
    options: [
      'Pro klienty, kteří chtějí pouze využít maximalizaci daňových výhod životního pojištění',
      'Pro klienty, kteří chtějí využít max. státní příspěvky',
      'Pro klienty, kteří se chtějí dobře zajistit proti úrazům',
    ],
    correctAnswer: 'Pro klienty, kteří chtějí pouze využít maximalizaci daňových výhod životního pojištění',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q56',
    text: 'U benefitu Zvýhodněné plnění při párové smrti, dojde k vyplacení jednorázové poj. částky ve výši:',
    options: [
      '5 násobku pojistné částky sjedané u pojištění Smrti',
      '5 násobku pojistné částky sjedané u pojištění Smrti při dopravní nehodě',
      '5 násobku pojistné částky sjedané u pojištění Smrti úrazem',
    ],
    correctAnswer: '5 násobku pojistné částky sjedané u pojištění Smrti při dopravní nehodě',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q103',
    text: 'Z pojištění Asistované reprodukce vyplatíme klientce maximálně :',
    options: ['30 000 Kč', '50 000 Kč', '100 000 Kč'],
    correctAnswer: '100 000 Kč',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q7',
    text: 'DNL-MAX vyplácíme?',
    options: [
      'Když léčení trvá min. 30 dnů, dle Oceňovacích tabulek',
      'Podle skutečné doby léčení, která trvala min.3 dny',
      'Dle Oceňovacích tabulek a zároveň doba léčení trvá min. 8 dnů',
    ],
    correctAnswer: 'Dle Oceňovacích tabulek a zároveň doba léčení trvá min. 8 dnů',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q92',
    text: 'Lze indexaci při sjednání smlouvy vyloučit?',
    options: ['Ano', 'NE', 'Ano, na prvních 5 let'],
    correctAnswer: 'NE',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q72',
    text: 'Jaké je minimální pojistné v brandu Můj život PROFI 2?',
    options: ['200 Kč měsíčně za rizika i investice', '200 Kč měsíčně za rizika a 100 Kč na investice', '200 Kč měsíčně za rizika'],
    correctAnswer: '200 Kč měsíčně za rizika i investice',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q83',
    text: 'Na jak dlouhou dobu je možné sjednat pojištění Můj život 2?',
    options: ['3 - 81 let', '18 - 96 let', 'Na dobu neurčitou'],
    correctAnswer: '3 - 81 let',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q95',
    text: 'Co je Věrnostní prémie?',
    options: [
      'Výplata prémie až 15 000 Kč po polovině odžité pojistné doby',
      'Dřívější výplata Věrnostního bonusu z pojistného za dítě',
      'Sleva z pojistného 20 % za sjednání rizik pro děti',
    ],
    correctAnswer: 'Dřívější výplata Věrnostního bonusu z pojistného za dítě',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q112',
    text: 'Pokud dojde k výplatě poj. plnění za dg. Rakovina ve stadiu in-situ:',
    options: [
      'Zaniká Závažné onemocnění, rozšířená i základní varianta',
      'Zaniká pouze rozšířená varianta závažného onemocnění',
      'Závažné onemocnění nezaniká',
    ],
    correctAnswer: 'Závažné onemocnění nezaniká',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q115',
    text: 'Čekací doba pro riziko Ošetřování dospělého je:',
    options: ['1. měsíc od sjednání', '2. měsíce od sjednání', '6. měsíců od sjednání'],
    correctAnswer: '2. měsíce od sjednání',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q42',
    text: 'Pojistná částka za závažná poranění je vyplacena:',
    options: ['Po ustálení následků úrazu', 'Po stanovení diagnózy', 'Po přešetření následků úrazu posudkovým lékařem GČP'],
    correctAnswer: 'Po stanovení diagnózy',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q69',
    text: 'Kolik osob lze pojistit v brandu Můj život na PENZI 2?',
    options: ['Až 4 osoby', 'Pouze 1 osobu', 'Neomezeně'],
    correctAnswer: 'Pouze 1 osobu',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q81',
    text: 'Jaké je minimální pojistné v pojištění Můj život 2?',
    options: ['Riziková část 300 Kč + investiční část min. 100 Kč', '200 Kč', 'Riziková část 300 Kč + investiční část min. 1 Kč'],
    correctAnswer: 'Riziková část 300 Kč + investiční část min. 1 Kč',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q41',
    text: 'Pojištění Závažná poranění zaniká po výplatě pojistného plnění.',
    options: ['Ano', 'Ne', 'Ano, ale jen v případě, kdy došlo k plnění z rozšířené varianty'],
    correctAnswer: 'Ne',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q67',
    text: 'Jaké je minimální pojistné v brandu Můj život na PENZI 2?',
    options: [
      '200 Kč za celou poj. smlouvu do investic + pojistné za povinnou smrt',
      '300 Kč',
      '100 Kč za celou poj. smlouvu do investic + pojistné za povinnou smrt',
    ],
    correctAnswer: '200 Kč za celou poj. smlouvu do investic + pojistné za povinnou smrt',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q112',
    text: 'Pokud dojde k výplatě poj. plnění za dg. Rakovina ve stadiu in-situ:',
    options: [
      'Závažné onemocnění nezaniká',
      'Zaniká pouze rozšířená varianta závažného onemocnění',
      'Zaniká Závažné onemocnění, rozšířená i základní varianta',
    ],
    correctAnswer: 'Závažné onemocnění nezaniká',
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: 'q15',
    text: 'Benefit Program proti rakovině je sjednán automaticky vždy:',
    options: [
      'Když je sjednaná pojistná částka pro případ závažného onemocnění min. 200 000 Kč',
      'Když je sjednané pojištění Závažného onemocnění',
      'Když je sjednaná pojistná částka pro případ závažného onemocnění min. 100 000 Kč',
    ],
    correctAnswer: 'Když je sjednaná pojistná částka pro případ závažného onemocnění min. 200 000 Kč',
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

      // Questions answered correctly more often and seen recently get higher scores (less likely to be shown)
      // Questions answered incorrectly more often and not seen recently get lower scores (more likely to be shown)
      const score = correctRatio * 10 - daysSinceLastSeen * (1 - correctRatio)

      return { question: q, score }
    })

    // Sort by score (ascending) and add some randomness
    scoredQuestions.sort((a, b) => a.score - b.score)

    // Select one of the top 3 questions (or fewer if we have fewer questions)
    const topN = Math.min(3, scoredQuestions.length)
    const randomIndex = Math.floor(Math.random() * topN)
    setCurrentQuestion(scoredQuestions[randomIndex].question)
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
    if (confirm('Jste si jisti, že chcete smazat vaše statistiky?')) {
      setQuestions(sampleQuestions)
      setCurrentQuestion(null)
      localStorage.removeItem('bankingQuizQuestions')
    }
  }

  if (!currentQuestion) {
    return <div className='text-center'>Načítám otázky...</div>
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
                {isCorrect ? 'Správně! Dobrá práce.' : `Špatně. Správná odpověď je: ${currentQuestion.correctAnswer}`}
              </AlertDescription>
            </Alert>
          )}
          {isAnswered && (
            <Button onClick={handleNextQuestion} className='w-full'>
              Další otázka
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className='flex justify-between'>
        <div className='text-sm text-gray-500'>Počet otázek: {questions.length}</div>
        <Button variant='outline' size='sm' onClick={handleReset}>
          Vymazat statistiky
        </Button>
      </div>
    </div>
  )
}
