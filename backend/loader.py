import kagglehub
import pandas as pd
#Download all three datasets

path1 = kagglehub.dataset_download("bhadramohit/smartphone-usage-and-behavioral-dataset")
path2 = kagglehub.dataset_download("mohamedmoslemani/user-mobile-app-interaction-data")
path3 = kagglehub.dataset_download("amirmotefaker/screentime-app-details-dataset")

print("Dataset 1 path:", path1)
print("Dataset 2 path:", path2)
print("Dataset 3 path:", path3)