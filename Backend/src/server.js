import app from "./app.js";
import { startAutoAccept } from "./services/autoaccept.service.js";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
startAutoAccept();
