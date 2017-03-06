import xlrd
import xlwt

input_book = xlrd.open_workbook('OriginalTraffic_Indonesia_20151206.xls')
sheet = input_book.sheet_by_index(0)

output_book = xlwt.Workbook() 
output_sheet = output_book.add_sheet("Indonesia")

# read a row
print sheet.row_values(0)

# read a cell
cell = sheet.cell(0,0)
print cell
print cell.value

# read a row slice
print sheet.row_slice(rowx=0, start_colx=0, end_colx=2)

flight_data = []
for row in range(sheet.nrows):
	airport_origin = sheet.cell(row,1).value
	airport_destination = sheet.cell(row,2).value
	call_sign = sheet.cell(row,3).value
	aircraft_type = sheet.cell(row,4).value
	rfl = sheet.cell(row,5).value
	fix_name = sheet.cell(row,6).value
	date_time = sheet.cell(row,7).value
	airway = sheet.cell(row,8).value

	if call_sign in flight_data:
		flight_data['call_sign'].extend((fix_name, date_time))

	else:
		flight_data['call_sign'] = [airport_origin, airport_destination, aircraft_type, rfl, fix_name, date_time]

for call_sign in flight_data:









	flight_data.append([sheet.cell(row,1).value, sheet.cell(row,2).value, sheet.cell(row,3).value, sheet.cell(row,4).value,
		sheet.cell(row,5).value, sheet.cell(row,6).value, sheet.cell(row,7).value])
	for column in range(sheet.ncols):
		print "row::::: ", row
		print "column:: ", column
		print "value::: ", sheet.cell(row,column).value