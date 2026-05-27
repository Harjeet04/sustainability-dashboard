from datetime import datetime


def normalize_unit(quantity, unit):

    if quantity is None:
        return None, None

    unit = str(unit).lower()
    quantity = float(quantity)

    conversion_map = {
        'l': ('L', quantity),
        'liter': ('L', quantity),
        'litre': ('L', quantity),

        'gallon': (
            'L',
            quantity * 3.78541
        ),

        'kwh': ('kWh', quantity),

        'mwh': (
            'kWh',
            quantity * 1000
        )
    }

    if unit in conversion_map:
        normalized_unit, normalized_value = (
            conversion_map[unit]
        )

        return (
            round(normalized_value, 2),
            normalized_unit
        )

    return quantity, unit


def normalize_date(date_value):

    if not date_value:
        return None

    formats = [
        "%d-%m-%Y",
        "%Y-%m-%d",
        "%m/%d/%Y",
        "%Y/%m/%d"
    ]

    for fmt in formats:
        try:
            return datetime.strptime(
                str(date_value),
                fmt
            ).date()
        except:
            pass

    return None