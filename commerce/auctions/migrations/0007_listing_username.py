# Generated by Django 4.1.4 on 2023-01-17 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0006_listing_userid'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='userName',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
