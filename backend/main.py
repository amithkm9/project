# main.py
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List, Optional
import os
from datetime import datetime
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv

# Try to load .env file from current directory
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path, verbose=True)

app = FastAPI(title="EduSign API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Environment variables with validation
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "edusign")

print(f"🔍 Environment check:")
print(f"   SUPABASE_URL: {'✓ Set' if SUPABASE_URL else '❌ Not set'}")
print(f"   SUPABASE_SERVICE_ROLE_KEY: {'✓ Set' if SUPABASE_SERVICE_ROLE_KEY else '❌ Not set'}")
print(f"   MONGODB_URL: {MONGODB_URL}")
print(f"   DATABASE_NAME: {DATABASE_NAME}")

# Initialize clients
supabase = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    try:
        from supabase import create_client, Client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        print("✅ Supabase client initialized successfully")
    except Exception as e:
        print(f"⚠️ Failed to initialize Supabase client: {e}")
        supabase = None
else:
    print("⚠️ Supabase credentials not found - some features will be limited")

# MongoDB setup
mongo_client = None
db = None
try:
    mongo_client = MongoClient(MONGODB_URL)
    # Test the connection
    mongo_client.admin.command('ping')
    db = mongo_client[DATABASE_NAME]
    print("✅ MongoDB connected successfully")
except Exception as e:
    print(f"⚠️ Failed to connect to MongoDB: {e}")

# Collections (only if MongoDB is available)
if db is not None:
    courses_collection = db.courses
    progress_collection = db.user_progress
else:
    courses_collection = None
    progress_collection = None

# Models
class Course(BaseModel):
    id: str
    title: str
    description: str
    thumbnail: str
    age_group: str
    difficulty: str
    duration: str
    lessons_count: int
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

class CourseResponse(BaseModel):
    courses: List[dict]
    age_group: str
    total_courses: int

# Authentication dependency (simplified for demo)
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        
        # For development, accept demo tokens
        if token in ["demo-token", "fallback"]:
            return "demo-user-id"
            
        # If Supabase is available, try to verify
        if supabase and token.startswith("eyJ"):
            try:
                user = supabase.auth.get_user(token)
                return user.user.id if user and user.user else "demo-user-id"
            except Exception as e:
                print(f"Supabase auth error: {e}")
                return "demo-user-id"
        
        # For development, accept any reasonable token
        if len(token) > 5:
            return f"user-{hash(token) % 10000}"
            
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Token verification error: {e}")
        return "demo-user-id"  # Fallback for development

# Helper functions
def get_age_group(age: int) -> str:
    """Determine age group based on age"""
    if 2 <= age <= 5:
        return "2-5"
    elif 6 <= age <= 10:
        return "6-10"
    elif 11 <= age <= 15:
        return "11-15"
    else:
        return "16+"

def get_sample_courses_by_age_group(age_group: str) -> List[dict]:
    """Get sample courses for the specified age group"""
    base_url = "https://images.unsplash.com"
    current_time = datetime.now().isoformat()
    
    courses_data = {
        "2-5": [
            {
                "id": "basic-hands-2-5",
                "title": "Basic Hand Shapes",
                "description": "Learn simple hand shapes and finger movements with fun games and colorful visuals.",
                "thumbnail": f"{base_url}/400x300/?baby,hands,learning",
                "age_group": "2-5",
                "difficulty": "Beginner",
                "duration": "15 min",
                "lessons_count": 8,
                "is_active": True,
                "created_at": current_time,
                "updated_at": current_time
            },
            {
                "id": "family-signs-2-5",
                "title": "Family Signs",
                "description": "Learn to sign family members like mommy, daddy, and grandma with interactive stories.",
                "thumbnail": f"{base_url}/400x300/?family,children,love",
                "age_group": "2-5",
                "difficulty": "Beginner",
                "duration": "20 min",
                "lessons_count": 12,
                "is_active": True,
                "created_at": current_time,
                "updated_at": current_time
            },
            {
                "id": "colors-shapes-2-5",
                "title": "Colors & Shapes",
                "description": "Discover signs for colors and basic shapes through playful activities.",
                "thumbnail": f"{base_url}/400x300/?colors,shapes,kids",
                "age_group": "2-5",
                "difficulty": "Beginner",
                "duration": "18 min",
                "lessons_count": 10,
                "is_active": True,
                "created_at": current_time,
                "updated_at": current_time
            }
        ],
        "6-10": [
            {
                "id": "school-vocab-6-10",
                "title": "School Vocabulary",
                "description": "Essential signs for school subjects, classroom items, and daily school activities.",
                "thumbnail": f"{base_url}/400x300/?school,children,classroom",
                "age_group": "6-10",
                "difficulty": "Beginner",
                "duration": "25 min",
                "lessons_count": 15,
                "is_active": True,
                "created_at": current_time,
                "updated_at": current_time
            },
            {
                "id": "animals-nature-6-10",
                "title": "Animals & Nature",
                "description": "Learn signs for farm animals, wild animals, and elements of nature.",
                "thumbnail": f"{base_url}/400x300/?animals,nature,wildlife",
                "age_group": "6-10",
                "difficulty": "Intermediate",
                "duration": "30 min",
                "lessons_count": 18,
                "is_active": True,
                "created_at": current_time,
                "updated_at": current_time
            },
            {
                "id": "sports-hobbies-6-10",
                "title": "Sports & Hobbies",
                "description": "Sign language for sports activities, games, and popular hobbies.",
                "thumbnail": f"{base_url}/400x300/?sports,games,children",
                "age_group": "6-10",
                "difficulty": "Intermediate",
                "duration": "28 min",
                "lessons_count": 16,
                "is_active": True,
                "created_at": current_time,
                "updated_at": current_time
            }
        ],
        "11-15": [
            {
                "id": "conversation-skills-11-15",
                "title": "Conversational Skills",
                "description": "Build fluency in everyday conversations and social interactions.",
                "thumbnail": f"{base_url}/400x300/?conversation,teenagers,communication",
                "age_group": "11-15",
                "difficulty": "Intermediate",
                "duration": "40 min",
                "lessons_count": 22,
                "is_active": True,
                "created_at": current_time,
                "updated_at": current_time
            },
            {
                "id": "advanced-grammar-11-15",
                "title": "Advanced Grammar",
                "description": "Master complex grammar structures and advanced ASL concepts.",
                "thumbnail": f"{base_url}/400x300/?study,grammar,learning",
                "age_group": "11-15",
                "difficulty": "Advanced",
                "duration": "45 min",
                "lessons_count": 25,
                "is_active": True,
                "created_at": current_time,
                "updated_at": current_time
            },
            {
                "id": "culture-community-11-15",
                "title": "Deaf Culture & Community",
                "description": "Learn about Deaf culture, history, and community values.",
                "thumbnail": f"{base_url}/400x300/?community,culture,diversity",
                "age_group": "11-15",
                "difficulty": "Intermediate",
                "duration": "35 min",
                "lessons_count": 20,
                "is_active": True,
                "created_at": current_time,
                "updated_at": current_time
            }
        ],
        "16+": [
            {
                "id": "professional-asl-16",
                "title": "Professional ASL",
                "description": "Advanced sign language for workplace and professional settings.",
                "thumbnail": f"{base_url}/400x300/?professional,workplace,communication",
                "age_group": "16+",
                "difficulty": "Advanced",
                "duration": "50 min",
                "lessons_count": 30,
                "is_active": True,
                "created_at": current_time,
                "updated_at": current_time
            },
            {
                "id": "interpreter-prep-16",
                "title": "Interpreter Preparation",
                "description": "Intensive training for aspiring ASL interpreters.",
                "thumbnail": f"{base_url}/400x300/?interpreter,professional,certification",
                "age_group": "16+",
                "difficulty": "Expert",
                "duration": "60 min",
                "lessons_count": 35,
                "is_active": True,
                "created_at": current_time,
                "updated_at": current_time
            }
        ]
    }
    
    return courses_data.get(age_group, [])

