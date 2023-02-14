# Generated by Django 4.1.4 on 2022-12-22 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0002_bids_listing'),
    ]

    operations = [
        migrations.CreateModel(
            name='listingImages',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('itemNumber', models.IntegerField()),
                ('dateAdded', models.DateField()),
                ('imageURL', models.CharField(max_length=5000)),
            ],
        ),
    ]