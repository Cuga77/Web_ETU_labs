import dotenv from 'dotenv';
import { users, posts } from '../models/collections.js';

dotenv.config();

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }

const TEXTS = [
  'Автоматический пост для оживления ленты',
  'Сервис активен! Новая запись.',
  'Бот: тестируем функционал ленты.',
  'Привет от симулятора активности.',
  'Небольшое обновление статуса.'
];

async function tick() {
  const count = await users.count();
  if (count === 0) return;
  const all = await users.find({}, { _id: 1 }, {}, 0, 0);
  const author = pick(all);
  const content = `${pick(TEXTS)} #${Date.now().toString().slice(-6)}`;
  const p = await posts.create({ authorId: author._id, content, media: [], reactions: [], comments: [] });
  await users.update({ _id: author._id }, { $addToSet: { posts: p._id } });
  const n = randInt(0, 4);
  for (let i = 0; i < n; i++) {
    const who = pick(all);
    if (who._id === author._id) continue;
    await posts.update({ _id: p._id }, { $addToSet: { reactions: { userId: who._id, reactionType: pick(['like','dislike']) } } });
  }
  console.log(`Activity: user ${author._id} posted.`);
}

const INTERVAL = parseInt(process.env.ACTIVITY_INTERVAL_MS || '15000', 10);
console.log(`Activity simulator started. Interval ${INTERVAL}ms`);
setInterval(() => {
  tick().catch(err => console.error('Activity tick error:', err.message));
}, INTERVAL);
