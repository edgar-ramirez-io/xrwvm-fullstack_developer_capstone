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

1. Perform migrations (`/server`)

```bash
python manage.py makemigrations
python manage.py migrate
```

Remember to repeat these steps after updating `server/djangoapp/models.py`:

```bash
python manage.py makemigrations
python manage.py migrate --run-syncdb
```

2. Start local dev server:

```bash
python manage.py runserver
```

3. Create superuser (first time)

```bash
python manage.py createsuperuser
```

# Using Lab (cloud)

```bash
git clone <http>
cd /home/project/xrwvm-fullstack_developer_capstone/server

pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate

python3 -m pip install -U -r requirements.txt

python3 manage.py makemigrations

python3 manage.py migrate

python3 manage.py createsuperuser

python3 manage.py runserver
```

1. Open `server/djangoproj/settings.py`
1. Update `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` with provisioned url wit following
1. Open Lab and get the url from (left) Skills Network Toolbox - Other - Launch App - port 8000 - Your Application
1. This will let you visit Admin and Frontend

```bash
cd /home/project/xrwvm-fullstack_developer_capstone/server/frontend
npm install
npm run build
```

## Mongo Server (cloud)

```bash
cd /home/project/xrwvm-fullstack_developer_capstone/server/database
docker build . -t nodeapp
docker-compose up
```

1. Test MongoDB API by hitting the provisioned URL from (left) Skills Network Toolbox - Other - Launch App - port 3030 - Your Application

# Local Setup

# Development (frontend)

1. Make changes in `server/frontend` and run `npm run build` because it's configured as TEMPLATES

# Development (database)

1. Make sure to run `docker build . -t nodeapp` and `docker compose up` after changing the your Express app
1. Run `docker-compose up`
1. For development use `http://localhost:3030` becuase Docker is exposing that port
