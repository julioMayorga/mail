from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Listing(models.Model):
    userID = models.IntegerField(blank=True, null=True)
    userName = models.CharField(max_length=200, blank=True, null=True)# This would be the foreign key
    # itemNumber = models.IntegerField()
    title = models.CharField(max_length=2000)
    startingBid = models.IntegerField()
    startingDate = models.DateField()
    auctionLength = models.IntegerField()
    longDescription = models.CharField(max_length=4000)
    shortDescription = models.CharField(max_length=3000)
    category = models.CharField(max_length=4000, blank=True, null=True)
    deactivateItem = models.CharField(max_length=4000, blank=True, null=True)


class Bids(models.Model):
    userID = models.IntegerField(blank=True, null=True)
    userName = models.CharField(max_length=200, blank=True, null=True)
    itemNumber = models.IntegerField()
    bid = models.DecimalField(max_digits=15, decimal_places=2)
    bidDate = models.DateField()


class listingImages(models.Model):
    itemNumber = models.IntegerField()
    dateAdded = models.DateField()
    imageURL = models.CharField(max_length=5000)
    
class wishList(models.Model):
    userID = models.IntegerField(blank=True, null=True)
    userName = models.CharField(max_length=200, blank=True, null=True)
    itemNumber = models.IntegerField()
    title = models.CharField(max_length=2000)
    
class listingComments(models.Model):
    userID = models.IntegerField(blank=True, null=True)
    userName = models.CharField(max_length=200, blank=True, null=True)
    itemNumber = models.IntegerField()
    comment = models.CharField(max_length=3000)
