import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const Estelle = await prisma.user.upsert({
    where: { id: 'user1' },
    update: {},
    create: {
      id: 'user1',
      immutableId: 'user1',
      nickname: 'Estelle',
      avatarImg:
        'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimages.hellogiggles.com%2Fuploads%2F2016%2F12%2F06112559%2Farchange_-700x525.jpg&f=1&nofb=1&ipt=4c12e167b1e68ffca12dfa2614d3547dca6edbdfb7ef4c28195e2edc36c8703d&ipo=images',
    },
  });

  const Constant = await prisma.user.upsert({
    where: { id: 'user2' },
    update: {},
    create: {
      id: 'user2',
      immutableId: 'user2',
      nickname: 'Constant',
      avatarImg:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.necomimi.com%2Fwp-content%2Fuploads%2F2018%2F11%2Fbest-cat-halloween-costume.jpg&f=1&nofb=1&ipt=414a720116a209c7d47f54b2835221da9979f1aa87e52beb2e31ecf0cebc9f03&ipo=images',
      friendsRequester: {
        create: [{ addresseeId: 'user1' }],
      },
    },
  });

  const Lea = await prisma.user.upsert({
    where: { id: 'user3' },
    update: {},
    create: {
      id: 'user3',
      immutableId: 'user3',
      nickname: 'Lea',
      avatarImg:
        'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.abclocal.go.com%2Fcontent%2FcreativeContent%2Fimages%2Fcms%2Fcybergata-tumblr.jpg&f=1&nofb=1&ipt=dec0751a5996a5ec62d9fd5ed92af8b8fc0fddee0d3fe31b26ebd1239ed0199f&ipo=images',
      friendsRequester: {
        create: [
          {
            addresseeId: 'user1',
            status: 'ACCEPTED',
          },
        ],
      },
    },
  });

  const Colomban = await prisma.user.upsert({
    where: { id: 'user4' },
    update: {},
    create: {
      id: 'user4',
      immutableId: 'user4',
      nickname: 'Colomban',
      avatarImg:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fae01.alicdn.com%2Fkf%2FHTB1_IXgmBTH8KJjy0Fiq6ARsXXaH%2FFunny-Cat-Costume-Uniform-Suit-Cat-Clothes-Costume-Puppy-Clothes-Dressing-Up-Suit-Party-Clothing-For.jpg&f=1&nofb=1&ipt=34c6b304bbe305313dab4fcd653476fa5e03f6e3d2bcb7846db90a783dbd1583&ipo=images',
      friendsRequester: {
        create: [
          {
            addresseeId: 'user1',
            status: 'ACCEPTED',
          },
        ],
      },
    },
  });

  const channelPublic = await prisma.channel.upsert({
    where: { id: 'channel1' },
    update: {},
    create: {
      id: 'channel1',
      name: 'Les demons de minuit',
      users: {
        create: [
          { userId: 'user1', role: 'OWNER' },
          { userId: 'user2', role: 'ADMIN' },
          { userId: 'user3' },
        ],
      },
    },
  });

  const channelPrivate = await prisma.channel.upsert({
    where: { id: 'channel2' },
    update: {},
    create: {
      id: 'channel2',
      name: 'Hidden chaaaaaat group',
      type: 'PRIVATE',
      users: {
        create: [
          { userId: 'user2', role: 'OWNER' },
          { userId: 'user4', role: 'USER' },
        ],
      },
      invites: {
        connect: [{ id: 'user1' }, { id: 'user2' }],
      },
    },
  });

  const channelProtected = await prisma.channel.upsert({
    where: { id: 'channel3' },
    update: {},
    create: {
      id: 'channel3',
      name: 'You shall not pass: hello',
      type: 'PROTECTED',
      passwordHash:
        '$argon2id$v=19$m=65536,t=3,p=4$u7C7YawZ2zrB8EMSxbnneg$R2p8E8EKJu7mr5TNRK8gmSipfZzfh2LvnM61CiCRdqY',
      users: {
        create: [
          { userId: 'user1', role: 'ADMIN' },
          { userId: 'user2', role: 'OWNER' },
          { userId: 'user4', role: 'USER' },
        ],
      },
    },
  });

  const directMessage1 = await prisma.channel.upsert({
    where: { id: 'channel4' },
    update: {},
    create: {
      id: 'channel4',
      name: 'Constant',
      type: 'DIRECTMESSAGE',
      users: {
        create: [{ userId: 'user1' }, { userId: 'user2' }],
      },
    },
  });

  const directMessage2 = await prisma.channel.upsert({
    where: { id: 'channel5' },
    update: {},
    create: {
      id: 'channel5',
      name: 'Léa',
      type: 'DIRECTMESSAGE',
      users: {
        create: [{ userId: 'user1' }, { userId: 'user3' }],
      },
    },
  });

  const Achievement1 = await prisma.achievement.upsert({
    where: { id: 'achievement1' },
    update: {},
    create: {
      id: 'achievement1',
      label: 'Who is the boss',
      image:
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2342&q=80',
      description: 'has been leader on the leaderboard',
    },
  });

  const Achievement2 = await prisma.achievement.upsert({
    where: { id: 'achievement2' },
    update: {},
    create: {
      id: 'achievement2',
      label: 'Social animal',
      image:
        'https://images.unsplash.com/photo-1484557985045-edf25e08da73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1973&q=80',
      description: 'has at least 1 friend',
    },
  });

  const Achievement3 = await prisma.achievement.upsert({
    where: { id: 'achievement3' },
    update: {},
    create: {
      id: 'achievement3',
      label: 'Serial ponger',
      image:
        'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
      description: 'has won at least 5 matches',
    },
  });

  const Achievement4 = await prisma.achievement.upsert({
    where: { id: 'achievement4' },
    update: {},
    create: {
      id: 'achievement4',
      label: 'It is the taking part that counts',
      image:
        'https://images.unsplash.com/photo-1527631120902-378417754324?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      description: 'has lost at least 5 matches',
    },
  });

  const Achievement5 = await prisma.achievement.upsert({
    where: { id: 'achievement5' },
    update: {},
    create: {
      id: 'achievement5',
      label: 'Security first',
      image:
        'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
      description: 'has set two factor authentication',
    },
  });

  const Achievement6 = await prisma.achievement.upsert({
    where: { id: 'achievement6' },
    update: {},
    create: {
      id: 'achievement6',
      label: 'Gaming mania',
      image:
        'https://images.unsplash.com/photo-1592839719941-8e2651039d01?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1425&q=80',
      description: 'has played at least 10 pong games',
    },
  });

  const Achievement7 = await prisma.achievement.upsert({
    where: { id: 'achievement7' },
    update: {},
    create: {
      id: 'achievement7',
      label: 'Builder',
      image:
        'https://images.unsplash.com/photo-1621077699198-692f1cc0173d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1885&q=80',
      description: 'has participated to build this amazing TranscenDance',
    },
  });

  console.log({
    Estelle,
    Constant,
    Lea,
    Colomban,
    channelPublic,
    channelPrivate,
    channelProtected,
    directMessage1,
    directMessage2,
    Achievement1,
    Achievement2,
    Achievement3,
    Achievement4,
    Achievement5,
    Achievement6,
    Achievement7,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
