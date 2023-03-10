from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from datetime import datetime, timedelta
from django.db import connection, transaction
from django.db.models import Avg, Max, Min, Sum


from .models import User, Listing, wishList, Bids, listingComments
import datetime
import logging


def index(request):
    
    listings = Listing.objects.all()
    listingContent = {
                    "listings": listings
                }
    
    return render(request, "auctions/index.html", listingContent)

def categoryPage(request, category):
    
    categoryType = Listing.objects.all().filter(category=category)
    categoryContent = {
                    "categoryType": categoryType
                }
    
    return render(request, "auctions/categories-page.html", categoryContent)

def category(request):
    return render(request, "auctions/categories.html")

def entireWishList(request):
    
    if request.method == "POST":
        
        itemNumber = request.POST["wishListItem"]
        userID = request.POST["userID"]
        removeItem = wishList.objects.get(userID=userID, itemNumber=itemNumber)
        
        removeItem.delete()
        
        wishListItems = wishList.objects.all()
        wishListContent = {
                    "wishlist": wishListItems
                }
        return render(request, "auctions/wishlist.html", wishListContent)
    else:
        wishListItems = wishList.objects.all()
        wishListContent = {
                    "wishlist": wishListItems
                }
        return render(request, "auctions/wishlist.html", wishListContent)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

def listingEdits(request):
    
    if request.user.is_authenticated:
        
        return render(request, "auctions/listing.html")
        
    else:
        
        listingContent = {
                    "noUserMessage": "You must log in to bid or add to your wishlist"
                
                }
        return render(request, "auctions/listing.html", listingContent)


def listing(request, id):
    
    listing = Listing.objects.get(id=id)
    startingDate = listing.startingDate
    auctionLength = listing.auctionLength
    listingEndDate = startingDate + timedelta(days=auctionLength)
    
    listingContent = {
            "id": listing.id,
            "title": listing.title,
            "startingDate": listing.startingDate,
            "longDescription": listing.longDescription,
            "shortDescription": listing.shortDescription,
            "startingBid": listing.startingBid,
            "userName": listing.userName,
            "listingEndDate": listingEndDate,
            "listingDeactivated": listing.deactivateItem,
            "message": "",
            "maxBid": "",
            "winningUser": "",
            "comments": ""
        }
    
    if request.user.is_authenticated:
        
        userID = request.user.id
        userName = str(request.user)
        
        if request.method == "POST":
            
            if 'submit_bid' in request.POST:
                bid = request.POST["bid"]
                
                maxBid = Bids.objects.aggregate(Max('bid'))
                maxBidFormat = maxBid['bid__max']
                maxBidFormatted = float(maxBidFormat)
                
                if float(bid) <= maxBidFormatted:
                    
                    listingContent.update({
                    "message": "You must increase your bid!"
                    })

                    return render(request, "auctions/listing.html", listingContent)
                else:
                
                    addBid = Bids.objects.create(userID=userID, userName=userName, itemNumber=id, bid=bid, bidDate=datetime.date.today())

                    listingContent.update({
                        "message": "Your bid has been submitted!"
                    })
                    
                    return render(request, "auctions/listing.html", listingContent)                                                                     
            
            if 'wishlist_submit' in request.POST:
                wishlistItemTitle = request.POST["wishlistItemTitle"]
                
                try:
                    
                    searchItemsInWishlist = wishList.objects.get(itemNumber=id)
                    foundItem = searchItemsInWishlist.itemNumber
                
                    if id == foundItem:
                        listingContent.update({
                        "message": "Item is already on your wishlist!"
                        })
                        
                        return render(request, "auctions/listing.html", listingContent)
                
                except wishList.DoesNotExist:
                
                        addWishlistItem = wishList.objects.create(userID=userID, userName=userName, itemNumber=id, title=wishlistItemTitle)
                        
                        listingContent.update({
                            "message": "You have saved the listing to your wishlist!"
                        })
                        
                        return render(request, "auctions/listing.html", listingContent)
                
            if 'submit_close' in request.POST:
                removeItem = request.POST["removeItemValue"]
                
                listingToRemove = Listing.objects.filter(id=id)
                listingToRemove.update(deactivateItem=removeItem)
                
                listingContent.update({
                    "message": "Your listing has been deactivated!"
                })
                
                return render(request, "auctions/listing.html", listingContent)
            
            if 'makeComment_submit' in request.POST:
                
                commentValue = request.POST.get("listingComment")
                
                getCommentDB = listingComments.objects.create(userID=userID, userName=userName, itemNumber=id, comment=commentValue)
                
                getComments = listingComments.objects.all()
                
                
                listingContent.update({
                    "message": "Your comment has been added!",
                    "comments": getComments
                })
                
                return render(request, "auctions/listing.html", listingContent)
        
        else:
            
            wonBidding = Bids.objects.aggregate(Max('bid'))
            wonBiddingFormat = wonBidding['bid__max']
            wonBiddingFormatted = float(wonBiddingFormat)
            searchWinner = Bids.objects.get(bid=wonBiddingFormatted)
            winner = searchWinner.userName
            getComments = listingComments.objects.all()
            
            listingContent.update({
                "maxBid": wonBiddingFormatted,
                "winningUser": winner,
                "comments": getComments
            })
            
            return render(request, "auctions/listing.html", listingContent)
        
    else:
        
        listingContent.update({
            "message": "You must log in to view details about this listing."
        })
            
        return render(request, "auctions/listing.html", listingContent)

def newListing(request):
    if request.method == "POST":
        listingTitle = request.POST["listingTitle"]
        briefDescription = request.POST["briefDescription"]
        longDescription = request.POST["longDescription"]
        listingImg = request.POST["listingImg"]
        startingBid = request.POST["startingBid"]
        auctLength = request.POST["auctLength"]
        userID = request.user.id
        userName = str(request.user)
        categories = request.POST["category"]

        # update the listing and image objects
        addListing = Listing.objects.create(title=listingTitle, startingBid=startingBid, startingDate=datetime.date.today(),
                                            auctionLength=auctLength, longDescription=longDescription, shortDescription=briefDescription, userID=userID, userName=userName, category=categories)
        addListing.save()

        return render(request, "auctions/new-listing.html", {
            "message": "Your listing has been created"})

    else:
        
        return render(request, "auctions/new-listing.html")
