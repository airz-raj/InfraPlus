import { NextResponse } from "next/server";
import { store } from "../../store";

export async function GET() {
  const total = store.interactions.length || 50;
  const base = Math.floor(total / 2) + 20;

  // Simple hardcoded linear regression trend for demo
  const y_hist = [base, base + 7, base + 18];
  
  // Calculate slope manually: (y3 - y1) / (x3 - x1)
  const slope = (y_hist[2] - y_hist[0]) / 2;
  const intercept = y_hist[0] - slope;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const data = [];

  for (let i = 0; i < 6; i++) {
    const x = i + 1;
    const predicted = slope * x + intercept;
    data.push({
      month: months[i],
      actual: i < 3 ? y_hist[i] : null,
      predicted: Math.round(predicted * 10) / 10
    });
  }

  return NextResponse.json({ data });
}
