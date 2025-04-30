# coding-project-template

## server setup

Lab: https://learning.edx.org/course/course-v1:IBM+CAD0321EN+3T2022/home

1. Go to server folder

```bash
cd server
```

1. Setup Python virtual environment

```bash
python --version
python -m venv djangoenv
source djangoenv/bin/activate
python -m pip install -U -r requirements.txt
```

1. Perform migrations

```bash
cd /server
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

# Using Lab (learning.edx.org)

```bash
git clone https://github.com/edgar-ramirez-io/xrwvm-fullstack_developer_capstone.git
cd /home/project/xrwvm-fullstack_developer_capstone/server

npm run cloud

## When scripts finish
source djangoenv/bin/activate

python3 manage.py makemigrations

python3 manage.py migrate

python3 manage.py createsuperuser

# update server/djangoproj/settings.py in further steps

python3 manage.py runserver

# In a new terminal do mongodb set-up (problems with scripts)
cd /home/project/xrwvm-fullstack_developer_capstone/server/database
docker build . -t nodeapp && docker-compose up
# verify app in port http://localhost:3030
```

1. Open `server/djangoproj/settings.py`
1. Update `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` with provisioned url wit following:
   **Example:**

```
   ALLOWED_HOSTS = ['localhost', 'https://edgarramrez-8000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai']
   CSRF_TRUSTED_ORIGINS = ['http://localhost', 'https://edgarramrez-8000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai']
```

1. Open Lab and get the url from (left) Skills Network Toolbox - Other - Launch App - port 8000 - Your Application
1. This will let you visit Admin and Frontend

## Mongo Server (local)

```bash
cd /server/database
docker build . -t nodeapp
docker-compose up
```

# Mongo Server (learning.edx.org)

1. Test MongoDB API by hitting the provisioned URL from (left) Skills Network Toolbox - Other - Launch App - port 3030 - Your Application
1. Test any of the endpoints: `https://edgarramrez-3030.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/fetchReviews`
1. Update `djangoapp/.env` with backend with provisioned url without `/`

# Development (frontend and learning.edx.org)

1. Make changes in `server/frontend`
1. run `npm install`
1. run `npm run build` because it's configured as TEMPLATES
1. run `npm run start`
1. Test it with `http://localhost:8000/`

# Deploy sentiment analysis on Code Engine as a microservice (ONLY learning.edx.org)

1. Go to Cloud section and select Code Engine - Create Project - Code Engine CLI

```bash
cd xrwvm-fullstack_developer_capstone/server/djangoapp/microservices
docker build . -t us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer
docker push us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer
ibmcloud ce application create --name sentianalyzer --image us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer --registry-secret icr-secret --port 5000
```

1. Copy url and update `djangoapp/.env` with something like this `https://sentianalyzer.1uukanemq8i1.us-south.codeengine.appdomain.cloud/` (including `/`)
