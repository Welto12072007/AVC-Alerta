import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get all educational content
router.get('/content', async (req: Request, res: Response) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;

    let query = supabase
      .from('educational_content')
      .select('*')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: 'Erro ao buscar conteúdo educacional' });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Erro ao buscar conteúdo:', error);
    res.status(500).json({ error: 'Erro ao buscar conteúdo educacional' });
  }
});

// Get specific educational content
router.get('/content/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('educational_content')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Conteúdo não encontrado' });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Erro ao buscar conteúdo:', error);
    res.status(500).json({ error: 'Erro ao buscar conteúdo' });
  }
});

// Get content categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('educational_content')
      .select('category')
      .not('category', 'is', null);

    if (error) {
      return res.status(400).json({ error: 'Erro ao buscar categorias' });
    }

    // Get unique categories
    const uniqueCategories = [...new Set(data.map((item: any) => item.category))];

    res.json({ categories: uniqueCategories });
  } catch (error: any) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Search educational content
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Parâmetro de busca obrigatório' });
    }

    const searchTerm = `%${q}%`;

    const { data, error } = await supabase
      .from('educational_content')
      .select('*')
      .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
      .limit(Number(limit));

    if (error) {
      return res.status(400).json({ error: 'Erro ao buscar conteúdo' });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Erro ao buscar conteúdo:', error);
    res.status(500).json({ error: 'Erro ao buscar conteúdo' });
  }
});

export default router;
