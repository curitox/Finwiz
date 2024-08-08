from flask.cli import with_appcontext
import click
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, text
from flask import current_app as app
from model import db
import subprocess
import os

@click.command("drop-tables")
@with_appcontext
def drop_all_tables():
    """Drop all tables."""
    try:
        db.drop_all()
        print("All tables dropped successfully.")
    except Exception as e:
        print(f"Error dropping tables: {e}")

@click.command("db-upgrade")
@click.argument('message', required=False, default="")
@with_appcontext
def db_upgrade(message):
    # Get the database URL from the app config
    db_url = app.config['SQLALCHEMY_DATABASE_URI']
    # Check if the migrations directory exists
    migrations_dir = os.path.join(app.root_path, 'migrations')
    if not os.path.exists(migrations_dir):
        print("Migrations directory not found. Initializing migrations...")
        init_result = subprocess.run(
            ['flask', 'db', 'init'],
            capture_output=True,
            text=True
        )
        if init_result.returncode == 0:
            print("Migrations directory initialized successfully.")
        else:
            print(f"Error initializing migrations directory: {init_result.stderr}")
            return

    # Create an SQLAlchemy engine
    engine = create_engine(db_url)
    inspector = inspect(engine)

    # Check if the database has any tables
    tables = inspector.get_table_names()
        
    if not tables:
        print("Database is empty. Creating all tables...")
        with app.app_context():
            # Create all tables
            db.create_all()
        print("All tables created.")
    else:
        print("Database already contains tables.")
    #Create a new migration from the current schema and remove old migration files.
    try:
        # Create a new migration file
        migrate_result = subprocess.run(
            ['flask', 'db', 'migrate', '-m', message],
            capture_output=True,
            text=True
        )
        if migrate_result.returncode == 0:
            print("New migration created successfully.")
        else:
            print(f"Error creating new migration: {migrate_result.stderr}")
            return

        # Upgrade the database
        upgrade_result = subprocess.run(
            ['flask', 'db', 'upgrade'],
            capture_output=True,
            text=True
        )
        if upgrade_result.returncode == 0:
            print("Database upgraded successfully.")
        else:
            print(f"Error upgrading database: {upgrade_result.stderr}")
            return

    except Exception as e:
        print(f"Error during db-upgrade: {e}")

@click.command("db-clean")
@with_appcontext
def drop_alembic_version_table():
    try:
        with Session(db.engine) as session:
            session.execute(text('DROP TABLE IF EXISTS alembic_version;'))
            session.commit()
        print("alembic_version table dropped successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")


def register_commands(app):
    app.cli.add_command(drop_all_tables)
    app.cli.add_command(db_upgrade)
    app.cli.add_command(drop_alembic_version_table)
