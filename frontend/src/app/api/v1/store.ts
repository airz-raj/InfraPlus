export type Interaction = {
  id: number;
  media_type: string;
  raw_intent: string;
  category: string;
  severity: number;
  status: string;
  lng: number;
  lat: number;
  location?: string;
  urgency?: string;
  tags?: string[];
};

export type Project = {
  id: number;
  title: string;
  category: string;
  budget: number;
  description?: string;
  lng: number;
  lat: number;
};

class DataStore {
  public interactions: Interaction[] = [];
  public projects: Project[] = [];
  public interactionSeq = 1;
  public projectSeq = 1;

  constructor() {
    this.seed();
  }

  seed() {
    if (this.projects.length > 0) return;

    this.projects.push({ id: this.projectSeq++, title: "Delhi Water Grid Upgrade", category: "water", budget: 5000000, lng: 77.209, lat: 28.6139 });
    this.projects.push({ id: this.projectSeq++, title: "Mumbai Solar Array", category: "electricity", budget: 12000000, lng: 72.8777, lat: 19.0760 });
    this.projects.push({ id: this.projectSeq++, title: "Bangalore Metro Extension", category: "transport", budget: 45000000, lng: 77.5946, lat: 12.9716 });
    this.projects.push({ id: this.projectSeq++, title: "Chennai Port Road Repair", category: "roads", budget: 2000000, lng: 80.2707, lat: 13.0827 });

    const centers = [
      [77.209, 28.6139],
      [72.8777, 19.0760],
      [77.5946, 12.9716],
      [80.2707, 13.0827],
      [88.3639, 22.5726]
    ];
    const categories = ["water", "electricity", "roads", "transport", "sanitation"];
    const statuses = ["PENDING", "PROCESSED", "REVIEW_REQUIRED"];

    for (let i = 0; i < 80; i++) {
      const center = centers[Math.floor(Math.random() * centers.length)];
      const lng = center[0] + (Math.random() * 0.2 - 0.1);
      const lat = center[1] + (Math.random() * 0.2 - 0.1);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const severity = Math.floor(Math.random() * 5) + 1;
      const status = severity >= 4 ? "PENDING" : statuses[Math.floor(Math.random() * statuses.length)];

      this.interactions.push({
        id: this.interactionSeq++,
        media_type: "text",
        raw_intent: `Generated complaint regarding ${category}`,
        category,
        severity,
        status,
        lng,
        lat
      });
    }
  }

  addInteraction(data: Partial<Interaction>) {
    const item = {
      id: this.interactionSeq++,
      media_type: data.media_type || "text",
      raw_intent: data.raw_intent || "",
      category: data.category || "unknown",
      severity: data.severity || 1,
      status: data.status || "PENDING",
      lng: data.lng || 0,
      lat: data.lat || 0,
      location: data.location,
      urgency: data.urgency,
      tags: data.tags,
    };
    this.interactions.push(item);
    return item;
  }
}

// Global instance to persist in memory during dev
const globalForStore = global as unknown as { store: DataStore };
export const store = globalForStore.store || new DataStore();
if (process.env.NODE_ENV !== "production") globalForStore.store = store;
