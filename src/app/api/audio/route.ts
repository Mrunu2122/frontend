import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Types
interface AudioRequest {
  text: string;
  language: string;
  voice: string;
}

interface AudioDocument extends AudioRequest {
  url: string;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// Initialize MongoDB client and settings
const uri = process.env.MONGODB_URI;
const dbName = 'elevenlabs-clone';

// Simple in-memory cache for development
const mockAudios: Record<string, any> = {};

// Only use MongoDB if URI is provided
const useMongoDB = Boolean(uri);
let client: MongoClient | null = null;

// Initialize MongoDB client if URI is available
if (useMongoDB) {
  try {
    if (!uri) throw new Error('MONGODB_URI is not defined');
    client = new MongoClient(uri, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    console.log('MongoDB client initialized');
  } catch (error) {
    console.error('Failed to initialize MongoDB client:', error);
    client = null;
  }
}

// Log storage mode
console.log(`Using ${useMongoDB ? 'MongoDB' : 'in-memory'} storage`);

// Mock audio generation (replace with actual TTS service)
async function generateAudio(text: string, language: string, voice: string): Promise<string> {
  // In a real implementation, this would call an external TTS service
  // For now, we'll return a mock URL
  return `https://example.com/audio/${voice}-${language}-${Date.now()}.mp3`;
}

export async function POST(request: Request) {
  console.log('POST /api/audio - Starting request');
  
  try {
    const body: AudioRequest = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Validate request body
    if (!body.text || !body.language || !body.voice) {
      console.error('Missing required fields in request body');
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['text', 'language', 'voice'],
          received: Object.keys(body)
        },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Generate audio URL (mock implementation)
    console.log('Generating audio URL...');
    const audioUrl = await generateAudio(body.text, body.language, body.voice);
    
    // Create document to save
    const documentToInsert = {
      ...body,
      url: audioUrl,
      timestamp: new Date(),
      status: 'completed' as const,
    };
    
    let savedId: string;
    
    // Save to MongoDB if available, otherwise use in-memory
    if (useMongoDB && client) {
      try {
        // Create a new client instance for this operation
        const operationClient = new MongoClient(uri!);
        await operationClient.connect();
        const db = operationClient.db(dbName);
        const collection = db.collection<AudioDocument>('audios');
        const result = await collection.insertOne(documentToInsert);
        savedId = result.insertedId.toString();
        console.log('Saved to MongoDB with ID:', savedId);
        await operationClient.close();
      } catch (dbError) {
        console.error('Failed to save to MongoDB, falling back to in-memory:', dbError);
        // Fall through to in-memory storage
      }
    }
    
    // If MongoDB is not being used or failed, use in-memory
    if (!useMongoDB || !savedId) {
      savedId = Date.now().toString();
      mockAudios[savedId] = documentToInsert;
      console.log('Saved to in-memory storage with ID:', savedId);
    }

    return NextResponse.json({
      id: savedId,
      url: audioUrl,
      language: body.language,
      voice: body.voice,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in POST /api/audio:', error);
    
    // Return more detailed error information in development
    const errorMessage = process.env.NODE_ENV === 'development'
      ? error instanceof Error ? error.message : 'Unknown error occurred'
      : 'Failed to process audio request';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack : undefined })
      },
      { status: 500 }
    );
  }
}

import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  console.log('GET /api/audio - Starting request');
  
  try {
    const { searchParams } = new URL(request.url);
    const audioId = searchParams.get('id');
    
    console.log('Audio ID:', audioId);

    if (!audioId) {
      console.error('Missing audio ID parameter');
      return NextResponse.json(
        { error: 'Missing audio ID parameter' },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');
    console.log('Looking up audio with ID:', audioId);
    
    // Try to find in MongoDB first if available
    if (useMongoDB && uri) {
      const operationClient = new MongoClient(uri);
      try {
        await operationClient.connect();
        const db = operationClient.db(dbName);
        const collection = db.collection<AudioDocument>('audios');
        const objectId = new ObjectId(audioId);
        const audio = await collection.findOne({ _id: objectId });
        
        if (audio) {
          console.log('Found in MongoDB');
          await operationClient.close();
          return NextResponse.json({
            id: audio._id,
            url: audio.url,
            language: audio.language,
            voice: audio.voice,
            timestamp: audio.timestamp.toISOString(),
          });
        }
      } catch (dbError) {
        console.error('MongoDB lookup failed, falling back to in-memory:', dbError);
      } finally {
        try {
          await operationClient.close();
        } catch (e) {
          console.error('Error closing MongoDB connection:', e);
        }
      }
    }
    
    // Check in-memory storage
    const audio = mockAudios[audioId];
    if (audio) {
      console.log('Found in in-memory storage');
      return NextResponse.json({
        id: audioId,
        url: audio.url,
        language: audio.language,
        voice: audio.voice,
        timestamp: audio.timestamp.toISOString(),
      });
    }
    
    console.log('Audio not found');
    return NextResponse.json(
      { error: 'Audio not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error in GET /api/audio:', error);
    
    const errorMessage = process.env.NODE_ENV === 'development'
      ? error instanceof Error ? error.message : 'Unknown error occurred'
      : 'Failed to fetch audio';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error instanceof Error ? error.stack : undefined 
        })
      },
      { status: 500 }
    );
  } finally {
    try {
      console.log('Closing MongoDB connection...');
      await client.close();
      console.log('MongoDB connection closed');
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
}
