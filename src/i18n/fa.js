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

  langSwitch: 'English',
  langSwitchHref: '../',
  langSwitchHrefLang: 'en',
  langSwitchLabel: 'Switch to English',
};
