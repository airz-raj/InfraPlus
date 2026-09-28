import random
from core.store import db_store, InteractionStatus

def seed_database():
    print("Seeding in-memory database...")
    
    if len(db_store.interactions) > 0:
        print("Database already seeded. Skipping.")
        return

    # Projects
    db_store.add_project({"title": "Delhi Water Grid Upgrade", "category": "water", "budget": 5000000, "lng": 77.209, "lat": 28.6139})
    db_store.add_project({"title": "Mumbai Solar Array", "category": "electricity", "budget": 12000000, "lng": 72.8777, "lat": 19.0760})
    db_store.add_project({"title": "Bangalore Metro Extension", "category": "transport", "budget": 45000000, "lng": 77.5946, "lat": 12.9716})
    db_store.add_project({"title": "Chennai Port Road Repair", "category": "roads", "budget": 2000000, "lng": 80.2707, "lat": 13.0827})

    # Complaints
    categories = ["water", "electricity", "roads", "transport", "sanitation"]
    statuses = [InteractionStatus.PENDING, InteractionStatus.PROCESSED, InteractionStatus.REVIEW_REQUIRED]
    
    centers = [
        (77.209, 28.6139), # Delhi
        (72.8777, 19.0760), # Mumbai
        (77.5946, 12.9716), # Bangalore
        (80.2707, 13.0827), # Chennai
        (88.3639, 22.5726)  # Kolkata
    ]

    for _ in range(80):
        center = random.choice(centers)
        lng = center[0] + random.uniform(-0.1, 0.1)
        lat = center[1] + random.uniform(-0.1, 0.1)
        
        category = random.choice(categories)
        severity = random.randint(1, 5)
        status = InteractionStatus.PENDING if severity >= 4 else random.choice(statuses)

        db_store.add_interaction({
            "media_type": "text",
            "raw_intent": f"Generated complaint regarding {category}",
            "category": category,
            "severity": severity,
            "status": status,
            "lng": lng,
            "lat": lat
        })

    print(f"Successfully seeded 4 projects and 80 complaints into memory.")

if __name__ == "__main__":
    seed_database()
