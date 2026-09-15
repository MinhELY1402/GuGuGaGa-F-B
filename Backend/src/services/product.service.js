// [WIP] Mock product service for early UI binding
const MOCK_PRODUCTS = [
  { id: "mock_1", name: "Phở Bò Tái Nạm", price: 45000, category: "Món Nước" },
  { id: "mock_2", name: "Cơm Sườn Nướng", price: 50000, category: "Cơm" }
];
export const getAllProducts = async () => MOCK_PRODUCTS;
