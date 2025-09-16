
# MarkLight 

Какво направих:
- Премахнати са `node_modules` от основната папка (`/MarkLight/node_modules`).
- Премахната е папката `uploads` от основната папка.
- Структурата е само `server/` и `client/` — тук са всички нужни зависимости и код.

## Стартиране локално
1) Сървър:
```
cd server
npm run dev
```
 

2) Клиент:
```
cd client
npm run dev
```
 

## Споделяне с приятел да отвори като клиент
Най-бързо:
- Изпрати само папката `client/` (или направи build и изпрати `client/dist`). 
- Ако имате бекенд URL, сложи го в `client/.env` (пример: `VITE_API_URL=https://...`). 
- Може да се хостне статично (Netlify/Vercel/S3/Nginx).

