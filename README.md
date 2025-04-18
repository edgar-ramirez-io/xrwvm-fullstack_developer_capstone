# coding-project-template

## server setup

1. Go to server folder

```bash
DO IT!
```

1. Setup virtual environment

```bash
python --version
python -m venv djangoenv
source djangoenv/bin/activate
python -m pip install -U -r requirements.txt
```

1. Perform migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

2. Start local dev server:

```bash
python manage.py runserver
```

3. Create superuser (first time)

```bash
python manage.py createsuperuser
```

# Development (frontend)

1. Make changes in `server/frontend` and run `npm run build` because it's configured as TEMPLATES

# Development (database)

1. Make sure to run `docker build . -t nodeapp` and `docker compose up` after changing the your Express app
1. Run `docker-compose up`
1. For development use `http://localhost:3030` becuase Docker is exposing that port
