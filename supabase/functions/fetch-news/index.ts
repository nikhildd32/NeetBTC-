import Parser from 'npm:rss-parser@3.13.0';

const RSS_FEEDS = [
  'https://cointelegraph.com/rss/tag/bitcoin',
  'https://bitcoinmagazine.com/.rss/full/',
  'https://news.bitcoin.com/feed/'
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractImageFromContent(content: string): string | undefined {
  if (!content) return undefined;
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const parser = new Parser({
      headers: {
        'User-Agent': 'NeetBTC-News-Aggregator/1.0'
      }
    });
    
    // Fetch news from multiple RSS feeds in parallel
    const feedPromises = RSS_FEEDS.map(feed => parser.parseURL(feed));
    const feeds = await Promise.all(feedPromises);
    
    // Combine and format all items
    const news = feeds.flatMap(feed => 
      feed.items.map(item => ({
        id: item.guid || item.link,
        title: item.title,
        summary: item.contentSnippet || item.description?.slice(0, 200) || '',
        source: feed.title,
        url: item.link,
        publishedAt: item.pubDate || item.isoDate,
        imageUrl: item.enclosure?.url || extractImageFromContent(item.content)
      }))
    );
    
    // Sort by date, newest first and limit to 10 articles
    const sortedNews = news
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 10); // Return only latest 10 articles

    return new Response(
      JSON.stringify(sortedNews),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch news' }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  }
});