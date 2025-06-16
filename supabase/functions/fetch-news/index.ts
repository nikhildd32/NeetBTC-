/*
  # News Fetching Edge Function

  1. Purpose
    - Fetches latest Bitcoin news from multiple sources
    - Provides a unified API for the frontend to consume news data
    - Handles CORS and authentication

  2. Features
    - Mock news data for demonstration (can be extended with real APIs)
    - CORS support for frontend requests
    - Error handling and response formatting
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  description: string;
  source: string;
  url: string;
  link: string;
  publishedAt: string;
  imageUrl?: string;
}

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Generate mock Bitcoin news data
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: "Bitcoin Network Hashrate Reaches New All-Time High",
        summary: "The Bitcoin network's computational power has reached unprecedented levels, demonstrating the growing security and decentralization of the network.",
        description: "The Bitcoin network's computational power has reached unprecedented levels, demonstrating the growing security and decentralization of the network.",
        source: "Bitcoin Magazine",
        url: "https://bitcoinmagazine.com",
        link: "https://bitcoinmagazine.com",
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: "2",
        title: "Lightning Network Adoption Accelerates Globally",
        summary: "Major payment processors and exchanges are integrating Lightning Network support, enabling faster and cheaper Bitcoin transactions worldwide.",
        description: "Major payment processors and exchanges are integrating Lightning Network support, enabling faster and cheaper Bitcoin transactions worldwide.",
        source: "CoinTelegraph",
        url: "https://cointelegraph.com",
        link: "https://cointelegraph.com",
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: "3",
        title: "Bitcoin Mining Sustainability Report Shows Renewable Energy Growth",
        summary: "Latest industry report reveals significant increase in renewable energy usage among Bitcoin mining operations, addressing environmental concerns.",
        description: "Latest industry report reveals significant increase in renewable energy usage among Bitcoin mining operations, addressing environmental concerns.",
        source: "Bitcoin News",
        url: "https://news.bitcoin.com",
        link: "https://news.bitcoin.com",
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: "4",
        title: "Institutional Bitcoin Holdings Reach Record Levels",
        summary: "Corporate treasuries and investment funds continue to allocate significant portions of their portfolios to Bitcoin as a hedge against inflation.",
        description: "Corporate treasuries and investment funds continue to allocate significant portions of their portfolios to Bitcoin as a hedge against inflation.",
        source: "Bitcoin Magazine",
        url: "https://bitcoinmagazine.com",
        link: "https://bitcoinmagazine.com",
        publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: "5",
        title: "Bitcoin ETF Trading Volume Surges to New Heights",
        summary: "Spot Bitcoin ETFs see unprecedented trading activity as institutional and retail investors increase their exposure to digital assets.",
        description: "Spot Bitcoin ETFs see unprecedented trading activity as institutional and retail investors increase their exposure to digital assets.",
        source: "CoinDesk",
        url: "https://coindesk.com",
        link: "https://coindesk.com",
        publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: "6",
        title: "Bitcoin Core Developers Release Security Update",
        summary: "The latest Bitcoin Core update includes important security enhancements and performance improvements for node operators.",
        description: "The latest Bitcoin Core update includes important security enhancements and performance improvements for node operators.",
        source: "Bitcoin Core",
        url: "https://bitcoincore.org",
        link: "https://bitcoincore.org",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: "7",
        title: "Central Bank Digital Currencies vs Bitcoin: The Debate Continues",
        summary: "As more countries explore CBDCs, experts discuss the fundamental differences between government-issued digital currencies and Bitcoin.",
        description: "As more countries explore CBDCs, experts discuss the fundamental differences between government-issued digital currencies and Bitcoin.",
        source: "Decrypt",
        url: "https://decrypt.co",
        link: "https://decrypt.co",
        publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/8369769/pexels-photo-8369769.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: "8",
        title: "Bitcoin Layer 2 Solutions Show Promising Development",
        summary: "New scaling solutions built on top of Bitcoin are demonstrating innovative approaches to increase transaction throughput and reduce fees.",
        description: "New scaling solutions built on top of Bitcoin are demonstrating innovative approaches to increase transaction throughput and reduce fees.",
        source: "The Block",
        url: "https://theblock.co",
        link: "https://theblock.co",
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/7567526/pexels-photo-7567526.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    ];

    // Shuffle the news array to provide variety on each request
    const shuffledNews = mockNews.sort(() => Math.random() - 0.5);

    return new Response(
      JSON.stringify(shuffledNews),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in fetch-news function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch news data',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        status: 500,
      }
    );
  }
});