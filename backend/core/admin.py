from django.contrib import admin
from django.utils.timezone import now

from .models import (
    Tenant,
    DataSource,
    Record
)


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name'
    )


@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'source_type',
        'file_name',
        'uploaded_at'
    )


@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'category',
        'status',
        'normalized_quantity',
        'normalized_unit',
        'normalized_date',
        'approved_at',
        'data_source'
    )

    list_filter = (
        'status',
        'category'
    )

    actions = [
        'approve_records',
        'reject_records'
    ]

    def approve_records(
        self,
        request,
        queryset
    ):

        queryset.update(
            status='approved',
            approved_at=now()
        )

    approve_records.short_description = (
        "Approve selected records"
    )

    def reject_records(
        self,
        request,
        queryset
    ):

        queryset.update(
            status='rejected'
        )

    reject_records.short_description = (
        "Reject selected records"
    )