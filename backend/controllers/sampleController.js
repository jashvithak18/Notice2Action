import { SAMPLE_NOTICES } from '../data/sampleNotices.js';

export function getSamples(req, res) {
  const samples = Object.values(SAMPLE_NOTICES).map(({ id, label }) => ({
    id,
    label,
  }));
  res.json(samples);
}

export function getSampleText(req, res) {
  const sample = SAMPLE_NOTICES[req.params.id];
  if (!sample) {
    return res.status(404).json({ error: 'Sample not found.' });
  }
  res.json({ id: sample.id, label: sample.label, text: sample.text });
}
