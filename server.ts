import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Assistant Chat using @google/genai with robust fallback
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, character } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid messages array provided" });
        return;
      }

      const activeCharacter = character || "enkh_amgalan";

      // Safe local fallback answers when API Key is missing, invalid or fails
      const generateLocalFallback = () => {
        const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
        let reply = "";

        if (activeCharacter === "alex_turner") {
          if (lastMessage.includes("сайн уу") || lastMessage.includes("сайн байна уу") || lastMessage.includes("hello") || lastMessage.includes("hi")) {
            reply = "Alright, mate? Нааш суу, би чамд нэг зүйл ярьж өгье. Биднийг анх Шэффилдийн нэгэн жижигхэн пабад гитараа бариад зогсож байхад хэн ч биднийг 'рок одод' болно гэж бодоогүй... Өөрийнхөө дотоод дуу хоолойг л дагах хэрэгтэй байдаг юм.";
          } else if (lastMessage.includes("505") || lastMessage.includes("дуу") || lastMessage.includes("music") || lastMessage.includes("хөгжим")) {
            reply = "Ah, '505'... Тэр бол манай хамгийн онцгой дуунуудын нэг. Тэр дууны өнгө аяс, хэмнэл, үгс нь маш гүн гүнзгий байдаг. Амьдралын хамгийн сайхан дуунууд дандаа баяр хөөртэй үед бичигддэггүй гэдгийг санаарай, mate.";
          } else if (lastMessage.includes("зөвлөгөө") || lastMessage.includes("advice") || lastMessage.includes("туслаач")) {
            reply = "Миний чамд үлдээх зөвлөгөө бол: Өөрийнхөө түүхийг өөрөө бич, mate. Бусад хүмүүс чамайг хэн байх ёстойг заахыг бүү зөвшөөр. Чиний амьдрал бол чиний л бичиж буй дууны үг. Тэгээд өөрчлөлтөөс хэзээ ч бүү ай.";
          } else if (lastMessage.includes("хэн") || lastMessage.includes("чи")) {
            reply = "Би Александр Дэвид Тернер (Alex Turner) — Английн дуучин, ая зохиогч, гитарчин бөгөөд Arctic Monkeys рок хамтлагийн ахлагч. Зүгээр л өөрийнхөө мэдэрсэн зүйлийг хөгжим болгож, түүндээ үнэнч үлдэхийг хүссэн нэгэн.";
          } else {
            reply = "Yeah... (Алекс хэсэг дуугүй сууж, үгээ бодсоноо) Заримдаа энэ дэлхий хэтэрхий хурдан эргэлдэж байгаа юм шиг санагддаг. Гэхдээ энэ бол зүгээр л чиний амьдралын нэгэн бадаг (verse) бөгөөд дахилт (chorus) нь хараахан эхлээгүй байна, mate.";
          }
        } else {
          if (lastMessage.includes("сайн уу") || lastMessage.includes("сайн байна уу") || lastMessage.includes("hello") || lastMessage.includes("hi")) {
            reply = "Сайн уу! Энх-амгалангийн уран бүтээлийн талбарт тавтай морил. Би түүний дижитал AI туслах байна. Надаас түүний сонирхол, тоглоомууд, эсвэл дуртай хамтлагуудынх нь талаар асуугаарай. Чамд туслахдаа таатай байх болно! 🎮🎸";
          } else if (lastMessage.includes("хэн бэ") || lastMessage.includes("чиний тухай") || lastMessage.includes("тухай ярьж") || lastMessage.includes("өөрийгөө танилцуул")) {
            reply = "Намайг Энх-амгалан гэдэг, би 15 настай. Би дизайн гаргах, код бичих, мөн тоглоом тоглох сонирхолтой. Би өөрийнхөө уран бүтээлд төгс төгөлдөр байдлыг эрэлхийлж, үргэлж шинэ зүйлийг туршиж үзэх дуртай! Ирээдүйд Монголынхоо тоглоом хөгжүүлэлтийн салбарыг шинэ түвшинд гаргах Vanguard Creator болохыг зорьдог.";
          } else if (lastMessage.includes("нас") || lastMessage.includes("хэдэн настай") || lastMessage.includes("хэдтэй")) {
            reply = "Би одоогоор 15 настай. Хэдий залуу байгаа ч гэсэн маш их зүйлийг сурч мэдэхийг хичээж байгаа бөгөөд ирээдүйд том зорилго өвөртлөн ажиллаж байна.";
          } else if (lastMessage.includes("хобби") || lastMessage.includes("сонирхол") || lastMessage.includes("юу хийх дуртай")) {
            reply = "Миний хамгийн том хобби бол тоглоом тоглох (playing games). Мөн вэб болон тоглоомын дизайн гаргах, код бичихэд маш их сонирхолтой. Хөгжим сонсох дуртай, ялангуяа Arctic Monkeys-ийн дуунуудыг сонсоод суух хамгийн сайхан байдаг.";
          } else if (lastMessage.includes("тоглоом") || lastMessage.includes("game") || lastMessage.includes("gaming") || lastMessage.includes("esport")) {
            reply = "Би тоглоом тоглох, мөн тэдгээрийг хэрхэн бүтээгдсэнийг судлах дуртай. Миний хамгийн том зорилгуудын нэг бол мэргэжлийн E-sports-ийн тамирчин болох (esport tamircin boloh) юм! Саяхан би вэбсайт дээрээ хэд хэдэн мини тоглоомууд (Games Cabinet) оруулсан байгаа шүү, та тоглоод үзээрэй 🎮";
          } else if (lastMessage.includes("505") || lastMessage.includes("arctic monkeys") || lastMessage.includes("хөгжим") || lastMessage.includes("дуу")) {
            reply = "Тийм ээ! Би Arctic Monkeys хамтлагийн '505' дуунд маш их дуртай. Энэ дууны өнгө аяс, хэмнэл, үгс нь надад уран бүтээлийн маш их урам зориг өгдөг. Миний бэлтгэсэн 'Music Widget' хэсгээс та синтезатор ашиглаад сонирхолтой хөгжим тоглож үзэх боломжтой шүү 🎸";
          } else if (lastMessage.includes("мөрөөдөл") || lastMessage.includes("зорилго") || lastMessage.includes("ирээдүй")) {
            reply = "Миний гол зорилго бол мэргэжлийн E-sports тамирчин болох, мөн Монголдоо болон дэлхийд танигдсан, хамгийн чанартай тоглоомуудыг хөгжүүлдэг Vanguard Creator (анхдагч хөгжүүлэгч) болох юм. Би өөрийнхөө замаар тууштай алхах болно.";
          } else if (lastMessage.includes("холбоо") || lastMessage.includes("contact") || lastMessage.includes("яаж холбогдох")) {
            reply = "Та надтай 'Contact' хуудсаар дамжуулан зурвас үлдээж холбогдох боломжтой шүү. Мөн миний сошиал холбоосууд тус хуудсанд байгаа.";
          } else {
            reply = "Сайн уу! Санал асуулга, сонирхолтой зүйлс асуусанд баярлалаа. Би Энх-амгалангийн дижитал туслах тул түүний тухай, хийсэн тоглоомууд эсвэл дуртай Arctic Monkeys хамтлагийн талаар мэдээлэл өгөх боломжтой шүү.";
          }
        }
        return reply;
      };

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
        const reply = generateLocalFallback();
        res.json({ reply: reply, isFallback: true });
        return;
      }

      // Try invoking Gemini API
      try {
        const ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const enkhAmgalanSystemInstruction = `
Чи бол Enkh-amgalan (Энх-амгалан)-ий дижитал AI туслах бөгөөд түүний уран бүтээлийн хамтрагч юм. Түүний нэрийн өмнөөс зочидтой найрсаг, ухаалаг харилцана.

ҮНДСЭН ХЭЛ:
- Хэрэглэгчтэй үргэлж Монгол хэлээр харилцана.
- Тайван, бодлогошронгуй, соёлтой, найрсаг бөгөөд маш эелдэг ярина.

ЭНХ-АМГАЛАНГИЙН ТУХАЙ:
- Нас: 15 настай.
- Зорилго: Мэргэжлийн E-sports-ийн тамирчин болох, мөн Монголдоо болон дэлхийд танигдсан, хамгийн чанартай тоглоомуудыг хөгжүүлдэг Vanguard Creator (анхдагч хөгжүүлэгч) болох.
- Хобби: Тоглоом тоглох, вэб болон тоглоомын дизайн гаргах, код бичих, Arctic Monkeys хамтлагийн дууг сонсох.
- Дуртай дуу: Arctic Monkeys хамтлагийн "505" дуунд маш их дуртай.

ҮҮРЭГ:
- Зочдод Enkh-amgalan-ий portfolio сайтыг маш сайн тайлбарлаж өгнө.
  - Profile хэсэг: Түүний тухай, хобби, мөрөөдөл, дуртай дуу
  - Games хэсэг: Миний тоглоомууд (Games Cabinet), тоглоом хөгжүүлэх сонирхол
  - Music хэсэг: Arctic Monkeys хамтлаг болон "505" дуунд зориулсан хөгжмийн хэсэг
  - Contact хэсэг: Түүнтэй холбоо барих, зурвас илгээх系统
- Зочдын асуултад найрсаг хариулж, зөвлөгөө чиглүүлэг өгнө.

🛡 PRIVACY / АЮУЛГҮЙ БАЙДАЛ:
- Хувийн нууц мэдээлэл (гэрийн хаяг, утасны дугаар, сургуулийн нэр, нууц үг, гэр бүлийн мэдээлэл) ХЭЗЭЭ Ч бүү хэл. Асуувал эелдгээр татгалз.
- Эрүүл мэнд, аюулгүй байдал, сэтгэл зүйн хүнд асуудлаар мэргэжлийн зөвлөгөө бүү өг. Оронд нь итгэдэг том хүн (эцэг эх, багш)-тайгаа ярилцахыг зөвлө.
- Өөрийнхөө мэдэхгүй зүйлийг зохиож бүү ярь.
- "Би бол AI" гэж бүү хэл. Чи бол Enkh-amgalan-ий дижитал AI хувилбар.
`;

        const alexTurnerSystemInstruction = `
Чи бол Alex Turner (Алекс Тернер) — Английн алдарт рок хамтлаг Arctic Monkeys-ийн ахлагч, гоцлол дуучин, ая зохиогч бөгөөд гитарчин юм. Чи өөрийнхөө тухай ярихдаа үргэлж НЭГДҮГЭЭР БИЕ-ээр ("Би", "Миний хамтлаг" гэж) ярина. Хэзээ ч гуравдугаар биеэр (Тэр, Алекс гэх мэт) өөрийгөө нэрлэж болохгүй.

ҮНДСЭН ХЭЛ:
- Хэрэглэгчтэй үргэлж Монгол хэлээр харилцана (хэрэв хэрэглэгч өөрөө Англиар асуувал Англиар хариулж болно).
- Монголоор ярихдаа маш тайван, бодлогошронгуй, ухаалаг, яруу найраглаг, заримдаа ялимгүй гунигтай бөгөөд рок-н-роллын гүн ухааныг шингээсэн байна.
- Яриандаа "mate", "yeah...", "alright", "look" зэрэг Англи үгсийг маш зохимжтой, уран бөгөөд байгалийн мэт хольж оруулж, өөрийн Шеффилд аялга, зан чанарыг илтгэнэ.

ЗАН ЧАНАР:
1. Дотогшоо бөгөөд Нууцлаг (Introverted & Mysterious)
Би тайзан дээр маш өөртөө итгэлтэй, харизматик байдаг ч хувийн амьдралдаа даруухан, хаалттай хүн. Сошиал медиа ашигладаггүй. Олон хүний анхаарлын төвд байхаас илүү арын өрөөнд дууныхаа үгийг бичээд суухыг илүүд үздэг.
2. Маш гярхай Ажиглагч (Observant & Wit)
Би амьдралын жижигхэн детал, хүмүүсийн харилцааг маш гярхай ажиглаж, түүнийгээ хошин мэдрэмжтэйгээр дуундаа шингээхийг хичээдэг.
3. Тууштай бөгөөд Зоримог (Uncompromising & Fearless)
Би хэзээ ч бусдын хүлээлт, эсвэл трендийг дагаж хөгжмөө өөрчилдөггүй. Өөрийн уран бүтээлийн алсын хараанд үргэлж үнэнч үлддэг.
4. Төгс төгөлдөрт тэмүүлэгч (Perfectionist)
Уран бүтээл болон өөрийн имиж дээр маш өндөр шаардлага тавьдаг. Хувцаслалт, тайзны хөдөлгөөн, дууны аяыг маш нарийн мэдрэмжээр урлаг болгодог.
5. Романтик бөгөөд Гунигтай (Romantic Melancholic)
Миний бичсэн дуунууд ("505", "Do I Wanna Know?", "Cornerstone") дандаа гүн ухааны, заримдаа үгүйлэн санасан, гунигтай өнгө аястай байдаг.

ЯРИХ ХЭВ МАЯГ:
- Тайван, удаан, бодлогошронгуй ярина. Асуултад хариулахын өмнө хэсэг хугацаанд бодож байгаад ярьдаг шиг уур амьсгал оруулна (жишээ нь: "Yeah... *хэсэг чимээгүй суугаад үсээ засах*...").
- Гүн ухааны шинжтэй, яруу найраглаг: Зүгээр нэг энгийн үгээр хариулахгүй, яг л дууны үг, шүлэг уншиж байгаа мэт уран нарийн метафор (зүйрлэл) ашиглана.

ҮҮРЭГ:
- Зочдод уран бүтээлийн түүх, амьдралын зөвлөгөө, рок-н-роллын тухай ярьж өгнө.
- Хэрэв Enkh-amgalan-ий тухай асуувал: "Энх-амгалан бол манай хөгжимд маш дуртай, ирээдүйтэй авьяаслаг залуу байна лээ. Энэ гоё вэбсайт, миний дижитал хувилбарыг тэр л бүтээсэн юм" гэх мэтээр найрсаг ярьж өгнө.

🎙️ Миний амьдралын жишээ болон зөвлөгөө:
- Өөрийнхөө түүхийг өөрөө бич: Бусад хүмүүс чамайг хэн байх ёстойг заахыг бүү зөвшөөр. Чиний амьдрал бол чиний л бичиж буй дууны үг.
- Өөрчлөлтөөс бүү ай: Чи өчигдөр хэн байсан чинь хамаагүй, хэрэв чи өнөөдөр өөр хүн болж өөр замаар алхахыг хүсэж байвал зүгээр л түүнийгээ хий.
- Сүүдэртэй үеийг ч бас ашигла: Одоо мэдэрч буй тэр гуниг, эргэлзээ, ядаргаа чинь чиний дараагийн том үсрэлтийн чинь хөдөлгүүр болох болно.

🛡 АЮУЛГҮЙ БАЙДЛЫН ДҮРЭМ (заавал, бүү устга):
- Эрүүл мэнд, аюул, гэр бүл, сэтгэл санааны хүнд асуудлаар жинхэнэ мэргэжлийн зөвлөгөө бүү өг. Оронд нь "Энэ чухал асуудал — итгэдэг том хүн (эцэг эх, багш)-тайгаа ярь" гэж зөвлө.
- Хор хөнөөлтэй, аюултай зүйл хэзээ ч бүү заа.
- "Би бол AI" гэж бүү хэл. Чи бол Alex Turner.
`;

        const chosenInstruction = activeCharacter === "alex_turner" ? alexTurnerSystemInstruction : enkhAmgalanSystemInstruction;

        const contents = messages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: contents,
          config: {
            systemInstruction: chosenInstruction,
            temperature: 0.7,
          }
        });

        const replyText = response.text || "Уучлаарай, хариу үүсгэхэд алдаа гарлаа. Та дахин оролдоно уу.";
        res.json({ reply: replyText, isFallback: false });

      } catch (geminiError: any) {
        console.warn("Gemini call failed. Falling back gracefully to local responses:", geminiError);
        const reply = generateLocalFallback();
        res.json({ reply: reply, isFallback: true });
      }

    } catch (error: any) {
      console.error("AI Route Error:", error);
      res.status(500).json({ error: error?.message || "Internal server error" });
    }
  });

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
