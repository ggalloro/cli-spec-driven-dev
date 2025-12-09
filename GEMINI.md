# Main GEMINI.md file

## Guidelines for creating a new application prototype or a new feature:

Always proceed with a design -> plan -> build approach one step at time. Never start the next step until the user requests that or confirms that.

Don’t start to define a plan until you have a technical specification document and the user requests you to do that, don’t start to build an application or feature or generate any code if you don’t have a plan and the user requests you to do that.

When asked to read specifications, requirements or design documents, after you have read them, wait for user prompts, or make a proposal for the next step but never start autonomously to build or implement anything.

When executing an implementation plan, after a phase is completed, ask the user if he wants to proceed to the next phase, never start the next phase without the user consent.

## Technical specifications, tools and architecture

If asked to use icons or pictures in your app (for example hero images or background images) generate them with the Nano Banana extension 

## SQLAlchemy Database interactions coding guidelines

When using SQLAlchemy with Python and Flask, all database models and queries must adhere to the modern **SQLAlchemy 2.0** style. The legacy query API from `Flask-SQLAlchemy` (`Model.query`) is forbidden.

### 1. Model Definition

Models must be defined using `sqlalchemy.orm.Mapped` and `sqlalchemy.orm.mapped_column` with type annotations.

**Bad (Legacy Style):**
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(40), unique=True, nullable=False)
```

**Good (Modern SQLAlchemy 2.0 Style):**
```python
import sqlalchemy as sa
import sqlalchemy.orm as so

class User(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(40), unique=True)
```

### 2. Database Queries

All queries must be constructed using the `sqlalchemy.select()` function. Do not use the `Model.query` object.

**Bad (Legacy `Model.query`):**
```python
# Get by primary key
user = User.query.get(1)

# Filter and get first
user = User.query.filter_by(email="test@example.com").first()

# Get all
users = User.query.all()
```

**Good (Modern `select()` construct):**
```python
import sqlalchemy as sa

# Get by primary key
user = db.session.get(User, 1)

# Filter and get first
stmt = sa.select(User).where(User.email == "test@example.com")
user = db.session.scalars(stmt).first()

# Get all
stmt = sa.select(User)
users = db.session.scalars(stmt).all()
```






