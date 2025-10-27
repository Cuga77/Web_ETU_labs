import { Router } from 'express';
const router = Router();

router.get('/', function (_, res) {
    res.redirect("/users/all");
});

export default router;
