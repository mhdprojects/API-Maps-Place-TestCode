import { Router } from 'express';
import { searchPlaces } from '../controller/places-controller.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true }));
router.post('/places/search', searchPlaces);

export default router;
