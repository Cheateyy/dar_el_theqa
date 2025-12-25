# create_test_wilayas_regions.py
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from locations.models import Wilaya, Region  # adjust if Region model name differs


DATA = {
    "Adrar": [
        "Adrar", "Akabli", "Aoulef", "Bouda", "Charouine", "Deldoul",
        "Fenoughil", "In Zghmir", "Metarfa", "Ouled Ahmed Tammi",
        "Reggane", "Sali", "Sebaa", "Tamantit", "Tamekten",
        "Tamest", "Tit", "Tsabit", "Zaouiet Kounta"
    ],
    "Chlef": [
        "Chlef", "Tenes", "Abou El Hassan", "Boukadir", "El Karimia",
        "Oued Fodda", "Bouzeghaia", "Ouled Abbes", "Ouled Fares",
        "Oum Drou", "Beni Bouateb", "Sidi Akkacha",
        "Sidi Abderrahmane", "Labiod Medjadja", "Taougrit",
        "El Marsa", "Aïn Merane", "Zeboudja", "Herenfa",
        "Sendjas", "Chorfa", "Beni Rached", "El Hadjadj"
    ],
    "Laghouat": [
        "Laghouat", "Ain Madhi", "Tadjemout", "Ksar El Hirane",
        "Sidi Makhlouf", "Hassi Delaa", "Hassi R'Mel",
        "El Assafia", "Aflou", "Brida", "El Ghicha",
        "Gueltat Sidi Saad", "Tadjrouna", "Oued Morra",
        "Oued M'zi", "Beni Mekhlouf", "Sebgag", "Sidi Bouzid",
        "Sidi Boumour", "Taouiala"
    ],
    "Oum El Bouaghi": [
        "Oum El Bouaghi", "Aïn Beida", "Aïn M'Lila", "Aïn Babouche",
        "Aïn Diss", "Aïn Fakroun", "Aïn Kercha", "Behir Chergui",
        "Bir Chouhada", "Dhalaa", "El Amiria", "El Belala",
        "El Djazia", "El Fedjouz Boughrara Saoudi", "Fkirina",
        "Ksar Sbahi", "Ouled Gacem", "Ouled Hamla",
        "Ouled Zouai", "Rahia", "Sigus", "Soukrine",
        "Zorg", "Hamadi Ksar"
    ],
    "Batna": [
        "Batna", "Arris", "Barika", "Boumagueur", "Bouzina",
        "Chaïba", "Chelia", "Djerma", "Fesdis", "Ghassira",
        "Hidoussa", "Ichmoul", "Inoughissen", "Kimmel", "Larbaa",
        "Menaa", "Merouana", "N'Gaous", "Oued Chaaba",
        "Oued El Ma", "Oued Taga", "Ouled Ammar", "Ouled Sellem",
        "Ouled Si Slimane", "Ras El Aioun", "Seggana", "Sefiane",
        "Seriana", "Talkhamt", "Taxlent", "Teniet El Abed",
        "Tazoult", "Tilatou", "Timgad", "Zanet El Beida"
    ],
}

print("Creating test wilayas & regions...")
print("-" * 60)

wilaya_created = 0
region_created = 0

for wilaya_name, regions in DATA.items():
    wilaya, created = Wilaya.objects.get_or_create(name=wilaya_name)
    if created:
        wilaya_created += 1
        print(f"✓ Wilaya created: {wilaya_name}")
    else:
        print(f"• Wilaya already exists: {wilaya_name}")

    for region_name in regions:
        if Region.objects.filter(name=region_name, wilaya=wilaya).exists():
            print(f"   - Region exists: {region_name}")
            continue

        try:
            Region.objects.create(name=region_name, wilaya=wilaya)
            region_created += 1
            print(f"   ✓ Region created: {region_name}")
        except Exception as e:
            print(f"   ✗ Error creating region {region_name}: {e}")

print("-" * 60)
print("=== TEST DATA READY ===")
print(f"Wilayas created: {wilaya_created}")
print(f"Regions created: {region_created}")
print("\nYou can now test:")
print("→ http://127.0.0.1:8000/api/choices/wilayas/")
print("→ http://127.0.0.1:8000/api/choices/regions/")
