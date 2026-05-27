from django.urls import path
from .views import (
    CSVUploadView,
    DashboardView,
    RecordListView,
    RecordActionView
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

    path(
        'record/<int:record_id>/<str:action>/',
        RecordActionView.as_view(),
        name='record-action'
    ),
]