# Generated by Django 5.2 on 2025-04-14 09:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("todo", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="todoitem",
            name="description",
            field=models.TextField(),
        ),
    ]
