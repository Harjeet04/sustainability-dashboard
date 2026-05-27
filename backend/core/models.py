from django.db import models


class Tenant(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class DataSource(models.Model):

    SOURCE_TYPES = [
        ('sap', 'SAP'),
        ('electricity', 'Electricity'),
        ('travel', 'Travel')
    ]

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE
    )

    source_type = models.CharField(
        max_length=50,
        choices=SOURCE_TYPES
    )

    file_name = models.CharField(
        max_length=255
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.source_type} - "
            f"{self.file_name}"
        )


class Record(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('suspicious', 'Suspicious')
    ]

    data_source = models.ForeignKey(
        DataSource,
        on_delete=models.CASCADE
    )

    category = models.CharField(
        max_length=50
    )

    raw_data = models.JSONField()

    normalized_quantity = models.FloatField(
        blank=True,
        null=True
    )

    normalized_unit = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    normalized_date = models.DateField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    approved_at = models.DateTimeField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.category} | "
            f"{self.status} | "
            f"{self.data_source.file_name}"
        )