# Generated by Django 3.2.12 on 2023-02-28 18:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0013_alter_listing_deactivateitem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bids',
            name='bid',
            field=models.DecimalField(decimal_places=2, max_digits=15),
        ),
    ]