#!/bin/bash
echo "Cloning..."

echo "git clone https://github.com/edgar-ramirez-io/xrwvm-fullstack_developer_capstone.git && cd /home/project/xrwvm-fullstack_developer_capstone/server"

echo "pip and virtual env stuff..."
pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate

echo "installing dependencies..."

python3 -m pip install -U -r requirements.txt

echo "migrations..."

python3 manage.py makemigrations

python3 manage.py migrate

echo "building mongodb..."
cd /home/project/xrwvm-fullstack_developer_capstone/server/database
docker build . -t nodeapp
docker-compose up -d
echo "verify app in port 3030"

echo "building front end..."
cd /home/project/xrwvm-fullstack_developer_capstone/server/frontend
npm install
npm run build

echo "Manually run the following commands:"
echo "source djangoenv/bin/activate"
echo "python3 manage.py createsuperuser"
echo "Then update ALLOWED_HOSTS and CSRF_TRUSTED_ORIGINS"
echo "And finally"
echo "python3 manage.py runserver"
echo "verify app in port 8000"
