# Generated by Django 4.1.4 on 2023-01-05 10:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0003_listingimages'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listing',
            name='itemNumber',
        ),
        migrations.RemoveField(
            model_name='listing',
            name='userID',
        ),
    ]