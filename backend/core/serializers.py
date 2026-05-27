from rest_framework import serializers
from .models import Record


class CSVUploadSerializer(
    serializers.Serializer
):

    file = serializers.FileField()

    source_type = (
        serializers.ChoiceField(
            choices=[
                ('sap', 'SAP'),
                (
                    'electricity',
                    'Electricity'
                ),
                (
                    'travel',
                    'Travel'
                )
            ]
        )
    )


class RecordSerializer(
    serializers.ModelSerializer
):

    source_file = (
        serializers.CharField(
            source=
            'data_source.file_name'
        )
    )

    class Meta:

        model = Record

        fields = [
            'id',
            'category',
            'status',
            'suspicious_reason',
            'normalized_quantity',
            'normalized_unit',
            'normalized_date',
            'source_file',
            'is_locked'
        ]