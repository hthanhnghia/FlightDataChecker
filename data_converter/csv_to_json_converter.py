import csv
import json

airports = []
with open('standard_all_airports(iaco).csv', 'rb') as csvfile:
	csvreader = csv.reader(csvfile)
	firstrow = True
	for row in csvreader:
		if firstrow:
			firstrow = False
			continue

		code = row[5]
		place = row[2] + ', ' + row[3]
		name = row[1]
		coordinates = [float(row[6]), float(row[7])]
		airport = {'code': code, 'place': place, 'name': name, 'coordinates': coordinates}
		airports.append(airport)

json_data = {'airports': airports}

with open('standard_all_airports(iaco).json', 'w') as fp:
	json.dump(json_data, fp)