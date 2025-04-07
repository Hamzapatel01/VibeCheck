from database_models import db, User, UserData, Mood
from app import app
import os
from sqlalchemy import text

print("Current working directory:", os.getcwd())
db_path = os.path.join('instance', 'app.db')
print(f"Database file exists: {os.path.exists(db_path)}")

if not os.path.exists(db_path):
    print("\nError: Database file not found!")
    print("Please make sure:")
    print("1. You are running the script from the correct directory (backend folder)")
    print("2. The Flask application has been run at least once to create the database")
    print("3. The database file exists in the instance/app.db")
    exit(1)

with app.app_context():
    try:
        # Test database connection
        db.session.execute(text('SELECT 1'))
        print("Database connection successful")
        
        users = User.query.all()
        print(f"\n=== Users in Database ({len(users)} users found) ===")
        
        if not users:
            print("No users found in the database")
        else:
            for user in users:
                print(f"\nID: {user.id}")
                print(f"Username: {user.username}")
                print(f"Password Hash: {user.password_hash}")
                
                # Get user data
                user_data = UserData.query.filter_by(user_id=user.id).first()
                if user_data:
                    print(f"Email: {user_data.email}")
                else:
                    print("No user data found")
                
                # Get mood entries
                moods = Mood.query.filter_by(user_id=user.id).order_by(Mood.timestamp.desc()).all()
                if moods:
                    print(f"\nRecent Mood Entries ({len(moods)} total):")
                    for mood in moods[:5]:  # Show last 5 mood entries
                        print(f"- {mood.mood} ({mood.timestamp.strftime('%Y-%m-%d %H:%M:%S')})")
                        if mood.note:
                            print(f"  Note: {mood.note}")
                else:
                    print("\nNo mood entries found")
                
                print("-" * 50)
    except Exception as e:
        print(f"Error accessing database: {str(e)}")
        print("\nTroubleshooting steps:")
        print("1. Make sure the Flask application is not currently running")
        print("2. Check if the database file is not locked by another process")
        print("3. Verify that all required tables exist in the database")
    
    print("\n=====================") 