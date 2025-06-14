import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to extract meta content
const getMetaContent = ($, name) => {
  const element = $(`meta[name="${name}"]`).attr('content') || 
                 $(`meta[property="${name}"]`).attr('content');
  return element || null;
};

// Route to analyze URL
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch the HTML content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tag-Inspector/1.0)'
      }
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract basic SEO tags
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    const robots = $('meta[name="robots"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    
    // Extract OpenGraph tags
    const ogTitle = getMetaContent($, 'og:title');
    const ogDescription = getMetaContent($, 'og:description');
    const ogImage = getMetaContent($, 'og:image');
    const ogType = getMetaContent($, 'og:type');
    const ogUrl = getMetaContent($, 'og:url');
    
    // Extract Twitter Card tags
    const twitterCard = getMetaContent($, 'twitter:card');
    const twitterTitle = getMetaContent($, 'twitter:title');
    const twitterDescription = getMetaContent($, 'twitter:description');
    const twitterImage = getMetaContent($, 'twitter:image');
    
    // Calculate SEO score (simplified version)
    let score = 0;
    const maxScore = 100;
    const results = [];
    
    // Check title
    if (title) {
      score += 20;
      results.push({ tag: 'title', status: 'present', value: title });
    } else {
      results.push({ tag: 'title', status: 'missing', value: null });
    }
    
    // Check description
    if (description) {
      score += 20;
      results.push({ tag: 'description', status: 'present', value: description });
    } else {
      results.push({ tag: 'description', status: 'missing', value: null });
    }
    
    // Check robots
    if (robots) {
      score += 10;
      results.push({ tag: 'robots', status: 'present', value: robots });
    } else {
      score += 5; // Partial points for not having it
      results.push({ tag: 'robots', status: 'warning', value: 'No robots meta tag found' });
    }
    
    // Check canonical
    if (canonical) {
      score += 10;
      results.push({ tag: 'canonical', status: 'present', value: canonical });
    } else {
      results.push({ tag: 'canonical', status: 'warning', value: 'No canonical URL found' });
    }
    
    // Check OpenGraph
    const ogTags = [
      { name: 'og:title', value: ogTitle },
      { name: 'og:description', value: ogDescription },
      { name: 'og:image', value: ogImage },
      { name: 'og:type', value: ogType },
      { name: 'og:url', value: ogUrl }
    ];
    
    ogTags.forEach(tag => {
      if (tag.value) {
        score += 2; // 2 points per present OG tag
        results.push({ tag: tag.name, status: 'present', value: tag.value });
      } else {
        results.push({ tag: tag.name, status: 'missing', value: null });
      }
    });
    
    // Check Twitter Cards
    const twitterTags = [
      { name: 'twitter:card', value: twitterCard },
      { name: 'twitter:title', value: twitterTitle },
      { name: 'twitter:description', value: twitterDescription },
      { name: 'twitter:image', value: twitterImage }
    ];
    
    twitterTags.forEach(tag => {
      if (tag.value) {
        score += 2; // 2 points per present Twitter tag
        results.push({ tag: tag.name, status: 'present', value: tag.value });
      } else {
        results.push({ tag: tag.name, status: 'missing', value: null });
      }
    });
    
    // Ensure score doesn't exceed max
    score = Math.min(score, maxScore);
    
    res.json({
      url,
      score,
      maxScore,
      results,
      preview: {
        title: ogTitle || title,
        description: ogDescription || description,
        image: ogImage || twitterImage
      }
    });
    
  } catch (error) {
    console.error('Error analyzing URL:', error);
    
    let errorMessage = 'Failed to analyze URL';
    let statusCode = 500;
    
    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      errorMessage = 'Could not resolve the provided URL. Please check if the URL is correct and try again.';
      statusCode = 400;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused. The server might be down or the URL might be incorrect.';
      statusCode = 502;
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = `The server responded with status ${error.response.status}`;
      statusCode = error.response.status;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from the server. Please check the URL and try again.';
      statusCode = 504;
    } else if (error.message.includes('Invalid URL')) {
      errorMessage = 'The provided URL is not valid. Please check the URL and try again.';
      statusCode = 400;
    } else if (error.message.includes('timeout')) {
      errorMessage = 'The request timed out. Please try again later.';
      statusCode = 504;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
