import { PrismaClient, InventoryStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

type TeaSeed = {
  slug: string;
  name: string;
  teaType: string;
  shortDescription: string;
  description: string;
  flavourNotes: string[];
  aromaScore: number;
  bodyScore: number;
  sweetnessScore: number;
  roastScore: number;
  caffeineScore: number;
  caffeineLevel: string;
  strength: string;
  origin: string;
  region?: string;
  harvest?: string;
  cultivar?: string;
  processingMethod?: string;
  ingredients: string;
  leafAppearance?: string;
  timeOfDay?: string;
  brewingAmount: string;
  waterTempC: number;
  steepTimeSeconds: number;
  infusions: number;
  cupsEstimate: number;
  isBestSeller?: boolean;
  isStaffPick?: boolean;
  isNew?: boolean;
  isLimited?: boolean;
  isOrganic?: boolean;
  isGiftWorthy?: boolean;
  isFeatured?: boolean;
  moodTags: string[];
  image: string;
  sku: string;
  packageSize: string;
  retailPrice: number;
  unitCost: number;
  stockOnHand: number;
  reorderPoint: number;
  collections: string[];
};

const teas: TeaSeed[] = [
  {
    slug: "dragon-well-premium",
    name: "Dragon Well Premium",
    teaType: "Green Tea",
    shortDescription: "Silky chestnut sweetness with a clean, jade finish.",
    description:
      "Our Dragon Well Premium is a refined Longjing-style green tea selected for its flat emerald leaves and gentle chestnut aroma. It delivers a smooth morning cup without bitterness when brewed at the right temperature — an accessible introduction to premium Chinese green tea and a staple for everyday ritual.",
    flavourNotes: ["Chestnut", "Fresh Grass", "Sweet Pea"],
    aromaScore: 4,
    bodyScore: 2,
    sweetnessScore: 4,
    roastScore: 1,
    caffeineScore: 3,
    caffeineLevel: "Medium",
    strength: "Light",
    origin: "China",
    region: "Hangzhou, Zhejiang",
    harvest: "Early spring",
    cultivar: "Longjing #43",
    processingMethod: "Pan-fired",
    ingredients: "100% green tea leaves",
    leafAppearance: "Flat, emerald-green leaves",
    timeOfDay: "Morning",
    brewingAmount: "3g per 200ml",
    waterTempC: 80,
    steepTimeSeconds: 150,
    infusions: 3,
    cupsEstimate: 30,
    isBestSeller: true,
    isStaffPick: true,
    isOrganic: true,
    isFeatured: true,
    moodTags: ["morning-energy", "tea-for-beginners", "afternoon-reset"],
    image: "/images/products/dragon-well.svg",
    sku: "LLT-GR-001",
    packageSize: "50g",
    retailPrice: 2800,
    unitCost: 1100,
    stockOnHand: 48,
    reorderPoint: 12,
    collections: ["green-tea", "best-sellers", "beginners"],
  },
  {
    slug: "assam-golden-tip",
    name: "Assam Golden Tip",
    teaType: "Black Tea",
    shortDescription: "Rich malt and honey warmth for a confident morning cup.",
    description:
      "Assam Golden Tip is a full-bodied black tea with golden tips and a malty, honeyed profile. Ideal with or without milk, it is our recommendation for morning energy and anyone seeking a classic, smooth black tea online.",
    flavourNotes: ["Malt", "Honey", "Cocoa"],
    aromaScore: 4,
    bodyScore: 5,
    sweetnessScore: 3,
    roastScore: 2,
    caffeineScore: 5,
    caffeineLevel: "High",
    strength: "Strong",
    origin: "India",
    region: "Assam",
    harvest: "Second flush",
    processingMethod: "Orthodox",
    ingredients: "100% black tea leaves",
    leafAppearance: "Twisted dark leaves with golden tips",
    timeOfDay: "Morning",
    brewingAmount: "3g per 200ml",
    waterTempC: 95,
    steepTimeSeconds: 240,
    infusions: 2,
    cupsEstimate: 28,
    isBestSeller: true,
    isFeatured: true,
    moodTags: ["morning-energy", "after-dinner"],
    image: "/images/products/assam-golden.svg",
    sku: "LLT-BK-001",
    packageSize: "50g",
    retailPrice: 2400,
    unitCost: 900,
    stockOnHand: 62,
    reorderPoint: 15,
    collections: ["black-tea", "best-sellers"],
  },
  {
    slug: "ali-shan-high-mountain",
    name: "Ali Shan High Mountain",
    teaType: "Oolong",
    shortDescription: "Creamy floral oolong with orchid sweetness and lasting finish.",
    description:
      "Grown at elevation in Taiwan, Ali Shan High Mountain oolong offers a buttery mouthfeel, orchid aroma, and elegant sweetness. A gift-worthy premium oolong for afternoon reset or quiet evening ritual when you want complexity without heaviness.",
    flavourNotes: ["Orchid", "Cream", "Lilac"],
    aromaScore: 5,
    bodyScore: 3,
    sweetnessScore: 4,
    roastScore: 1,
    caffeineScore: 3,
    caffeineLevel: "Medium",
    strength: "Medium",
    origin: "Taiwan",
    region: "Ali Shan",
    harvest: "Spring",
    processingMethod: "Lightly oxidized, rolled",
    ingredients: "100% oolong tea leaves",
    leafAppearance: "Tightly rolled jade pearls",
    timeOfDay: "Afternoon",
    brewingAmount: "5g per 150ml",
    waterTempC: 90,
    steepTimeSeconds: 60,
    infusions: 5,
    cupsEstimate: 40,
    isBestSeller: true,
    isStaffPick: true,
    isGiftWorthy: true,
    isFeatured: true,
    moodTags: ["afternoon-reset", "gift-someone", "evening-ritual"],
    image: "/images/products/ali-shan.svg",
    sku: "LLT-OL-001",
    packageSize: "50g",
    retailPrice: 3600,
    unitCost: 1600,
    stockOnHand: 8,
    reorderPoint: 10,
    collections: ["oolong", "best-sellers", "gifts"],
  },
  {
    slug: "silver-needle-reserve",
    name: "Silver Needle Reserve",
    teaType: "White Tea",
    shortDescription: "Delicate honey melon clarity with a soft, calming finish.",
    description:
      "Silver Needle Reserve is a refined white tea made from tender buds. Expect a pale liquor, gentle honey-melon sweetness, and low astringency — ideal for evening ritual and those seeking a low-caffeine premium experience.",
    flavourNotes: ["Honeydew", "Hay", "White Florals"],
    aromaScore: 4,
    bodyScore: 2,
    sweetnessScore: 4,
    roastScore: 0,
    caffeineScore: 2,
    caffeineLevel: "Low",
    strength: "Light",
    origin: "China",
    region: "Fuding, Fujian",
    harvest: "Early spring buds",
    processingMethod: "Withered and dried",
    ingredients: "100% white tea buds",
    leafAppearance: "Silvery downy buds",
    timeOfDay: "Evening",
    brewingAmount: "3g per 200ml",
    waterTempC: 85,
    steepTimeSeconds: 180,
    infusions: 3,
    cupsEstimate: 32,
    isStaffPick: true,
    isGiftWorthy: true,
    moodTags: ["evening-ritual", "relax-unwind", "tea-for-beginners"],
    image: "/images/products/silver-needle.svg",
    sku: "LLT-WH-001",
    packageSize: "40g",
    retailPrice: 4200,
    unitCost: 1900,
    stockOnHand: 24,
    reorderPoint: 8,
    collections: ["white-tea", "gifts", "beginners"],
  },
  {
    slug: "chamomile-moon",
    name: "Chamomile Moon",
    teaType: "Herbal",
    shortDescription: "Apple-soft chamomile comfort for wind-down evenings.",
    description:
      "Chamomile Moon is a caffeine-free herbal blend of whole chamomile blossoms with a soft apple-like sweetness. Perfect for relax and unwind moments after dinner, with simple brewing and a naturally calming cup.",
    flavourNotes: ["Apple", "Honey", "Soft Florals"],
    aromaScore: 4,
    bodyScore: 2,
    sweetnessScore: 4,
    roastScore: 0,
    caffeineScore: 0,
    caffeineLevel: "None",
    strength: "Light",
    origin: "Egypt",
    region: "Nile Delta",
    processingMethod: "Sun-dried blossoms",
    ingredients: "Organic chamomile flowers",
    leafAppearance: "Whole dried blossoms",
    timeOfDay: "Evening",
    brewingAmount: "2g per 250ml",
    waterTempC: 100,
    steepTimeSeconds: 300,
    infusions: 1,
    cupsEstimate: 35,
    isBestSeller: true,
    isOrganic: true,
    moodTags: ["evening-ritual", "relax-unwind", "after-dinner"],
    image: "/images/products/chamomile.svg",
    sku: "LLT-HB-001",
    packageSize: "40g",
    retailPrice: 1800,
    unitCost: 700,
    stockOnHand: 80,
    reorderPoint: 20,
    collections: ["herbal", "best-sellers", "beginners"],
  },
  {
    slug: "ripe-puerh-ancient-tree",
    name: "Ripe Pu-erh Ancient Tree",
    teaType: "Pu-erh",
    shortDescription: "Deep earth, dried plum, and velvet smoothness after dinner.",
    description:
      "A carefully aged ripe pu-erh with forest-floor depth, dried plum sweetness, and a remarkably smooth body. Recommended after dinner when you want richness without sharp tannin.",
    flavourNotes: ["Earth", "Dried Plum", "Cocoa Husk"],
    aromaScore: 3,
    bodyScore: 5,
    sweetnessScore: 3,
    roastScore: 2,
    caffeineScore: 3,
    caffeineLevel: "Medium",
    strength: "Strong",
    origin: "China",
    region: "Yunnan",
    harvest: "Spring material, ripened",
    processingMethod: "Wo dui fermentation",
    ingredients: "100% ripened pu-erh tea",
    leafAppearance: "Dark compressed leaf, loose pieces",
    timeOfDay: "After dinner",
    brewingAmount: "5g per 150ml",
    waterTempC: 95,
    steepTimeSeconds: 30,
    infusions: 8,
    cupsEstimate: 45,
    isLimited: true,
    moodTags: ["after-dinner", "evening-ritual"],
    image: "/images/products/puerh.svg",
    sku: "LLT-PE-001",
    packageSize: "50g",
    retailPrice: 3200,
    unitCost: 1400,
    stockOnHand: 18,
    reorderPoint: 8,
    collections: ["pu-erh", "seasonal"],
  },
  {
    slug: "ceremonial-uji-matcha",
    name: "Ceremonial Uji Matcha",
    teaType: "Matcha",
    shortDescription: "Vibrant umami matcha with soft sweetness and vivid green.",
    description:
      "Stone-milled ceremonial matcha from Uji with vivid color, oceanic umami, and a soft finish. Whisk for a focused morning ritual or gift to someone ready to elevate everyday tea.",
    flavourNotes: ["Umami", "Sweet Pea", "Fresh Spinach"],
    aromaScore: 4,
    bodyScore: 4,
    sweetnessScore: 3,
    roastScore: 0,
    caffeineScore: 4,
    caffeineLevel: "High",
    strength: "Medium",
    origin: "Japan",
    region: "Uji, Kyoto",
    harvest: "First harvest",
    processingMethod: "Shade-grown, stone-milled",
    ingredients: "100% stone-milled green tea",
    leafAppearance: "Fine jade powder",
    timeOfDay: "Morning",
    brewingAmount: "2g per 70ml",
    waterTempC: 75,
    steepTimeSeconds: 0,
    infusions: 1,
    cupsEstimate: 25,
    isNew: true,
    isGiftWorthy: true,
    isFeatured: true,
    moodTags: ["morning-energy", "gift-someone"],
    image: "/images/products/matcha.svg",
    sku: "LLT-MT-001",
    packageSize: "30g",
    retailPrice: 3800,
    unitCost: 1700,
    stockOnHand: 30,
    reorderPoint: 10,
    collections: ["matcha", "gifts", "best-sellers"],
  },
  {
    slug: "osmanthus-amber-oolong",
    name: "Osmanthus Amber Oolong",
    teaType: "Oolong",
    shortDescription: "Roasted amber oolong lifted by fragrant osmanthus blossom.",
    description:
      "A roasted Taiwanese oolong layered with natural osmanthus aroma — stone fruit, toasted grain, and floral honey. A staff pick for afternoon cups and an inviting best gift for tea lovers who enjoy warm, aromatic profiles.",
    flavourNotes: ["Osmanthus", "Stone Fruit", "Toasted Grain"],
    aromaScore: 5,
    bodyScore: 4,
    sweetnessScore: 4,
    roastScore: 4,
    caffeineScore: 3,
    caffeineLevel: "Medium",
    strength: "Medium",
    origin: "Taiwan",
    region: "Nantou",
    harvest: "Winter",
    processingMethod: "Roasted oolong with osmanthus",
    ingredients: "Oolong tea, osmanthus flowers",
    leafAppearance: "Dark rolled leaves with golden blossoms",
    timeOfDay: "Afternoon",
    brewingAmount: "4g per 200ml",
    waterTempC: 95,
    steepTimeSeconds: 120,
    infusions: 4,
    cupsEstimate: 35,
    isStaffPick: true,
    isGiftWorthy: true,
    isNew: true,
    moodTags: ["afternoon-reset", "gift-someone", "evening-ritual"],
    image: "/images/products/osmanthus.svg",
    sku: "LLT-OL-002",
    packageSize: "50g",
    retailPrice: 3400,
    unitCost: 1500,
    stockOnHand: 5,
    reorderPoint: 10,
    collections: ["oolong", "gifts", "seasonal"],
  },
];

const articles = [
  {
    slug: "how-to-brew-loose-leaf-tea",
    title: "How to Brew Loose Leaf Tea",
    excerpt: "A clear, calm method for brewing exceptional cups at home.",
    category: "Brewing Guides",
    body: `## Start with good water\n\nUse fresh, filtered water. Bring it to the right temperature for your tea type — green teas prefer cooler water, while black and herbal teas can take a full boil.\n\n## Measure with intention\n\nA helpful starting point is about 2–3 grams of tea per 200ml of water. Adjust for taste rather than chasing rigid rules.\n\n## Steep, taste, adjust\n\nFollow the suggested steep time on each Lux Leaf Tea product page, then taste. A second infusion often reveals new sweetness and aroma.\n\nExplore our [green tea collection](/collections/green-tea) or take the [Find Your Tea](/find-your-tea) quiz if you are still deciding.`,
  },
  {
    slug: "loose-leaf-tea-vs-tea-bags",
    title: "Loose Leaf Tea vs Tea Bags",
    excerpt: "Why whole leaves change flavour, aroma, and value.",
    category: "Tea Basics",
    body: `## Space to open\n\nLoose-leaf tea has room to unfurl, releasing essential oils and nuanced flavour that finely cut bagged tea often cannot.\n\n## Clarity over convenience alone\n\nTea bags win on speed. Loose leaf wins on character, aroma, and cups per gram — especially with premium whole-leaf teas.\n\n## Simple tools\n\nA basket infuser or teapot is enough. No ceremony required unless you want one.`,
  },
  {
    slug: "what-is-oolong-tea",
    title: "What Is Oolong Tea?",
    excerpt: "Between green and black — floral, roasted, or creamy.",
    category: "Oolong",
    body: `Oolong sits between green and black tea, with partial oxidation that can yield orchid florals, creamy texture, or toasted grain notes.\n\nTry [Ali Shan High Mountain](/products/ali-shan-high-mountain) for a light floral style or [Osmanthus Amber Oolong](/products/osmanthus-amber-oolong) for a roasted, fragrant cup.`,
  },
  {
    slug: "green-tea-brewing-temperature-guide",
    title: "Green Tea Brewing Temperature Guide",
    excerpt: "Protect sweetness and avoid bitterness with cooler water.",
    category: "Green Tea",
    body: `Most green teas shine between 75–85°C. Water that is too hot can push bitterness forward and mute chestnut or floral sweetness.\n\nFor [Dragon Well Premium](/products/dragon-well-premium), begin around 80°C for 2–3 minutes.`,
  },
  {
    slug: "how-much-loose-leaf-tea-per-cup",
    title: "How Much Loose Leaf Tea Per Cup?",
    excerpt: "A practical measuring guide for everyday brewing.",
    category: "Brewing Guides",
    body: `Use roughly one teaspoon (about 2–3g) per cup for many western-style infusions. Rolled oolongs and dense leaves may need a slightly heaped measure. Each Lux Leaf product page lists a precise starting amount.`,
  },
  {
    slug: "how-long-does-loose-leaf-tea-stay-fresh",
    title: "How Long Does Loose Leaf Tea Stay Fresh?",
    excerpt: "Storage habits that protect aroma and flavour.",
    category: "Tea Storage",
    body: `Store tea airtight, away from light, heat, moisture, and strong odours. Most loose-leaf teas taste best within 12 months of packing; delicate greens and matcha prefer faster enjoyment.`,
  },
  {
    slug: "beginners-guide-to-premium-tea",
    title: "Beginner’s Guide to Premium Tea",
    excerpt: "Start simply — flavour first, jargon later.",
    category: "Tea Basics",
    body: `You do not need to be an expert. Choose a flavour direction, notice caffeine needs, and brew with care. Our [Find Your Tea](/find-your-tea) quiz recommends three teas with clear reasons why.`,
  },
  {
    slug: "best-tea-gifts",
    title: "Best Tea Gifts",
    excerpt: "Thoughtful sets and single tins that feel personal.",
    category: "Gift Guides",
    body: `Gift-worthy teas balance beautiful flavour with approachable brewing. Consider floral oolongs, ceremonial matcha, or a discovery set from our [gift collection](/gifts).`,
  },
  {
    slug: "black-tea-vs-green-tea",
    title: "Black Tea vs Green Tea",
    excerpt: "Oxidation, flavour, caffeine, and when to drink each.",
    category: "Comparison Guides",
    body: `Green tea is minimally oxidized — fresher, grassier, or nuttier. Black tea is fully oxidized — maltier, bolder, often higher in perceived strength. Mornings often suit black tea; late mornings and afternoons suit green.`,
  },
  {
    slug: "how-to-store-loose-leaf-tea",
    title: "How to Store Loose Leaf Tea",
    excerpt: "Keep leaves vivid with simple, careful storage.",
    category: "Tea Storage",
    body: `Use opaque airtight tins. Avoid the refrigerator unless you are storing sealed matcha short-term with care against moisture. Never store tea beside spices or coffee.`,
  },
];

async function main() {
  await prisma.notificationLog.deleteMany();
  await prisma.stockAlert.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.inventoryReservation.deleteMany();
  await prisma.purchaseOrderItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.orderEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.bundleItem.deleteMany();
  await prisma.bundle.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.productRelation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.contentArticle.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hash("changeme-admin", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@luxleaftea.com",
      name: "Lux Leaf Admin",
      role: "ADMIN",
      passwordHash: adminPassword,
    },
  });

  const supplier = await prisma.supplier.create({
    data: {
      name: "East Mountain Tea Co.",
      contactName: "Mei Lin",
      email: "orders@eastmountain.example",
      phone: "+1-555-0100",
      leadTimeDays: 14,
      notes: "Primary green, oolong, and white tea supplier",
    },
  });

  const collectionDefs = [
    { slug: "green-tea", name: "Green Tea", type: "tea-type", description: "Fresh, refined green teas with clarity and sweetness." },
    { slug: "black-tea", name: "Black Tea", type: "tea-type", description: "Full-bodied black teas for mornings and classic cups." },
    { slug: "oolong", name: "Oolong", type: "tea-type", description: "Floral to roasted oolongs with layered aroma." },
    { slug: "white-tea", name: "White Tea", type: "tea-type", description: "Delicate white teas with soft sweetness." },
    { slug: "herbal", name: "Herbal", type: "tea-type", description: "Caffeine-free herbal infusions for calm evenings." },
    { slug: "pu-erh", name: "Pu-erh", type: "tea-type", description: "Deep, smooth fermented teas with lasting character." },
    { slug: "matcha", name: "Matcha", type: "tea-type", description: "Vibrant ceremonial-grade matcha." },
    { slug: "seasonal", name: "Seasonal / Limited", type: "tea-type", description: "Limited harvests and seasonal releases." },
    { slug: "best-sellers", name: "Best Sellers", type: "curated", description: "Customer-loved teas to start with." },
    { slug: "gifts", name: "Gift Sets", type: "occasion", description: "Gift-worthy teas and elevated sets." },
    { slug: "beginners", name: "Tea for Beginners", type: "occasion", description: "Approachable premium teas with clear brewing guidance." },
    { slug: "morning-energy", name: "Morning Energy", type: "mood", description: "Bright, strengthening cups to begin the day." },
    { slug: "afternoon-reset", name: "Afternoon Reset", type: "mood", description: "Balanced teas for a calm mid-day pause." },
    { slug: "evening-ritual", name: "Evening Ritual", type: "mood", description: "Softer cups for winding down." },
    { slug: "after-dinner", name: "After Dinner", type: "mood", description: "Digestive-friendly depth after meals." },
    { slug: "relax-unwind", name: "Relax & Unwind", type: "mood", description: "Gentle, low or no caffeine comfort." },
    { slug: "gift-someone", name: "Gift Someone", type: "mood", description: "Beautiful teas ready to give." },
  ];

  const collections = new Map<string, string>();
  for (const [index, c] of collectionDefs.entries()) {
    const created = await prisma.collection.create({
      data: { ...c, sortOrder: index, seoTitle: `${c.name} | Lux Leaf Tea`, seoDescription: c.description },
    });
    collections.set(c.slug, created.id);
  }

  for (const tea of teas) {
    const product = await prisma.product.create({
      data: {
        slug: tea.slug,
        name: tea.name,
        teaType: tea.teaType,
        shortDescription: tea.shortDescription,
        description: tea.description,
        seoTitle: `${tea.name} — Premium ${tea.teaType} | Lux Leaf Tea`,
        seoDescription: tea.shortDescription,
        flavourNotes: JSON.stringify(tea.flavourNotes),
        aromaScore: tea.aromaScore,
        bodyScore: tea.bodyScore,
        sweetnessScore: tea.sweetnessScore,
        roastScore: tea.roastScore,
        caffeineScore: tea.caffeineScore,
        caffeineLevel: tea.caffeineLevel,
        strength: tea.strength,
        origin: tea.origin,
        region: tea.region,
        harvest: tea.harvest,
        cultivar: tea.cultivar,
        processingMethod: tea.processingMethod,
        ingredients: tea.ingredients,
        leafAppearance: tea.leafAppearance,
        timeOfDay: tea.timeOfDay,
        storageInstructions: "Store airtight, away from light, heat, moisture, and strong odours.",
        brewingAmount: tea.brewingAmount,
        waterTempC: tea.waterTempC,
        steepTimeSeconds: tea.steepTimeSeconds,
        infusions: tea.infusions,
        cupsEstimate: tea.cupsEstimate,
        isBestSeller: tea.isBestSeller ?? false,
        isStaffPick: tea.isStaffPick ?? false,
        isNew: tea.isNew ?? false,
        isLimited: tea.isLimited ?? false,
        isOrganic: tea.isOrganic ?? false,
        isGiftWorthy: tea.isGiftWorthy ?? false,
        isFeatured: tea.isFeatured ?? false,
        moodTags: JSON.stringify(tea.moodTags),
        images: JSON.stringify([tea.image]),
        published: true,
      },
    });

    const available = tea.stockOnHand;
    const status: InventoryStatus =
      available <= 0 ? "OUT_OF_STOCK" : available <= tea.reorderPoint ? "LOW_STOCK" : "IN_STOCK";

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: tea.sku,
        name: tea.packageSize,
        packageSize: tea.packageSize,
        retailPrice: tea.retailPrice,
        unitCost: tea.unitCost,
        weightGrams: parseInt(tea.packageSize, 10) || 50,
        isDefault: true,
        inventory: {
          create: {
            supplierId: supplier.id,
            supplierSku: tea.sku.replace("LLT", "EM"),
            stockOnHand: tea.stockOnHand,
            stockReserved: 0,
            reorderPoint: tea.reorderPoint,
            reorderQuantity: 50,
            leadTimeDays: 14,
            warehouseLocation: "A-01",
            inventoryStatus: status,
            lastRestockedAt: new Date(),
          },
        },
      },
    });

    for (const [i, slug] of tea.collections.entries()) {
      const collectionId = collections.get(slug);
      if (!collectionId) continue;
      await prisma.collectionProduct.create({
        data: { collectionId, productId: product.id, sortOrder: i },
      });
    }

    // Create low-stock alerts for items already at/below reorder point
    if (tea.stockOnHand <= tea.reorderPoint) {
      await prisma.stockAlert.create({
        data: {
          variantId: variant.id,
          supplierId: supplier.id,
          sku: tea.sku,
          productName: tea.name,
          stockAvailable: tea.stockOnHand,
          reorderPoint: tea.reorderPoint,
          suggestedReorderQty: 50,
          status: "OPEN",
        },
      });
    }
  }

  await prisma.bundle.create({
    data: {
      slug: "tea-discovery-set",
      name: "Tea Discovery Set",
      description: "Three approachable premium teas for exploring flavour with confidence.",
      price: 6800,
      image: "/images/products/discovery-set.svg",
      items: {
        create: [
          { productId: (await prisma.product.findUniqueOrThrow({ where: { slug: "dragon-well-premium" } })).id, quantity: 1 },
          { productId: (await prisma.product.findUniqueOrThrow({ where: { slug: "ali-shan-high-mountain" } })).id, quantity: 1 },
          { productId: (await prisma.product.findUniqueOrThrow({ where: { slug: "chamomile-moon" } })).id, quantity: 1 },
        ],
      },
    },
  });

  for (const article of articles) {
    await prisma.contentArticle.create({
      data: {
        ...article,
        seoTitle: `${article.title} | Lux Leaf Tea Guide`,
        seoDescription: article.excerpt,
      },
    });
  }

  await prisma.faqItem.createMany({
    data: [
      {
        question: "How much loose-leaf tea should I use?",
        answer: "Start with the amount listed on each product page — typically 2–3g per cup — then adjust to taste.",
        category: "brewing",
        sortOrder: 1,
      },
      {
        question: "Do you offer free shipping?",
        answer: "Orders of $50 or more ship free within the contiguous United States. Rates for other regions are calculated at checkout.",
        category: "shipping",
        sortOrder: 2,
      },
      {
        question: "What is your return policy?",
        answer: "Unopened products may be returned within 30 days of delivery. Contact us and we will guide you through the process.",
        category: "returns",
        sortOrder: 3,
      },
      {
        question: "Is checkout guest-friendly?",
        answer: "Yes. You can check out as a guest — account creation is optional.",
        category: "orders",
        sortOrder: 4,
      },
    ],
  });

  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      type: "percent",
      amount: 10,
      minSubtotal: 4000,
      active: true,
    },
  });

  await prisma.siteSetting.createMany({
    data: [
      { key: "free_shipping_threshold", value: "5000" },
      { key: "announcement_bar", value: "Free shipping on orders $50+" },
      { key: "store_currency", value: "CAD" },
      { key: "support_email", value: "hello@luxleaftea.com" },
    ],
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "SEED_DATABASE",
      entityType: "System",
      after: JSON.stringify({ products: teas.length }),
    },
  });

  console.log(`Seeded ${teas.length} teas, admin ${admin.email}, supplier ${supplier.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
