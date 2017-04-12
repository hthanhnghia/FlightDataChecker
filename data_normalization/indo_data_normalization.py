import xlrd
import xlwt
import re

input_book = xlrd.open_workbook('OriginalTraffic_Indonesia_20151206.xls')
input_sheet = input_book.sheet_by_index(0)

output_book = xlwt.Workbook() 
output_sheet = output_book.add_sheet("Indonesia")

flight_data = {}
cur_call_sign = input_sheet.cell(1,3).value
output_sheet_row = 2

for row in range(1, input_sheet.nrows):
	airport_origin = input_sheet.cell(row,1).value
	airport_destination = input_sheet.cell(row,2).value
	call_sign = input_sheet.cell(row,3).value
	aircraft_type = input_sheet.cell(row,4).value
	rfl = input_sheet.cell(row,5).value
	fix_name = input_sheet.cell(row,6).value
	date_time = input_sheet.cell(row,7).value
	airway = input_sheet.cell(row,8).value

	if call_sign != cur_call_sign:
		output_sheet.write(output_sheet_row, 0, 'WI')
		output_sheet.write(output_sheet_row, 1, flight_data[cur_call_sign][0])
		output_sheet.write(output_sheet_row, 2, flight_data[cur_call_sign][1])
		output_sheet.write(output_sheet_row, 3, cur_call_sign)
		output_sheet.write(output_sheet_row, 4, flight_data[cur_call_sign][2])
		output_sheet.write(output_sheet_row, 5, flight_data[cur_call_sign][3])
		output_sheet.write(output_sheet_row, 6, flight_data[cur_call_sign][4])
		date, time = flight_data[cur_call_sign][5].split(' ')
		date = re.sub('-', '', date)
		output_sheet.write(output_sheet_row, 7, date)
		output_sheet.write(output_sheet_row, 8, time)

		if len(flight_data[cur_call_sign]) > 6:
			k = 10
			for i in range(6, len(flight_data[cur_call_sign])):
				if i % 2 == 0:
					output_sheet.write(output_sheet_row, k, flight_data[cur_call_sign][i])
					k = k + 1

		cur_call_sign = call_sign
		output_sheet_row = output_sheet_row + 1

	if call_sign in flight_data:
		flight_data[call_sign].extend((fix_name, date_time))

	else:
		flight_data[call_sign] = [airport_origin, airport_destination, aircraft_type, rfl, fix_name, date_time]

output_book.save("OriginalTraffic_Indonesia_20151206(normalized).xls") 