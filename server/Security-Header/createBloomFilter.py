import requests
from zipfile import ZipFile 
import io
import csv
from hashlib import sha256
from pickle import dumps

import os

from rbloom import Bloom


def download_csv_data(url):
    """Download CSV data from the given URL and extract URLs from it."""
    response = requests.get(url)
    url_list = []

    if response.status_code == 200:
        with ZipFile(io.BytesIO(response.content)) as zip_file:
            csv_file_name = zip_file.namelist()[0]
            with zip_file.open(csv_file_name) as csv_file:
                csv_reader = csv.reader(io.TextIOWrapper(csv_file, encoding='utf-8'))
                for row in csv_reader:
                    if not row or row[0].startswith('#'):
                        continue
                    if len(row) >= 3:
                        url_list.append(row[2])
    else:
        print("Failed to download the zip file")
    print(url_list[0:10])
    return url_list


def hash_func(obj):
    h = sha256(dumps(obj)).digest()
    return int.from_bytes(h[:16], "big") - 2**127

def create_bloom_filter(data_list, file_path, hash_func):
    """Create and return a Bloom Filter based on the given data list."""

    bloom_filter = Bloom(len(data_list), 0.01, hash_func)
    for data in data_list:
        bloom_filter.add(data)

    os.mkdir("bloomfilter")
    bloom_filter.save(file_path)

    return bloom_filter



def load_bloom_filter(file_path):
    """Load a Bloom Filter from the specified file path."""
    return Bloom.load(file_path, hash_func)


if __name__ == "__main__":
    csv_url = "https://urlhaus.abuse.ch/downloads/csv/"
    url_list = download_csv_data(csv_url)
    bloom_filter_path = "./bloomfilter/bloomFilterObj"

    create_bloom_filter(url_list, bloom_filter_path, hash_func)