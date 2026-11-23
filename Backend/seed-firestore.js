import admin from "firebase-admin";
import { readFileSync } from "fs";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

if (process.env.FIRESTORE_EMULATOR_HOST) {
  // Seed vào Firebase Emulator (local), không cần service account
  admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || "demo-gugugaga" });
} else {
  const serviceAccount = JSON.parse(
    readFileSync(
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json",
      "utf8"
    )
  );
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

// Ảnh món ăn trên Cloudinary của nhóm (ghép theo tên món)
const PRODUCT_IMAGES = {
  "Bánh Đúc Nóng Hà Nội": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780377900/products/ifukfsicgxqkpycqfjht.jpg",
  "Bánh Cuốn Nóng Thịt Mộc Nhĩ": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378324/products/hicpstip74io4mw6z8yu.jpg",
  "Bánh Khọt Vũng Tàu Tôm Tươi": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378276/products/gkvy2ivjmzcc8qwgo1mm.jpg",
  "Bánh Mì Thịt Nướng Đặc Biệt": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378250/products/n52cw5jsqx7zj9miktpm.jpg",
  "Bánh Bột Lọc Trần Nhân Tôm Thịt": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378340/products/ycbveevhpd0pr02nksfg.jpg",
  "Bánh Tét Nhân Thịt Mỡ Đậu Xanh": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378203/products/eabrupylz1lvo5wiguji.jpg",
  "Mẹt Bún Đậu Mắm Tôm Đầy Đủ": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378561/products/gaiul5gywufu2onqqmzw.jpg",
  "Nem Chua Rán Ngon Giòn": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378309/products/n79reuuynm3otpfxsrl8.jpg",
  "Bánh Bèo Chén Miền Trung": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378418/products/yrvqlvltnaqyenxj8dua.jpg",
  "Bún Riêu Cua Sườn Sụn": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378355/products/lldercvpakf7y57nb9eb.jpg",
  "Bún Mắm Miền Tây Sạch Sẽ": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378030/products/adsadn5nmk7tz0y6rmgw.jpg",
  "Bánh Tráng Nướng Đà Lạt Mỡ Hành": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378403/products/gdaprmebkhztvf6qrgpr.jpg",
  "Bánh Canh Cua Bột Gạo": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378437/products/npzfjshz7jajeiiqbdqo.jpg",
  "Gỏi Cuốn Tôm Thịt Nước Tương": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378293/products/nhsrgwxkg9dcte5ga4nw.jpg",
  "Bánh Xèo Nam Bộ Tôm Thịt": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378100/products/tznn6cvrn8vpiiratcoz.jpg",
  "Hủ Tiếu Nam Vang Khô/Nước": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378077/products/al3bfb4dsweorgxsfao7.jpg",
  "Bún Thịt Nướng Chả Giò": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378458/products/oeqckx8znjlewlgneoqr.jpg",
  "Cơm Cá Kho Tộ Đậm Đà": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378506/products/bs4btihruhg5sdbwdxha.jpg",
  "Cơm Tấm Sườn Bì Chả Trứng": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378387/products/hakz4cd2xt4i8mqpmzkc.jpg",
  "Bánh Chưng Đậu Xanh Thịt Mỡ": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378158/products/nhvn13v35axdquqoxnsp.jpg",
  "Bánh Căn Trứng Cút": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378373/products/zh8yvrkp8rwrhjnutrxy.jpg",
  "Bún Bò Huế Đặc Biệt Giò Chả": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378053/products/dw9lldoz2lasqeyrxg5s.jpg",
  "Xôi Xéo Ruốc Hành Phi Mỡ Gà": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378541/products/rf2uimuzjknfqlte23yl.jpg",
  "Cao Lầu Hội An Thịt Xá Xíu": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378525/products/iv5u1mrvp25sj3njfe8c.jpg",
  "Mỳ Quảng Tôm Thịt Trứng Cút": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378011/products/tqccbeh4zlrkdoazn7ux.jpg",
  "Phở Bò Tái Nạm Gầu Cực Chất": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780377926/products/kgwy4s07h1wrazuoqyy1.jpg",
  "Cháo Lòng Nóng Hổi Đầy Đủ": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780377984/products/v8j47iq3drkkpx68xdvb.jpg",
  "Bánh Pía Sầu Riêng Trứng Muối": "https://res.cloudinary.com/dtgcs1gtj/image/upload/v1780378234/products/nctk1tuuut9ktqbqdyvs.jpg",
};


async function deleteCollection(collectionPath) {
  const snap = await db.collection(collectionPath).get();
  if (snap.empty) return;
  const batch = db.batch();
  snap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

async function deleteSubCollections(collectionPath, subCollectionName) {
  const snap = await db.collection(collectionPath).get();
  for (const doc of snap.docs) {
    const subSnap = await doc.ref.collection(subCollectionName).get();
    if (!subSnap.empty) {
      const batch = db.batch();
      subSnap.docs.forEach((subDoc) => batch.delete(subDoc.ref));
      await batch.commit();
    }
  }
}

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  console.log("Deleting existing data...");

  // Delete sub-collections first
  await deleteSubCollections("bills", "billItems");
  await deleteSubCollections("orders", "orderItems");
  await deleteSubCollections("carts", "cartItems");
  await deleteSubCollections("combos", "comboItems");

  // Delete main collections
  await deleteCollection("bills");
  await deleteCollection("orders");
  await deleteCollection("carts");
  await deleteCollection("combos");
  await deleteCollection("products");
  await deleteCollection("categories");
  await deleteCollection("drivers");
  await deleteCollection("branches");
  await deleteCollection("users");

  console.log("Seeding data...");

  const now = new Date();

  // Create admin user
  await db.collection("users").add({
    name: "Admin",
    email: "admin@example.com",
    phone: "0900000000",
    passwordHash,
    role: "ADMIN",
    address: "GuGuGaGa HQ",
    createdAt: now,
    updatedAt: now,
  });

  // Create customer
  const customerRef = await db.collection("users").add({
    name: "Nguyen Van A",
    email: "a@example.com",
    phone: "0912345671",
    passwordHash,
    role: "CUSTOMER",
    address: "123 duong ABC",
    createdAt: now,
    updatedAt: now,
  });

  // Create branch
  const branchRef = await db.collection("branches").add({
    name: "Chi nhánh Đà Nẵng",
    phone: "02811112222",
    address: "470 Trần Đại Nghĩa, Hòa Quý, Ngũ Hành Sơn, Đà Nẵng",
    latitude: 15.9753,
    longitude: 108.2524,
    createdAt: now,
    updatedAt: now,
  });

  // 30 classes matching the AI model (and their corresponding mock display names/prices)
  const categoriesToSeed = [
    { name: "Bánh Bèo", productName: "Bánh Bèo Chén Miền Trung", price: 30000, desc: "Bánh bèo chén dẻo thơm, nhân tôm chấy đậm vị" },
    { name: "Bánh Bột Lọc", productName: "Bánh Bột Lọc Trần Nhân Tôm Thịt", price: 35000, desc: "Bánh bột lọc dẻo trong suốt, tôm thịt thơm ngon" },
    { name: "Bánh Căn", productName: "Bánh Căn Trứng Cút", price: 40000, desc: "Bánh căn nóng hổi kèm nước chấm xíu mại" },
    { name: "Bánh Canh", productName: "Bánh Canh Cua Bột Gạo", price: 50000, desc: "Bánh canh cua nước sệt ngọt thanh hấp dẫn" },
    { name: "Bánh Chưng", productName: "Bánh Chưng Đậu Xanh Thịt Mỡ", price: 60000, desc: "Bánh chưng truyền thống dẻo ngon chuẩn vị" },
    { name: "Bánh Cuốn", productName: "Bánh Cuốn Nóng Thịt Mộc Nhĩ", price: 30000, desc: "Bánh cuốn tráng mỏng kèm chả lụa thơm lừng" },
    { name: "Bánh Đúc", productName: "Bánh Đúc Nóng Hà Nội", price: 25000, desc: "Bánh đúc nóng kèm thịt băm, mộc nhĩ, hành phi" },
    { name: "Bánh Giò", productName: "Bánh Giò Nóng Nhân Thịt Trứng Cút", price: 20000, desc: "Bánh giò nóng hổi dẻo thơm ngậy béo" },
    { name: "Bánh Khọt", productName: "Bánh Khọt Vũng Tàu Tôm Tươi", price: 45000, desc: "Bánh khọt giòn rụm với tôm tươi thơm ngậy" },
    { name: "Bánh Mì", productName: "Bánh Mì Thịt Nướng Đặc Biệt", price: 25000, desc: "Bánh mì giòn rụm nhân thịt nướng đậm đà" },
    { name: "Bánh Pía", productName: "Bánh Pía Sầu Riêng Trứng Muối", price: 15000, desc: "Bánh pía Sóc Trăng thơm ngậy sầu riêng" },
    { name: "Bánh Tét", productName: "Bánh Tét Nhân Thịt Mỡ Đậu Xanh", price: 55000, desc: "Bánh tét truyền thống thơm dẻo" },
    { name: "Bánh Tráng Nướng", productName: "Bánh Tráng Nướng Đà Lạt Mỡ Hành", price: 20000, desc: "Bánh tráng nướng giòn rụm đầy đủ topping" },
    { name: "Bánh Xèo", productName: "Bánh Xèo Nam Bộ Tôm Thịt", price: 50000, desc: "Bánh xèo giòn tan thơm nước cốt dừa" },
    { name: "Bún Bò Huế", productName: "Bún Bò Huế Đặc Biệt Giò Chả", price: 55000, desc: "Bún bò huế chuẩn vị nước dùng đậm đà" },
    { name: "Bún Đậu Mắm Tôm", productName: "Mẹt Bún Đậu Mắm Tôm Đầy Đủ", price: 65000, desc: "Bún đậu với thịt luộc, chả cốm, mắm tôm pha ngon" },
    { name: "Bún Mắm", productName: "Bún Mắm Miền Tây Sạch Sẽ", price: 60000, desc: "Bún mắm đậm đà tôm, mực, heo quay ngon tuyệt" },
    { name: "Bún Riêu", productName: "Bún Riêu Cua Sườn Sụn", price: 45000, desc: "Bún riêu cua thanh mát thơm ngon" },
    { name: "Bún Thịt Nướng", productName: "Bún Thịt Nướng Chả Giò", price: 45000, desc: "Bún thịt nướng thơm lừng kèm chả giò giòn rụm" },
    { name: "Cá Kho Tộ", productName: "Cơm Cá Kho Tộ Đậm Đà", price: 55000, desc: "Cá lóc kho tộ nước sốt sệt cay ăn cùng cơm nóng" },
    { name: "Canh Chua", productName: "Cơm Canh Chua Cá Hồi", price: 60000, desc: "Canh chua cá hồi thanh mát chuẩn vị cơm nhà" },
    { name: "Cao Lầu", productName: "Cao Lầu Hội An Thịt Xá Xíu", price: 50000, desc: "Cao lầu Hội An dai giòn thơm ngon đậm đà" },
    { name: "Cháo Lòng", productName: "Cháo Lòng Nóng Hổi Đầy Đủ", price: 35000, desc: "Cháo lòng thơm ngon bổ dưỡng kèm đĩa lòng thập cẩm" },
    { name: "Cơm Tấm", productName: "Cơm Tấm Sườn Bì Chả Trứng", price: 45000, desc: "Cơm tấm sườn nướng thơm lừng chuẩn vị Sài Gòn" },
    { name: "Gỏi Cuốn", productName: "Gỏi Cuốn Tôm Thịt Nước Tương", price: 10000, desc: "Gỏi cuốn thanh mát nhiều tôm thịt" },
    { name: "Hủ Tiếu", productName: "Hủ Tiếu Nam Vang Khô/Nước", price: 55000, desc: "Hủ tiếu Nam Vang nước dùng ngọt thanh xương ống" },
    { name: "Mỳ Quảng", productName: "Mỳ Quảng Tôm Thịt Trứng Cút", price: 40000, desc: "Mỳ quảng đậm đà chuẩn vị miền Trung" },
    { name: "Nem Chua", productName: "Nem Chua Rán Ngon Giòn", price: 30000, desc: "Đĩa nem chua rán nóng hổi thơm ngon ăn vặt" },
    { name: "Phở", productName: "Phở Bò Tái Nạm Gầu Cực Chất", price: 65000, desc: "Phở bò truyền thống nước dùng hầm xương trong 24h" },
    { name: "Xôi Xéo", productName: "Xôi Xéo Ruốc Hành Phi Mỡ Gà", price: 20000, desc: "Xôi xéo dẻo thơm hành phi vàng ruộm ngậy béo" }
  ];

  let productRef = null;

  for (const cat of categoriesToSeed) {
    const catRef = await db.collection("categories").add({ name: cat.name });
    const prodRef = await db.collection("products").add({
      categoryId: catRef.id,
      name: cat.productName,
      price: cat.price,
      desc: cat.desc,
      image: PRODUCT_IMAGES[cat.productName] ?? null,
      createdAt: now,
      updatedAt: now
    });
    if (!productRef) {
      productRef = prodRef;
    }
  }

  // Create driver
  const driverRef = await db.collection("drivers").add({
    branchId: branchRef.id,
    name: "Tai xe Minh",
    phone: "0911111111",
    passwordHash,
    status: "AVAILABLE",
    latitude: null,
    longitude: null,
    createdAt: now,
    updatedAt: now,
  });

  // Thêm vài tài xế nữa để mỗi người thử dùng một tài khoản (mật khẩu 123456)
  for (const d of [
    { name: "Tai xe Lan", phone: "0911111112" },
    { name: "Tai xe Hung", phone: "0911111113" },
    { name: "Tai xe Mai", phone: "0911111114" },
  ]) {
    await db.collection("drivers").add({
      branchId: branchRef.id, name: d.name, phone: d.phone, passwordHash,
      status: "AVAILABLE", latitude: null, longitude: null, createdAt: now, updatedAt: now,
    });
  }

  // Create cart
  const cartRef = await db.collection("carts").add({
    userId: customerRef.id,
    branchId: branchRef.id,
    totalAmount: 70000,
    createdAt: now,
    updatedAt: now,
  });

  // Create cart item (sub-collection)
  await cartRef.collection("cartItems").add({
    productId: productRef.id,
    comboId: null,
    quantity: 1,
    price: 70000,
  });

  // Create order
  const orderRef = await db.collection("orders").add({
    userId: customerRef.id,
    branchId: branchRef.id,
    driverId: driverRef.id,
    totalAmount: 70000,
    status: "DRIVER_ASSIGNED",
    paymentMethod: "COD",
    deliveryAddress: "123 duong ABC",
    deliveryPhone: "0912345671",
    latitude: null,
    longitude: null,
    createdAt: now,
    updatedAt: now,
  });

  // Create order item (sub-collection)
  await orderRef.collection("orderItems").add({
    productId: productRef.id,
    comboId: null,
    quantity: 1,
    price: 70000,
  });

  // Create bill
  const billRef = await db.collection("bills").add({
    userId: customerRef.id,
    branchId: branchRef.id,
    totalPrice: 70000,
    createdAt: now,
    updatedAt: now,
  });

  // Create bill item (sub-collection)
  await billRef.collection("billItems").add({
    productId: productRef.id,
    quantity: 1,
    price: 70000,
  });

  console.log("Seed done!", {
    adminEmail: "admin@example.com",
    adminPassword: "123456",
    customerEmail: "a@example.com",
    customerPassword: "123456",
    driverPhone: "0911111111",
    driverPassword: "123456",
  });
}

main()
  .catch((error) => {
    console.error("SEED ERROR:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
