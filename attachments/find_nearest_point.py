import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Symphony.settings")
django.setup()

def find_nearest_point(info):
    from django.db import connection
    import geocoder
    try:
        lat, lng = geocoder.google(info).latlng
        cur = connection.cursor()
        cur.callproc("find_nearest_point", [str(lat), str(lng)])
        results = cur.fetchall()
        cur.close()
        return results[0][0]
    except:
        return None
