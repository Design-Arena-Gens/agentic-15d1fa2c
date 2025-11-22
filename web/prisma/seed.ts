import { PrismaClient, DiscountType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with demo data...");

  await prisma.offerOnMenuItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItemOptionValue.deleteMany();
  await prisma.menuItemOption.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.offer.deleteMany();

  const categories = await prisma.$transaction([
    prisma.menuCategory.create({
      data: {
        slug: "meals",
        name: "الوجبات",
        description: "أطباق رئيسية سعودية وعالمية",
        order: 1,
        heroImage: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?q=80&w=1200",
      },
    }),
    prisma.menuCategory.create({
      data: {
        slug: "drinks",
        name: "المشروبات",
        description: "عصائر طازجة ومشروبات غازية",
        order: 2,
        heroImage: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200",
      },
    }),
    prisma.menuCategory.create({
      data: {
        slug: "desserts",
        name: "الحلويات",
        description: "حلويات شرقية وغربية",
        order: 3,
        heroImage: "https://images.unsplash.com/photo-1505253216365-818ebc57f3f4?q=80&w=1200",
      },
    }),
    prisma.menuCategory.create({
      data: {
        slug: "sandwiches",
        name: "السندويتشات",
        description: "سندويتشات ساخنة وباردة",
        order: 4,
        heroImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200",
      },
    }),
    prisma.menuCategory.create({
      data: {
        slug: "coffee",
        name: "القهوة",
        description: "قهوة مختصة ومشروبات ساخنة",
        order: 5,
        heroImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200",
      },
    }),
    prisma.menuCategory.create({
      data: {
        slug: "breakfast",
        name: "الفطور",
        description: "وجبات صباحية خفيفة",
        order: 6,
        heroImage: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1200",
      },
    }),
  ]);

  const mealsCategory = categories[0];
  const drinksCategory = categories[1];
  const dessertsCategory = categories[2];
  const sandwichesCategory = categories[3];
  const coffeeCategory = categories[4];
  const breakfastCategory = categories[5];

  const signatureKabsa = await prisma.menuItem.create({
    data: {
      categoryId: mealsCategory.id,
      name: "كبسة لحم بريميوم",
      description: "كبسة سعودية أصيلة مطهوة على الفحم مع لحم تندر وبهارات خاصة بالحلو والمالح.",
      price: 68.0,
      imageUrl: "https://images.unsplash.com/photo-1604908176997-12518821b228?q=80&w=1200",
      preparationTime: 35,
      spicyLevel: 2,
      calories: 720,
      tags: ["سعودي", "أرز"],
    },
  });

  const truffleBurger = await prisma.menuItem.create({
    data: {
      categoryId: sandwichesCategory.id,
      name: "برجر الكمأة",
      description: "برجر بقر أنجوس مع جبن الشيدر، صلصة الكمأة السوداء، وبصل مكرمل يقدم مع بطاطس هاند كت.",
      price: 54.0,
      imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200",
      preparationTime: 20,
      spicyLevel: 1,
      calories: 820,
      tags: ["برجر", "كمأة"],
    },
  });

  const pistachioKunafa = await prisma.menuItem.create({
    data: {
      categoryId: dessertsCategory.id,
      name: "كنافة الفستق",
      description: "كنافة طرية محشوة بالقشطة الطازجة ومغطاة بالفستق الحلبي وصوص الزعفران.",
      price: 32.0,
      imageUrl: "https://images.unsplash.com/photo-1543353071-087092ec393e?q=80&w=1200",
      preparationTime: 12,
      spicyLevel: 0,
      calories: 460,
      tags: ["حلويات", "فستق"],
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: mealsCategory.id,
        name: "مندي دجاج مدخن",
        description: "دجاج مدخن على الطريقة التقليدية مع أرز بسمتي وخلطة بهارات خاصة.",
        price: 48.0,
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200",
        preparationTime: 28,
        spicyLevel: 1,
        calories: 630,
        tags: ["دجاج"],
      },
      {
        categoryId: mealsCategory.id,
        name: "فتة شاورما لحم",
        description: "فتة شاورما لحم بصلصة الطحينة والثوم مع خبز عربي مقرمش.",
        price: 44.0,
        imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1200",
        preparationTime: 18,
        spicyLevel: 3,
        calories: 540,
        tags: ["شاورما"],
      },
      {
        categoryId: drinksCategory.id,
        name: "عصير رمان فريش",
        description: "عصير رمان طازج مع لمسة من ماء الورد.",
        price: 19.0,
        imageUrl: "https://images.unsplash.com/photo-1621504450181-f8a211dfe631?q=80&w=1200",
        preparationTime: 3,
        spicyLevel: 0,
        calories: 130,
        tags: ["عصائر"],
      },
      {
        categoryId: drinksCategory.id,
        name: "ليمون بالنعناع",
        description: "عصير ليمون منعش مع نعناع طازج وعسل السدر.",
        price: 17.0,
        imageUrl: "https://images.unsplash.com/photo-1527169402691-feff5539e52c?q=80&w=1200",
        preparationTime: 4,
        spicyLevel: 0,
        calories: 110,
        tags: ["منعش"],
      },
      {
        categoryId: dessertsCategory.id,
        name: "تشيز كيك تمر",
        description: "تشيز كيك بصلصة التمر والكراميل مع قاعدة بسكويت دايجستف.",
        price: 27.0,
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200",
        preparationTime: 10,
        spicyLevel: 0,
        calories: 390,
        tags: ["تشيز كيك"],
      },
      {
        categoryId: coffeeCategory.id,
        name: "سبانيش لاتيه",
        description: "قهوة لاتيه مثلجة مع حليب مكثف وصوص كراميل.",
        price: 22.0,
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200",
        preparationTime: 5,
        spicyLevel: 0,
        calories: 210,
        tags: ["قهوة"],
      },
      {
        categoryId: breakfastCategory.id,
        name: "شكشوكة بالفلفل",
        description: "بيض بلدي مطهو مع صلصة الطماطم والفلفل الحار يقدم مع خبز التنور.",
        price: 24.0,
        imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200",
        preparationTime: 12,
        spicyLevel: 2,
        calories: 450,
        tags: ["فطور"],
      },
    ],
  });

  await prisma.menuItemOption.create({
    data: {
      menuItemId: truffleBurger.id,
      label: "اختيار الخبز",
      type: "single",
      isRequired: true,
      values: {
        create: [
          { name: "خبز البطاطس", priceDelta: 0, isDefault: true },
          { name: "خبز البريوش", priceDelta: 4 },
        ],
      },
    },
  });

  const launchOffer = await prisma.offer.create({
    data: {
      title: "خصم الافتتاح الكبير",
      description: "خصم 25% على جميع الطلبات فوق 150 ريال",
      discountType: DiscountType.PERCENTAGE,
      value: 25,
      minimumSpend: 150,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      imageUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=1200",
      isActive: true,
    },
  });

  await prisma.offerOnMenuItem.createMany({
    data: [
      { offerId: launchOffer.id, menuItemId: signatureKabsa.id },
      { offerId: launchOffer.id, menuItemId: truffleBurger.id },
      { offerId: launchOffer.id, menuItemId: pistachioKunafa.id },
    ],
  });

  await prisma.recommendation.createMany({
    data: [
      { menuItemId: signatureKabsa.id, context: "محبي الأطباق السعودية", weight: 0.94 },
      { menuItemId: truffleBurger.id, context: "أفضل السندويتشات", weight: 0.89 },
      { menuItemId: pistachioKunafa.id, context: "حلويات لا تُقاوم", weight: 0.92 },
    ],
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
