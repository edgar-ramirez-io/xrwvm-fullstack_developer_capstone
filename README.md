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

1. Start local dev server:
```bash
python manage.py runserver
```
