import pandas as pd

from django.db.models import Count

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import (
    MultiPartParser,
    FormParser
)

from .serializers import (
    CSVUploadSerializer,
    RecordSerializer
)
from .models import (
    Tenant,
    DataSource,
    Record
)

from .utils import (
    normalize_unit,
    normalize_date
)


class CSVUploadView(APIView):

    parser_classes = (
        MultiPartParser,
        FormParser
    )

    serializer_class = CSVUploadSerializer

    def get(self, request):
        serializer = self.serializer_class()
        return Response(serializer.data)

    def post(self, request):

        serializer = CSVUploadSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        uploaded_file = serializer.validated_data['file']
        source_type = serializer.validated_data['source_type']

        try:
            df = pd.read_csv(uploaded_file)

            tenant, _ = Tenant.objects.get_or_create(
                name="Demo Company"
            )

            data_source = DataSource.objects.create(
                tenant=tenant,
                source_type=source_type,
                file_name=uploaded_file.name
            )

            total_rows = 0
            suspicious_rows = 0

            for _, row in df.iterrows():

                row_data = {
                    k: (
                        None if pd.isna(v)
                        else str(v)
                    )
                    for k, v in row.to_dict().items()
                }

                status_value = "pending"

                if any(v is None for v in row_data.values()):
                    status_value = "suspicious"
                    suspicious_rows += 1

                quantity = row_data.get('quantity')
                unit = row_data.get('unit')
                date_value = row_data.get('date')

                normalized_quantity = None
                normalized_unit = None

                if (
                    quantity is not None
                    and unit is not None
                ):
                    normalized_quantity, normalized_unit = (
                        normalize_unit(
                            quantity,
                            unit
                        )
                    )

                normalized_date = normalize_date(
                    date_value
                )

                Record.objects.create(
                    data_source=data_source,
                    category=source_type,
                    raw_data=row_data,
                    normalized_quantity=normalized_quantity,
                    normalized_unit=normalized_unit,
                    normalized_date=normalized_date,
                    status=status_value
                )

                total_rows += 1

            return Response(
                {
                    "message": "CSV uploaded successfully",
                    "rows_ingested": total_rows,
                    "suspicious_rows": suspicious_rows
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class DashboardView(APIView):

    def get(self, request):

        total_records = Record.objects.count()

        pending_count = Record.objects.filter(
            status='pending'
        ).count()

        approved_count = Record.objects.filter(
            status='approved'
        ).count()

        rejected_count = Record.objects.filter(
            status='rejected'
        ).count()

        suspicious_count = Record.objects.filter(
            status='suspicious'
        ).count()

        return Response(
            {
                "total_records": total_records,
                "pending": pending_count,
                "approved": approved_count,
                "rejected": rejected_count,
                "suspicious": suspicious_count
            }
        )

class RecordListView(APIView):

    def get(self, request):

        records = Record.objects.select_related(
            'data_source'
        ).all().order_by('-id')

        serializer = RecordSerializer(
            records,
            many=True
        )

        return Response(
            serializer.data
        )