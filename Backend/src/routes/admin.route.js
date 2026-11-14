import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.midlleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { uploadImageProduct, uploadImageCombo } from "../controllers/upload.controller.js";
import routerAuth from "./admin/admin-auth.route.js";
import routerBranch from "./admin/branch.route.js";
import routerCategory from "./admin/category.route.js";
import routerCombo from "./admin/combo.route.js";
import routerDashboard from "./admin/dashboard.route.js";
import routerDriver from "./admin/driver.route.js";
import routerOrder from "./admin/order.route.js";
import routerProduct from "./admin/product.route.js";
import routerUsers from "./admin/user.route.js";

const routerAdmin = express.Router();

// Đăng nhập admin (public); /auth/me tự gắn protectRoute
routerAdmin.use("/auth", routerAuth);

// Mọi route quản trị còn lại: bắt buộc đăng nhập và role ADMIN
const adminOnly = [protectRoute, checkRole("ADMIN")];

routerAdmin.use("/branches", adminOnly, routerBranch);
routerAdmin.use("/categories", adminOnly, routerCategory);
routerAdmin.use("/combos", adminOnly, routerCombo);
routerAdmin.use("/dashboard", adminOnly, routerDashboard);
routerAdmin.use("/drivers", adminOnly, routerDriver);
routerAdmin.use("/orders", adminOnly, routerOrder);
routerAdmin.use("/products", adminOnly, routerProduct);
routerAdmin.use("/users", adminOnly, routerUsers);

routerAdmin.post("/upload/product", adminOnly, upload.single("image"), uploadImageProduct);
routerAdmin.post("/upload/combo", adminOnly, upload.single("image"), uploadImageCombo);

export default routerAdmin;
