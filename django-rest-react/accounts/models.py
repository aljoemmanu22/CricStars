from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class MyAccountManager(BaseUserManager):
    def create_user(self, first_name, phone_number, password=None):
        if not first_name:
            raise ValueError('User Must Have A first_name')
        if not phone_number:
            raise ValueError('User Must Have An Phone Number')
            
        user = self.model(
            first_name=first_name,
            phone_number=phone_number
        )
        user.set_password(password)
        user.save(using=self._db)
        
        return user
    
    def create_superuser(self, first_name, phone_number, password):
        user = self.create_user(
            first_name=first_name,
            phone_number=phone_number,
            password=password,
        )
        user.is_active = True
        user.is_superuser = True
        user.is_staff = True
        
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    ROLE_CHOICES = [
        ('Batsman', 'Batsman'),
        ('Bowler', 'Bowler'),
        ('All-Rounder', 'All-Rounder'),
        ('Wicketkeeper', 'Wicketkeeper'),
    ]
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50, blank=True)
    phone_number = models.CharField(max_length=12, unique=True)
    email = models.EmailField(max_length=100, blank=True, default='')
    
    # required fields
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now_add=True)
    is_superuser = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True)
    batting_style = models.CharField(max_length=100, blank=True)
    bowling_style = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField(null=True, blank=True) 

    current_team_name = models.ForeignKey('match.Team', on_delete=models.PROTECT,  null=True, blank=True)
    matches_played = models.PositiveIntegerField(default=0, null=True, blank=True)

    # fields which store compiled batting match statistics
    # these will be compiled by a views.py function
    batting_total_runs_scored = models.PositiveIntegerField(default=0, null=True, blank=True)
    batting_inning = models.PositiveIntegerField(default=0, null=True, blank=True)
    batting_high_score = models.PositiveIntegerField(default=0, null=True, blank=True)
    batting_average = models.FloatField(default=0, null=True, blank=True)
    batting_strike_rate = models.FloatField(default=0, null=True, blank=True)
    batting_50s = models.PositiveIntegerField(default=0, null=True, blank=True)
    batting_100s = models.PositiveIntegerField(default=0, null=True, blank=True)
    batting_total_balls_faced = models.PositiveIntegerField(default=0, null=True, blank=True)

    # fields which store compiled bowling match statistics
    # these will be compiled by a views.py function
    bowling_total_overs_bowled = models.PositiveIntegerField(default=0, null=True, blank=True)
    bowling_runs_conceded = models.PositiveIntegerField(default=0, null=True, blank=True)
    bowling_wickets = models.PositiveIntegerField(default=0, null=True, blank=True)
    bowling_best_figures = models.CharField(max_length=10, default='NA')
    bowling_average = models.FloatField(default=0, null=True, blank=True)
    bowling_strike_rate = models.FloatField(default=0, null=True, blank=True)
    bowling_economy = models.FloatField(default=0, null=True, blank=True)
    bowling_5ws = models.PositiveIntegerField(default=0, null=True, blank=True)
    
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['first_name']
    
    objects = MyAccountManager()
    
    def __str__(self):
        return self.first_name
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser
    
    def has_module_perms(self, add_label):
        return True

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="User_Profile")
    profile_pic = models.ImageField(upload_to='user/profile_pic/', null=True, blank=True)
    
    def __str__(self):
        return str(self.user.first_name)