def create_sample_courses():
    """Create sample courses in MongoDB if they don't exist"""
    if courses_collection is None:
        print("⚠️ MongoDB not available, skipping sample course creation")
        return
        
    try:
        if courses_collection.count_documents({}) == 0:
            all_courses = []
            for age_group in ["2-5", "6-10", "11-15", "16+"]:
                courses = get_sample_courses_by_age_group(age_group)
                all_courses.extend(courses)
            
            if all_courses:
                courses_collection.insert_many(all_courses)
                print(f"✅ Created {len(all_courses)} sample courses in MongoDB")
        else:
            course_count = courses_collection.count_documents({})
            print(f"📚 Found {course_count} existing courses in MongoDB")
    except Exception as e:
        print(f"⚠️ Failed to create sample courses: {e}")

# API Routes
@app.on_event("startup")
async def startup_event():
    """Initialize database with sample data"""
    print("🚀 Starting EduSign API...")
    create_sample_courses()
    print("✅ EduSign API startup complete")

@app.get("/")
async def root():
    return {
        "message": "EduSign API is running!",
        "version": "1.0.0",
        "status": "healthy",
        "services": {
            "supabase": "connected" if supabase else "not configured",
            "mongodb": "connected" if mongo_client else "not connected"
        }
    }

@app.get("/courses", response_model=CourseResponse)
async def get_courses(
    age: int = Query(..., ge=2, le=120, description="User's age"),
    user_id: Optional[str] = Query(None, description="User ID to fetch progress"),
    current_user: str = Depends(verify_token)
):
    """Get courses filtered by age group"""
    try:
        # Determine age group
        age_group = get_age_group(age)
        
        # Try to fetch from MongoDB first, fallback to sample data
        courses = []
        if courses_collection:
            try:
                courses_cursor = courses_collection.find({
                    "age_group": age_group,
                    "is_active": True
                }).sort("created_at", 1)
                
                courses = list(courses_cursor)
                for course in courses:
                    course["_id"] = str(course["_id"])  # Convert ObjectId to string
                    
            except Exception as e:
                print(f"MongoDB query failed: {e}")
        
        # Fallback to sample data if no courses found
        if not courses:
            courses = get_sample_courses_by_age_group(age_group)
            print(f"📋 Using sample data for age group {age_group}")
        
        # Add completion status (mock for now)
        for course in courses:
            course["isCompleted"] = False  # Would normally check user progress
        
        return CourseResponse(
            courses=courses,
            age_group=age_group,
            total_courses=len(courses)
        )
        
    except Exception as e:
        print(f"Error in get_courses: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch courses: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    mongo_status = "disconnected"
    supabase_status = "not configured"
    
    # Test MongoDB connection
    if mongo_client:
        try:
            mongo_client.admin.command('ping')
            mongo_status = "connected"
        except Exception as e:
            mongo_status = f"error: {str(e)}"
    
    # Test Supabase connection
    if supabase:
        supabase_status = "configured"
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "mongodb": mongo_status,
            "supabase": supabase_status
        },
        "environment": {
            "supabase_url_set": bool(SUPABASE_URL),
            "supabase_key_set": bool(SUPABASE_SERVICE_ROLE_KEY),
            "mongodb_url": MONGODB_URL
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)