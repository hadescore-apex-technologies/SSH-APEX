from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_eduskillsdomain_eduskillsmentor_eduskillsproject_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ApexItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section', models.CharField(choices=[('hero', 'Hero'), ('stats', 'Stats'), ('labs', 'Innovation Labs'), ('programs', 'Startup Programs'), ('portfolio', 'Portfolio'), ('research', 'Research'), ('events', 'Events'), ('cta', 'CTA / Apply')], default='hero', max_length=30)),
                ('title', models.CharField(max_length=200)),
                ('subtitle', models.CharField(blank=True, max_length=300)),
                ('description', models.TextField(blank=True)),
                ('tags', models.CharField(blank=True, max_length=300)),
                ('icon', models.CharField(blank=True, max_length=50)),
                ('extra', models.CharField(blank=True, max_length=200)),
                ('link', models.CharField(blank=True, max_length=500)),
                ('order', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['section', 'order', '-created_at'],
            },
        ),
    ]
