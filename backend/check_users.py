from database_models import db, User
from app import app

with app.app_context():
    users = User.query.all()
    print("\n=== Users in Database ===")
    for user in users:
        print(f"\nID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Password Hash: {user.password_hash}")
        print("-" * 50)
    print("\n=====================") 