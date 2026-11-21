# ڕێبەری ئەپدەیتکردنی هەفتانە / Weekly Update Guide

ئەم وێبسایتە بە شێوازێکی زۆر مۆدێرن و ڕێکخراو دروستکراوە کە پێویستی بە هیچ باک-ئێندێک نییە.
تەواوی داتای کۆنفرانس و پێشانگاکان لە یەک فایلی ڕوون و پاکدایە:
📁 `data/events.js`

---

## 🔹 چۆن کۆنفرانسێکی نوێ زیاد بکەم؟ (How to Add a New Event)

تەنها فایلی `data/events.js` بکەرەوە و لە ناو ئاڕەیی `events`دا لە کۆتاییدا یان لە هەر شوێنێک، ئەم نموونەیە کۆپی بکە و زانیارییەکانی بگۆڕە:

```javascript
{
  id: "sample-event-2027", // ئایدییەکی ناوازە بە زمانی ئینگلیزی بەبێ بۆشایی
  title_ku: "ناوی کۆنفرانس بە کوردی",
  title_en: "Conference Title in English",
  category: "medical", // بنووسە "medical" بۆ پزیشکی، یان "non-medical" بۆ ئەندازیاری و تەکنەلۆژیا
  field_ku: "بواری پسپۆڕی بە کوردی (بۆ نموونە: دڵناسی، بیناسازی، هتد)",
  field_en: "Field in English (e.g. Cardiology, Civil Engineering)",
  city_ku: "شار بە کوردی (بۆ نموونە: میلان، ئەمستەردام)",
  city_en: "City in English (e.g. Milan, Amsterdam)",
  country_ku: "وڵات بە کوردی (بۆ نموونە: ئیتاڵیا، هۆڵەندا)",
  country_en: "Country in English (e.g. Italy, Netherlands)",
  flag: "🇮🇹", // ئیمۆجی ئاڵای وڵاتەکە
  venue: "هۆڵ و ناونیشانی شوێنی بۆنەکە",
  startDate: "2027-05-10", // ساڵ-مانگ-ڕۆژ بۆ فلتەرکردنی ئۆتۆماتیکی
  endDate: "2027-05-13",   // ساڵ-مانگ-ڕۆژ بۆ دیاریکردنی بەسەرچوونی ئۆتۆماتیکی
  dateText_ku: "١٠–١٣ی ئایاری ٢٠٢٧",
  dateText_en: "10–13 May 2027",
  officialUrl: "https://example.com", // ماڵپەڕی فەرمی
  ticketUrl: "https://example.com/tickets", // لینکی کڕینی تکت یان تۆمارکردن
  ticketPrice_ku: "تێچووی تکت بە کوردی",
  ticketPrice_en: "Ticket price in English",
  overview_ku: "کورتەیەک دەربارەی کۆنفرانسەکە بە کوردی",
  overview_en: "Brief description in English",
  audience_ku: [
    "بۆ کێ دەست دەدات خاڵی یەکەم",
    "بۆ کێ دەست دەدات خاڵی دووەم"
  ],
  audience_en: [
    "Target audience item 1",
    "Target audience item 2"
  ],
  visa_ku: "ڕێکاری بانگهێشتنامەی فەرمی و ڤیزا بە کوردی",
  visa_en: "Official visa invitation process in English",
  foresight_ku: "خزمەتگوزاری و پشتگیری تیمی فۆرسایت بۆ ڤیزا",
  foresight_en: "Foresight team visa dossier support in English"
}
```

---

## 🔹 سیستمە ئۆتۆماتیکییەکان (Automatic Features)

1. **دیاریکردنی بەسەرچوون (Automatic Expiration):**
   - بەپێی بەرواری `endDate` ڕێکخراوە. ئەگەر بەرواری بۆنەکە لە کاتی ئێستا کەمتر بێت، ماڵپەڕەکە خۆکارانە باجی `بەسەرچووە / Past / Expired` دەخاتە سەری و لە فلتەری بەسەرچووەکانیش پیشانی دەدات. پێویست ناکات بە دەست هیچی لێ بکەیت!

2. **فلتەری مانگ و ساڵ و وڵاتەکان:**
   - بە شێوەی دینامیکی لە داتاکانەوە دەردەهێنرێن، هەر وڵاتێک یان مانگێکی نوێ زیاد بکەیت، ڕاستەوخۆ دەچێتە ناو درۆپداونەکانەوە بەبێ دەستکاری کۆد.

3. **دوو زمانی (Bilingual KU / EN):**
   - سەردانکەر لە هەر چرکەیەکدا دەتوانێت زمان بگۆڕێت و ماڵپەڕەکە ئۆتۆماتیکی RTL و LTR ڕێکدەخات.
