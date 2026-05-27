from django.urls import path
from .views import (
    CSVUploadView,
    DashboardView,
    RecordListView
)

urlpatterns = [
    path(
        'upload/',
        CSVUploadView.as_view(),
        name='upload-csv'
    ),

    path(
        'dashboard/',
        DashboardView.as_view(),
        name='dashboard'
    ),

    path(
        'records/',
        RecordListView.as_view(),
        name='records'
    ),
]