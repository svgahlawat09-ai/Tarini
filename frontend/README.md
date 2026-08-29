# Saathi.AI — SIH PS #26097 Frontend

Ye ek React + Vite + Tailwind website hai jo tumhare PS ("AI-Driven Voice
Assistant for Livelihood Mapping...") ke liye internal-round demo banata hai.

## Pages
- `/` — Landing page (hero + quick pitch)
- `/problem` — Problem statement, PPT-style breakdown
- `/demo` — Scripted voice assistant conversation demo
- `/dashboard` — Admin dashboard with dummy data (charts + table)

## Apne laptop par chalane ke steps

1. **Node.js install karo** (agar pehle se nahi hai): https://nodejs.org
   (LTS version le lena)

2. Is folder ko **VS Code mein khol lo** (File -> Open Folder)

3. VS Code ke andar **Terminal** kholo (Terminal menu -> New Terminal), aur likho:

   ```
   npm install
   ```

   (Ye sirf pehli baar karna hai, ye sab packages/libraries download karega)

4. Fir likho:

   ```
   npm run dev
   ```

5. Terminal mein ek link milega jaisa `http://localhost:5173/` — usko
   Ctrl+click karo (ya browser mein khud paste karo). Website khul jayegi!

6. Jab bhi tum koi file mein change karogi (khud ya AI se), browser
   automatically refresh ho jayega, turant dikhega.

## Folder structure samjho

```
src/
  components/
    Navbar.jsx        -> top nav bar, sab pages pe common
    Waveform.jsx       -> voice waveform animation (signature visual)
  pages/
    Landing.jsx        -> home page
    Problem.jsx         -> problem statement page
    VoiceDemo.jsx        -> scripted conversation demo
    Dashboard.jsx         -> admin dashboard
  App.jsx               -> connects all pages together (routing)
  main.jsx              -> app ka entry point
  index.css             -> colors, fonts, global styles (Tailwind v4)
```

## Aage kya karna hai (backend ready hone ke baad)

`src/pages/VoiceDemo.jsx` ke andar `handleMicPress` function ke paas ek
comment hai jo batata hai real API call kahan add karni hai, abhi wo
scripted/dummy conversation dikhata hai.

`src/pages/Dashboard.jsx` ke top pe dummy arrays (`overview`, `skillGap`,
`beneficiaries`) hain, inhe real backend data se replace karna hoga jab
wo ready ho.

## Deploy karna (free, no GitHub needed)

1. Terminal mein: `npm run build` -> isse ek `dist` folder banega
2. https://app.netlify.com/drop pe jao
3. `dist` folder ko waha drag-and-drop karo
4. Turant ek live public link milega, judges ke saath share kar sakti ho
