import csv
import random
import time

names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hannah"]
ages = list(range(18, 60))
cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami", "Dallas", "Seattle", "San Francisco"]

filename = "C:/Users/gaura/Desktop/gv/DM Streaming Data project/output.csv"

with open(filename, mode='a', newline='') as file:
    writer = csv.writer(file)
    for i in range(1, 1001):
        data = [random.choice(names), random.choice(ages), random.choice(cities)]
        time.sleep(0.1)
        print("ADDED: ", data)
        writer.writerow(data)