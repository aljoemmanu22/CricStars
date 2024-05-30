from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("", views.getAccountsRoutes.as_view(), name="accounts-routes"),
    path("register/", views.RegisterView.as_view(), name="user-register"),
    # path("login/", views.LoginView.as_view(), name="user-login"),

    path('send-otp/', views.SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', views.VerifyOTPView.as_view(), name='verify-otp'),
    path('check-user/', views.CheckUserView.as_view(), name='check_user'), # Add this line
    path('logout/',views.LogoutView.as_view(),name='login'),


    path("user/details/", views.UserDetails.as_view(), name="user-details"),
    
    path("user/imagedetails/update", views.UserImageDetailsUpdate.as_view(), name="user-details-update"),
    path('user/detail/update/', views.UserDetailsUpdate.as_view(), name='update-profile'),
    
    
    
    
    ######################## ADMIN SIDE ##########
    path('admin/users/', views.AdminUserListCreateView.as_view(), name='admin-user-list-create'),
    path('admin/users/<int:id>/', views.AdminUserRetrieveView.as_view(), name='admin-user-list-single'),
    
    path("current/", views.UserView.as_view(), name="user-current"),
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('admin/admin_login/', views.AdminLoginView.as_view(),),
    path('admin/admin_home/', views.AdminDashboardCount.as_view()),
    path('admin/users/status/<int:pk>/', views.AcceptUserView.as_view()),
]