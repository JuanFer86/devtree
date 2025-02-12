import { Router } from "express";

const router = Router();

// Routing
router.get("/", (req, res) => {
  res.send("Hello World in express / typescript");
});

router.get("/aboutus", (req, res) => {
  res.send("about us / typescript");
});

router.get("/blog", (req, res) => {
  res.send("blog / typescript");
});

export default router;
