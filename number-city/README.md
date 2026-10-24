# Number City

An adaptive maths game for Sophie, Olivia and Julia. Each girl answers short rounds of questions pitched at her level, earns stars, and turns them into cards that build her own house, school, neighbourhood and Dubai.

- Play: https://harfullify.github.io/beit-al-huruf/number-city/
- Progress syncs through the same Firebase project and family code as Beit al-Huruf, in `families/{code}/settings/nc_{girl}` (documents marked `kind: "numberCity"`, which Beit al-Huruf ignores). The existing Firestore rules already allow this.
