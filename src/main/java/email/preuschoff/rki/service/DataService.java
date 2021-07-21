package email.preuschoff.rki.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.TreeSet;

import email.preuschoff.rki.model.Data;
import email.preuschoff.rki.model.Incidence;
import email.preuschoff.rki.model.IncidenceLevel;

import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.eclipse.microprofile.config.Config;
import org.eclipse.microprofile.config.ConfigProvider;

public final class DataService implements Runnable {
	private static final Config config = ConfigProvider.getConfig();
	private static final URI spreadsheetURI = config.getValue(
			"data.spreadsheet", URI.class);

	private static final double districtId = config.getValue("data.district.id",
			Double.class);
	private static final int districtLevelInitial = config.getValue(
			"data.district.level", Integer.class);
	private static final String districtSheet = config.getValue(
			"data.district.sheet", String.class);

	private static final String stateId = config.getValue("data.state.id",
			String.class);
	private static final int stateLevelInitial = config.getValue(
			"data.state.level", Integer.class);
	private static final String stateSheet = config.getValue(
			"data.state.sheet", String.class);

	private final HttpClient client = HttpClient.newHttpClient();
	private final HttpRequest request = HttpRequest.newBuilder()
		.uri(spreadsheetURI)
		.GET()
		.build();
	
	private final Data data;
	public boolean stop;

	public DataService() {
		stop = false;
		data = new Data();
		data.lastChecked = Instant.MIN;
		data.state.level = IncidenceLevel.values()[stateLevelInitial];
		data.district.level = IncidenceLevel.values()[districtLevelInitial];
	}

	private TreeSet<Incidence> parseHistory(Sheet sheet, Object id, int dateRow) {
		final var dates = sheet.getRow(dateRow);
		int cells = dates.getLastCellNum();

		var result = new TreeSet<Incidence>();
		for(Row row : sheet) {
			var cell = row.getCell(0);
			if(cell == null)
				continue;

			Object value;
			switch(cell.getCellType()) {
				case STRING: value = cell.getStringCellValue(); break;
				case NUMERIC: value = cell.getNumericCellValue(); break;
				default: value = null; break;
			}
			if(value == null || !value.equals(id))
				continue;

			for(int i = cells - 1; i >= (cells - 28); i--) {
				if(row.getCell(i).getCellType() == CellType.BLANK
						|| dates.getCell(i).getCellType() == CellType.BLANK) {
					cells--;
					continue;
				}

				var incidence = new Incidence();
				incidence.incidence = row.getCell(i).getNumericCellValue();
				incidence.timestamp = dates.getCell(i).getDateCellValue()
						.toInstant();
				result.add(incidence);
			}

			break;
		}

		return result;
	}

	private void parseExcel(InputStream stream) {
		try(var workbook = new XSSFWorkbook(stream)) {
			var district = parseHistory(workbook.getSheet(districtSheet),
					districtId, 4);
			var state = parseHistory(workbook.getSheet(stateSheet), stateId, 2);

			synchronized(data) {
				data.lastChecked = Instant.now();
				data.district.data = district;
				data.state.data = state;
				data.notifyAll();
			}
		} catch(IOException e) {
			e.printStackTrace();
		}
	}

	public Data getData() throws InterruptedException {
		synchronized(data) {
			if(data.state.data == null || data.district.data == null)
				data.wait();
			return data;
		}
	}

	@Override
	public void run() {
		loop: while(true) {
			client.sendAsync(request, BodyHandlers.ofInputStream())
				.thenApply(HttpResponse::body)
				.thenAccept(this::parseExcel);
			
			var now = Instant.now();
			var deadline = now.plus(60, ChronoUnit.MINUTES);
			while(now.isBefore(deadline))
				try {
					Thread.sleep(Duration.between(now, deadline).toMillis());
				} catch(InterruptedException e) {
					if(stop)
						break loop;
				} finally {
					now = Instant.now();
				}
		}
	}
}
