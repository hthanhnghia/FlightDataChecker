import csv
import json

#with open('standard_all_airports(iaco).json', 'wb') as jsonfile:
airports = []
with open('global_airports.csv', 'rb') as csvfile:
	csvreader = csv.reader(csvfile)
	firstrow = True
	for row in csvreader:
		if firstrow:
			#print row
			firstrow = False
			continue

		#print row
		code = row[5]
		place = row[2] + ', ' + row[3]
		name = row[1]
		#print code, place, name
		coordinates = [float(row[6]), float(row[7])]
		airport = {'code': code, 'place': place, 'name': name, 'coordinates': coordinates}
		airports.append(airport)

json_data = {'airports': airports}
#print json_data

with open('standard_all_airports(iaco).json', 'w') as fp:
	json.dump(json_data, fp)
#print row
			