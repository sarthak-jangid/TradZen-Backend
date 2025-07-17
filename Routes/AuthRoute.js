const { Signup, Login, Logout } = require("../Controllers/AuthController");
const cors = require("cors");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.use(
  cors({
    origin: ["trad-zen-frontend.vercel.app", "trad-zen-dashboard.vercel.app"], //  allow both ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/userVerification", userVerification); 
router.get("/logout", Logout);

module.exports = router;
