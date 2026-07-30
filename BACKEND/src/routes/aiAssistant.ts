import { Router, Request, Response } from 'express';
import { aiAssistantService, UserRole, Language } from '../services/aiAssistantService';
import { ragKnowledgeService } from '../services/ragKnowledgeService';

const router = Router();

// POST /api/ai-assistant/chat
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, role = 'WATER_OFFICER', language = 'en' } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const response = await aiAssistantService.processUserMessage(message, role as UserRole, language as Language);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process AI assistant message', details: error.message });
  }
});

// POST /api/ai-assistant/simulate
router.post('/simulate', async (req: Request, res: Response) => {
  try {
    const {
      populationChangePct = 20,
      rainfallChangePct = -30,
      reservoirLossPct = -40,
      industrialDemandPct = 100
    } = req.body;

    const result = await aiAssistantService.runScenarioSimulation({
      populationChangePct: Number(populationChangePct),
      rainfallChangePct: Number(rainfallChangePct),
      reservoirLossPct: Number(reservoirLossPct),
      industrialDemandPct: Number(industrialDemandPct)
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to run scenario simulation', details: error.message });
  }
});

// POST /api/ai-assistant/report/export
router.post('/report/export', async (req: Request, res: Response) => {
  try {
    const context = await aiAssistantService.getLiveContext();
    const sustainability = aiAssistantService.calculateSustainability();

    const reportPayload = {
      title: 'AquaSense AI Enterprise Water Intelligence Report',
      generatedAt: new Date().toISOString(),
      summary: context.summary,
      sustainability,
      reservoirs: context.reservoirs,
      activeLeaks: context.activeLeaks,
      recommendations: context.recommendations
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="AquaSense_Executive_Report.json"');
    res.send(JSON.stringify(reportPayload, null, 2));
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to export report', details: error.message });
  }
});

// GET /api/ai-assistant/knowledge-search?q=query
router.get('/knowledge-search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string || '';
    const docs = ragKnowledgeService.searchVectorKnowledge(query, 5);
    res.json(docs);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to search knowledge base', details: error.message });
  }
});

// POST /api/ai-assistant/feedback
router.post('/feedback', async (req: Request, res: Response) => {
  try {
    const { messageId, rating, comment } = req.body;
    if (!messageId || !rating) {
      return res.status(400).json({ error: 'messageId and rating (UP/DOWN) are required' });
    }

    const entry = ragKnowledgeService.ingestFeedback({ messageId, rating, comment });
    res.json({ success: true, feedback: entry });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to submit feedback', details: error.message });
  }
});

// POST /api/ai-assistant/knowledge/ingest
router.post('/knowledge/ingest', async (req: Request, res: Response) => {
  try {
    const { title, category, content, source } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Document title and content are required' });
    }

    const chunk = ragKnowledgeService.ingestDocument({ title, category, content, source });
    res.json({ success: true, chunk, stats: ragKnowledgeService.getStats() });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to ingest knowledge document', details: error.message });
  }
});

// GET /api/ai-assistant/knowledge/stats
router.get('/knowledge/stats', async (req: Request, res: Response) => {
  try {
    const stats = ragKnowledgeService.getStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve knowledge stats', details: error.message });
  }
});

// POST /api/ai-assistant/command (Autonomous Function Calling)
router.post('/command', async (req: Request, res: Response) => {
  try {
    const { command, payload = {} } = req.body;
    if (!command) {
      return res.status(400).json({ error: 'Command type is required' });
    }

    if (command === 'CREATE_ALERT') {
      const alert = await aiAssistantService.executeAlertCreation(payload);
      return res.json({ success: true, command, result: alert, message: `Created ${alert.severity} alert at ${alert.location}` });
    } else if (command === 'ASSIGN_ENGINEER') {
      const assignment = await aiAssistantService.executeEngineerAssignment(payload);
      return res.json({ success: true, command, result: assignment, message: `Dispatched ${assignment.engineerName} to ${assignment.location}` });
    } else if (command === 'COMPARE_RESERVOIRS') {
      const comparison = await aiAssistantService.executeReservoirComparison();
      return res.json({ success: true, command, result: comparison });
    } else if (command === 'EXPORT_CSV') {
      const csv = await aiAssistantService.generateTelemetryCSV();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="AquaSense_Telemetry.csv"');
      return res.send(csv);
    } else {
      return res.status(400).json({ error: `Unknown command type: ${command}` });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to execute AI command function', details: error.message });
  }
});

export default router;
