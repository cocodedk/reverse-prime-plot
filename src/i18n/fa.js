export const fa = {
  eyebrow: 'آینهٔ عددها · کاوشگر اعداد اول',
  title: 'نمودار اعداد اول وارونه',
  introLead: 'هر عدد به',
  introFormula: '(n، وارونهٔ n)',
  introRest:
    ' تبدیل می‌شود. یک بازهٔ بسته انتخاب کنید تا نمودار از کران بالا به سمت کران پایین رسم شود.',

  chooseInterval: 'بازه را انتخاب کنید',
  from: 'از',
  to: 'تا',
  plotInterval: 'رسم بازه',
  suggestedIntervals: 'بازه‌های پیشنهادی',
  axisDirection: 'جهت محور عمودی',
  lowerAtBottom: 'کوچک‌تر در پایین',
  lowerAtTop: 'کوچک‌تر در بالا',
  validationError: (max) => `عددهای درست بنویسید، به‌طوری‌که ۰ ≤ از < تا ≤ ${max} باشد.`,

  statChecked: 'بررسی‌شده',
  statMarkers: 'نشانه‌ها',
  statPrimeN: 'n اول',
  statPrimeReversals: 'وارونهٔ اول',
  statBothPrime: 'هر دو اول',

  coordinates: (start, end) => `مختصات: (n، وارونهٔ n) · ${start}–${end}`,
  progressAria: (start, end) => `رسم بازهٔ ${start} تا ${end}`,
  outsideNotice: (count, start, end) =>
    `${count} مقدار وارونه بیرون از بازهٔ ${start}–${end} می‌افتد.`,

  legendLabel: 'راهنمای نمودار',
  legendTop: 'n اول است',
  legendBottom: 'وارونهٔ n اول است',
  legendFull: 'هر دو اول‌اند',

  axisX: 'عدد n',
  axisY: 'عدد وارونه',
  canvasFallback: 'نمودار مختصات عددهای اول و وارونهٔ آن‌ها.',
  plotDescription: (start, end, lowerPosition) =>
    `مختصات مربوط به اعداد اول، از ${end} تا ${start}. هر دو محور همین بازهٔ بسته را می‌پوشانند. مقدار افقی خودِ عدد است و مقدار عمودی وارونهٔ رقم‌های آن، و کران پایین در ${lowerPosition} قرار دارد. نشانه‌های خالی و غیراول رسم نمی‌شوند.`,
  positionBottom: 'پایین',
  positionTop: 'بالا',

  phases: {
    Starting: 'آغاز',
    'Reversing digits': 'وارونه‌کردن رقم‌ها',
    'Finding primes': 'یافتن اعداد اول',
    'Classifying points': 'دسته‌بندی نقطه‌ها',
    'Preparing markers': 'آماده‌سازی نشانه‌ها',
    Ready: 'آماده',
    'Drawing plot': 'رسم نمودار',
    Complete: 'کامل',
    Failed: 'ناموفق',
  },

  canvasFont: 'Vazirmatn, Inter, ui-sans-serif, system-ui, sans-serif',
  footerYear: '۱۴۰۵',
  footerCreatedBy: 'ساخته شده توسط',
  authorName: 'بابک بندپی',

  // صفحهٔ زنجیره‌ها
  chainsTitle: 'زنجیرهٔ تفاضل اعداد اول',
  chainsEyebrow: 'جفت‌های بازگشتی · کاوشگر زنجیره',
  chainsIntroLead: 'عددی اول را بگیرید که وارونه‌اش هم اول است، آن دو را از هم کم کنید و همان پرسش را دربارهٔ نتیجه بپرسید:',
  chainsIntroRest: ' آیا خودش اول است و آیا وارونه‌اش اول است؟ فقط بذرهایی رسم می‌شوند که دست‌کم یک گام دوام بیاورند.',
  chainsNavToPlot: 'بازگشت به نمودار',
  chainsNavToChains: '← زنجیره‌های تفاضل',

  ruleLabel: 'قاعدهٔ گام',
  ruleNote1: 'یک عدد و وارونه‌اش مجموع رقم‌های یکسانی دارند، پس ۹ همیشه تفاضلشان را می‌شمارد؛ دو عدد اول فرد هم آن را زوج می‌کنند. بنابراین تفاضل خام همیشه مضربی از ۱۸ است و هرگز اول نیست — این قاعده در هیچ بازه‌ای چیزی پیدا نمی‌کند.',
  ruleNote9: 'با تقسیم بر ۹ هنوز زوج‌بودن باقی می‌ماند، پس پیوندها بسیار کمیاب‌اند.',
  ruleNote18: 'با تقسیم بر ۱۸، یعنی همان عامل اجباری، خارج‌قسمتی می‌ماند که می‌تواند اول باشد؛ زنجیره‌ها همین‌جا پیدا می‌شوند.',
  ruleOption: (divisor, formatted) =>
    divisor === 1 ? '⁦|n − r|⁩' : `⁦|n − r| ÷ ${formatted}⁩`,

  whyTitle: 'چرا اصلاً تقسیم می‌کنیم؟',
  whyIntro: 'شکل بدیهی این قاعده — تفریق کن و بعد نتیجه را بیازما — هرگز چیزی پیدا نمی‌کند؛ نه در بازه‌ای کوچک، نه در بازه‌ای بسیار بزرگ. دو چیز دست‌به‌دست هم می‌دهند.',
  whyPoint1Title: 'رقم‌های یکسان، باقی‌ماندهٔ یکسان',
  whyPoint1Body: 'یک عدد و وارونه‌اش از همان رقم‌ها ساخته شده‌اند، پس هر دو بر ۹ که تقسیم شوند باقی‌ماندهٔ یکسانی دارند. وقتی یکی را از دیگری کم کنید آن باقی‌مانده حذف می‌شود و هر بار مضربی درست از ۹ می‌ماند. ۱۹۱۳ و ۳۱۹۱ را ببینید: مجموع رقم‌های هر دو ۱۴ است و تفاضلشان، ۱۲۷۸، برابر ۹ × ۱۴۲ است.',
  whyPoint2Title: 'فرد منهای فرد، زوج می‌شود',
  whyPoint2Body: 'هر عدد اولی جز ۲ فرد است. پس هر دو طرف جفت فردند و تفریق دو عدد فرد همیشه زوج است. این یک عامل ۲ هم روی همان ۹ می‌گذارد.',
  whyConclusion: 'روی‌هم‌رفته هر تفاضلی مضربی از ۱۸ می‌شود. چیزی که هم بر ۲ و هم بر ۳ بخش‌پذیر باشد نمی‌تواند اول باشد، پس زنجیره در همان گام اول می‌میرد — هر بار و در هر مقیاسی.',
  whyDivide18: 'تقسیم بر ۱۸ دقیقاً همان چیزی را برمی‌دارد که به تفاضل تحمیل شده بود و نه بیشتر. آنچه می‌ماند آزاد است که به حساب خودش اول باشد یا نباشد، و زنجیره‌ها همین‌جا پیدا می‌شوند.',
  whyDivide9: 'تقسیم بر ۹ فقط نیمی از ماجرا را درست می‌کند. خارج‌قسمت هنوز زوج است، پس تنها وقتی اول می‌شود که اتفاقاً به ۲ برسد — و برای همین آن گزینه تقریباً چیزی پیدا نمی‌کند.',

  statSeeds: 'جفت‌های اول',
  statChains: 'دارای زنجیره',
  statDeepest: 'عمیق‌ترین زنجیره',
  chainsEmptyTitle: 'در این بازه زنجیره‌ای نیست',
  chainsEmptyBody: 'هر تفاضل در این بازه مضربی از ۱۸ است، پس هیچ‌کدام اول نیستند. قاعدهٔ گام دیگر را امتحان کنید.',
  chainsListTitle: 'عمیق‌ترین زنجیره‌های یافته‌شده',
  chainsSelectHint: 'روی هر نقطه از نمودار، یا یکی از زنجیره‌های پایین، بزنید تا گام‌به‌گام ببینیدش.',
  chainsDetailTitle: 'نقطهٔ انتخاب‌شده',
  chainsDetailPair: (seed, reversed) => `${seed} و وارونه‌اش ${reversed} هر دو اول‌اند.`,
  chainsDetailDepth: (depth, formatted) =>
    depth === 1
      ? 'پیش از پایان زنجیره یک گام دیگر دوام می‌آورد.'
      : `پیش از پایان زنجیره ${formatted} گام دیگر دوام می‌آورد.`,
  chainsDetailEnd: (last) => `${last} جایی است که متوقف می‌شود: تفاضل بعدی جفت اول نمی‌سازد.`,
  chainsDetailClose: 'برداشتن انتخاب',
  chainDepthLabel: (depth, formatted) => (depth === 1 ? 'یک پیوند' : `${formatted} پیوند`),
  chainStep: (from, reversed, difference, divisor, next) =>
    divisor === 1
      ? `⁦|${from} − ${reversed}| = ${difference} → ${next}⁩`
      : `⁦|${from} − ${reversed}| = ${difference} ÷ ${divisor} → ${next}⁩`,
  chainsLegendLabel: 'راهنمای زنجیره',
  chainsLegendOne: 'یک جفت اول دیگر',
  chainsLegendDeep: 'دو تا یا بیشتر',
  chainsPlotLabel: (start, end) => `بذرهای زنجیره · ${start}–${end}`,
  viewSource: 'کد روی گیت‌هاب',

  langSwitch: 'English',
  langSwitchHref: '../',
  langSwitchHrefLang: 'en',
  langSwitchLabel: 'Switch to English',
};
