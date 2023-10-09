import json
import os
import csv
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_dir', type=str, default='./data')
    parser.add_argument('--output_file', type=str, default='./src/data.json')
    parser.add_argument('--year', type=str, default='2022')
    parser.add_argument('--granularity', type=str, default='daily')
    args = parser.parse_args()

    files_in_dir = os.listdir(args.input_dir)
    files_in_dir = [f for f in files_in_dir if args.year in f]
    files_in_dir = [f for f in files_in_dir if args.granularity in f]

    output = {}
    for f in files_in_dir:
        with open(os.path.join(args.input_dir, f), 'r') as csvfile:
            reader = csv.reader(csvfile)
            header = next(reader)
            for row in reader:
                date = row[0]
                zone_key = row[3]
                co2Intensity = row[5]
                if date not in output:
                    output[date] = {}
                output[date][zone_key] = co2Intensity

    with open(args.output_file, 'w') as outfile:
        json.dump(output, outfile)


if __name__ == '__main__':
    main()


