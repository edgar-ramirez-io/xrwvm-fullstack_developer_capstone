from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
from django.contrib import messages
from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate
from .restapis import get_request, analyze_review_sentiments, post_review, fetch_chat

# Get an instance of a logger
logger = logging.getLogger(__name__)
cache = {}


# Create your views here.
def get_cars(request):
    count = CarMake.objects.filter().count()
    print(count)
    if count == 0:
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({"CarModel": car_model.name, "CarMake": car_model.car_make.name})
    return JsonResponse({"CarModels": cars})


@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)


def logout_request(request):
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)


@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']

    user_exists = False
    logger.debug("{} Calling /registration with".format(username))

    try:
        User.objects.get(username=username)
        user_exists = True
    except:
        logger.debug("{} is new user".format(username))

    logger.debug("{} Calling /registration with user_exists={}".format(username, user_exists))
    if not user_exists:
        user = User.objects.create_user(username=username, password=password, first_name=first_name,
                                        last_name=last_name, email=email)
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
        return JsonResponse(data)
    else:
        return JsonResponse({"userName": username, "status": "Already exists"})

def get_dealerships(request, state="All"):
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/"+state
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})

def get_dealer_reviews(request, dealer_id):
    # if dealer id has been provided
    if dealer_id:
        endpoint = "/fetchReviews/dealer/"+str(dealer_id)
        reviews = get_request(endpoint)
        for review_detail in reviews:
            cache_id = f"{dealer_id}-{review_detail['id']}"
            if cache_id not in cache:
                response = analyze_review_sentiments(review_detail['review'])
                print(response)
                cache[cache_id] = response
                print("caching response from analyze_review_sentiments")
            else:
                print("return cached response: {} from analyze_review_sentiments".format(cache_id))
                response = cache.get(cache_id)
            print("review_detail: {}".format(review_detail))
            print("cache: {}".format(cache))
            review_detail['sentiment'] = response['sentiment'] if response is not None else None
        return JsonResponse({"status":200,"reviews":reviews})
    else:
        return JsonResponse({"status":400,"message":"Bad Request"})

def get_dealer_details(request, dealer_id):
    if dealer_id:
        dealer_details = get_request("/fetchDealer/"+str(dealer_id))
        return JsonResponse({"status": 200, "dealer": dealer_details})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})

def add_review(request):
    if not request.user.is_anonymous:
        data = json.loads(request.body)
        try:
            response = post_review(data)
            return JsonResponse({"status":200, "data": response})
        except:
            return JsonResponse({"status":401,"message":"Error in posting review"})
    else:
        return JsonResponse({"status":403,"message":"Unauthorized"})

def get_chat(request, prompt):
    response = fetch_chat(prompt)
    return JsonResponse({"status":200, "data": response})
