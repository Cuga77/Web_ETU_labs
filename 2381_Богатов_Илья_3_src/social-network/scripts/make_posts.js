import dotenv from 'dotenv';
import { users, posts } from '../models/collections.js';

dotenv.config();

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }

const SAMPLE_TEXTS = [
  'Доброе утро! Отличный день для новых идей.',
  'Тестовый пост: проверяем ленту и уведомления.',
  'Работаю над проектом, скоро поделюсь результатами.',
  'Вопрос к аудитории: macOS или Linux для разработки?',
  'Немного отдыха и обратно к коду.'
];

async function main() {
  const all = await users.find({}, { _id: 1 }, {}, 0, 0);
  if (!all || all.length === 0) {
    console.log('Пользователей нет — посты создать нельзя.');
    return;
  }

  // Возьмём 2-3 случайных пользователей и создадим по 1-2 поста
  const nAuthors = Math.min(3, Math.max(2, Math.ceil(all.length / 5)));
  const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, nAuthors);

  let created = 0;
  for (const author of shuffled) {
    const count = randInt(1, 2);
    for (let i = 0; i < count; i++) {
      const content = pick(SAMPLE_TEXTS);
      const p = await posts.create({ authorId: author._id, content, media: [], reactions: [], comments: [] });
      await users.update({ _id: author._id }, { $addToSet: { posts: p._id } });
      created++;
    }
  }

  const totalPosts = await posts.count();
  console.log(`Создано постов: ${created}. Всего постов в системе: ${totalPosts}.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
