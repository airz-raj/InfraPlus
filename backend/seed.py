import asyncio
import random
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from core.config import settings
from models.schema import Base, Interaction, InfrastructureProject, InteractionStatus, User

engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def seed_database():
    print("Seeding database...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        result = await session.execute("SELECT COUNT(id) FROM interactions")
        count = result.scalar()
        if count and count > 0:
            print("Database already seeded. Skipping.")
            return

        print("Generating mock projects and complaints...")
        # Projects
        projects = [
            InfrastructureProject(title="Delhi Water Grid Upgrade", category="water", budget=5000000, location="SRID=4326;POINT(77.209 28.6139)"),
            InfrastructureProject(title="Mumbai Solar Array", category="electricity", budget=12000000, location="SRID=4326;POINT(72.8777 19.0760)"),
            InfrastructureProject(title="Bangalore Metro Extension", category="transport", budget=45000000, location="SRID=4326;POINT(77.5946 12.9716)"),
            InfrastructureProject(title="Chennai Port Road Repair", category="roads", budget=2000000, location="SRID=4326;POINT(80.2707 13.0827)")
        ]
        session.add_all(projects)

        # Complaints
        categories = ["water", "electricity", "roads", "transport", "sanitation"]
        statuses = [InteractionStatus.PENDING, InteractionStatus.PROCESSED, InteractionStatus.REVIEW_REQUIRED]
        
        # Center around major Indian cities + random noise
        centers = [
            (77.209, 28.6139), # Delhi
            (72.8777, 19.0760), # Mumbai
            (77.5946, 12.9716), # Bangalore
            (80.2707, 13.0827), # Chennai
            (88.3639, 22.5726)  # Kolkata
        ]

        interactions = []
        for _ in range(80):
            center = random.choice(centers)
            lng = center[0] + random.uniform(-0.1, 0.1)
            lat = center[1] + random.uniform(-0.1, 0.1)
            
            category = random.choice(categories)
            severity = random.randint(1, 5)
            # Higher severity more likely to be pending
            status = InteractionStatus.PENDING if severity >= 4 else random.choice(statuses)

            interactions.append(
                Interaction(
                    media_type="text",
                    raw_intent=f"Generated complaint regarding {category}",
                    category=category,
                    severity=severity,
                    status=status,
                    location=f"SRID=4326;POINT({lng} {lat})"
                )
            )

        session.add_all(interactions)
        await session.commit()
        print(f"Successfully seeded 4 projects and 80 complaints.")

if __name__ == "__main__":
    asyncio.run(seed_database())
