// app/api/evaluate/route.js
import { NextResponse } from 'next/server';
import { callGroq } from '@/lib/groq';
import {
  LAYER1_SYSTEM, LAYER1_USER,
  LAYER2_SYSTEM, LAYER2_USER,
  LAYER3_SYSTEM, LAYER3_USER,
  LAYER4_SYSTEM, LAYER4_USER,
} from '@/lib/prompts';

export async function POST(request) {
  try {
    const { taskType, rubric, submission } = await request.json();

    if (!taskType || !rubric || !submission) {
      return NextResponse.json(
        { error: 'taskType, rubric, and submission are required.' },
        { status: 400 }
      );
    }

    // ── LAYER 1: Score ──
    const l1Raw = await callGroq(LAYER1_SYSTEM, LAYER1_USER(taskType, rubric, submission));
    const layer1 = JSON.parse(l1Raw);

    // ── LAYER 2: Evidence ──
    const l2Raw = await callGroq(LAYER2_SYSTEM, LAYER2_USER(submission, l1Raw));
    const layer2 = JSON.parse(l2Raw);

    // ── LAYER 3: Counterfactuals ──
    const l3Raw = await callGroq(LAYER3_SYSTEM, LAYER3_USER(submission, rubric, l1Raw));
    const layer3 = JSON.parse(l3Raw);

    // ── LAYER 4: Misconceptions ──
    const l4Raw = await callGroq(LAYER4_SYSTEM, LAYER4_USER(submission, l2Raw, taskType));
    const layer4 = JSON.parse(l4Raw);

    return NextResponse.json({
      success: true,
      taskType,
      evaluation: { ...layer1, ...layer2, ...layer3, ...layer4 },
      layers: { layer1, layer2, layer3, layer4 }, // for debugging
    });

  } catch (error) {
    console.error('ClarifAI evaluation error:', error);
    return NextResponse.json(
      { error: 'Evaluation failed. Please try again.', detail: error.message },
      { status: 500 }
    );
  }
}
