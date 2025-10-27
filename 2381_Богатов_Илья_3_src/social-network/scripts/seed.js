import dotenv from 'dotenv';
import { users, posts } from '../models/collections.js';

dotenv.config();

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }

const FIRST = ['Иван','Пётр','Анна','Мария','Дмитрий','Ольга','Сергей','Елена','Алексей','Юлия','Илья','Кирилл'];
const LAST = ['Иванов','Петров','Смирнова','Попова','Кузнецов','Волкова','Соколов','Лебедева','Новиков','Морозова','Богатов','Егоров'];
const BIOS = [
  'Люблю код и кофе',
  'Пишу на JS и жду пятницу',
  'ЗОЖ и open-source',
  'Путешествия и котики',
  'Геймер и киноман',
];
const TEXTS = [
  'Сегодня отличный день!',
  'Работаю над новым проектом.',
  'Кто идёт на кофе?',
  'Пробую новый фреймворк.',
  'Фотоотчёт скоро!',
];

async function main() {
  const existing = await users.count();
  if (existing > 0) {
    console.log(`Users already exist: ${existing}. Skipping seeding.`);
    return;
  }

  // Create users
  const createdUsers = [];
  const nUsers = 15;
  for (let i = 0; i < nUsers; i++) {
    const firstName = pick(FIRST);
    const lastName = pick(LAST);
    const u = await users.create({
      firstName,
      lastName,
      email: `${firstName}.${lastName}.${i}@example.com`.toLowerCase(),
      password: 'password123',
      status: 'active',
      role: 'user',
      bio: pick(BIOS),
      avatar: 'no-avatar',
      following: [],
      followers: [],
      posts: []
    });
    createdUsers.push(u);
  }

  // Follow relations
  for (const u of createdUsers) {
    const followCount = randInt(2, 6);
    const candidates = createdUsers.filter(x => x._id !== u._id);
    for (let j = 0; j < followCount; j++) {
      const target = pick(candidates);
      await users.update({ _id: u._id }, { $addToSet: { following: target._id } });
      await users.update({ _id: target._id }, { $addToSet: { followers: u._id } });
    }
  }

  // Posts
  for (const u of createdUsers) {
    const postCount = randInt(1, 4);
    for (let k = 0; k < postCount; k++) {
      const content = pick(TEXTS);
      const p = await posts.create({ authorId: u._id, content, media: [], reactions: [], comments: [] });
      await users.update({ _id: u._id }, { $addToSet: { posts: p._id } });
    }
  }

  const totalPosts = await posts.count();
  console.log(`Seeded ${createdUsers.length} users and ${totalPosts} posts.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
