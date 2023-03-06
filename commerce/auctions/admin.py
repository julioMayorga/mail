from django.contrib import admin

# Register your models here.
from .models import User, Listing, wishList, Bids, listingComments

admin.site.register(User)
admin.site.register(Listing)
admin.site.register(wishList)
admin.site.register(Bids)
admin.site.register(listingComments)
