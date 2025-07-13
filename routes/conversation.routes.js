const express = require("express");
const router = express.Router();
const controller = require("../controllers/conversation.controller");
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware")

router.use(auth);
router.get("/", controller.getAllConversations);
router.post("/", authorize("admin", "modérateur"), controller.createConversation);
router.put("/:id", authorize("admin", "modérateur"), controller.renameConversation);
router.delete("/:id", authorize("admin"), controller.deleteConversation);

module.exports = router;
