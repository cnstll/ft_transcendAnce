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
      passwordHash: 'security',
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
      passwordHash: 'security',
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
      passwordHash: 'security',
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
      passwordHash: 'security',
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
  })

  const channelPublic = await prisma.channel.upsert({
    where: { id: 'channel1' },
    update: {},
    create: {
      id: 'channel1',
      name: 'Les démons de minuit',
      users: {
        create: [
          { userId: 'user1', role: 'ADMIN' },
          { userId: 'user2' },
          { userId: 'user3' }
        ]
      }
    },
  })

  const channelPrivate = await prisma.channel.upsert({
    where: { id: 'channel2' },
    update: {},
    create: {
      id: 'channel2',
      name: 'Hidden chaaaaaaaaaaaaaaaaaaaat group',
      type: 'PRIVATE',
      users: {
        create: [
          { userId: 'user1' },
          { userId: 'user2', role: 'ADMIN' },
        ]
      }
    },
  })

  const channelProtected = await prisma.channel.upsert({
    where: { id: 'channel3' },
    update: {},
    create: {
      id: 'channel3',
      name: 'You shall not pass',
      type: 'PROTECTED',
      passwordHash: 'security',
      users: {
        create: [
          { userId: 'user1', role: 'ADMIN' },
          { userId: 'user3' },
        ]
      }
    },
  })

  const directMessage1 = await prisma.channel.upsert({
    where: { id: 'channel4' },
    update: {},
    create: {
      id: 'channel4',
      name: 'Constant',
      type: 'DIRECTMESSAGE',
      users: {
        create: [
          { userId: 'user1' },
          { userId: 'user2' },
        ]
      }
    },
  })

  const directMessage2 = await prisma.channel.upsert({
    where: { id: 'channel5' },
    update: {},
    create: {
      id: 'channel5',
      name: 'Léa',
      type: 'DIRECTMESSAGE',
      users: {
        create: [
          { userId: 'user1' },
          { userId: 'user3' },
        ]
      }
    },
  })

  const channelPublic2 = await prisma.channel.upsert({
    where: { id: 'channel4' },
    update: {},
    create: {
      id: 'channel1',
      name: 'Channel test 4',
      users: {
        create: [
          { userId: 'user1', role: 'ADMIN' },
          { userId: 'user2' },
          { userId: 'user3' }
        ]
      }
    },
  })

  const channelPrivate2 = await prisma.channel.upsert({
    where: { id: 'channel5' },
    update: {},
    create: {
      id: 'channel2',
      name: 'Channel test 5',
      type: 'PRIVATE',
      users: {
        create: [
          { userId: 'user1' },
          { userId: 'user2', role: 'ADMIN' },
        ]
      }
    },
  })

  console.log({ Estelle, Constant, Lea, Colomban, channelPublic, channelPrivate,
    channelProtected, directMessage1, directMessage2, channelPublic2, channelPrivate2 })
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
