package email.preuschoff.rki.util;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.HashSet;

public final class Day {
	private static final HashSet<Instant> holidays;

	static {
		var calendar = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);

		var dates = new int[][]{
			{ 2021, Calendar.JANUARY, 1 },
			{ 2021, Calendar.APRIL, 2 },
			{ 2021, Calendar.APRIL, 4 },
			{ 2021, Calendar.APRIL, 5 },
			{ 2021, Calendar.MAY, 1 },
			{ 2021, Calendar.MAY, 13 },
			{ 2021, Calendar.MAY, 23 },
			{ 2021, Calendar.MAY, 24 },
			{ 2021, Calendar.JUNE, 3 },
			{ 2021, Calendar.OCTOBER, 3 },
			{ 2021, Calendar.NOVEMBER, 1 },
			{ 2021, Calendar.DECEMBER, 25 },
			{ 2021, Calendar.DECEMBER, 26 }
		};

		holidays = new HashSet<Instant>();
		for(var date : dates) {
			calendar.set(date[0], date[1], date[2]);
			holidays.add(calendar.getTime().toInstant());
		}
	}

	public static boolean isHoliday(Instant instant) {
		return instant.atZone(ZoneId.systemDefault()).getDayOfWeek()
				== DayOfWeek.SUNDAY || holidays.contains(instant);
	}

	public static boolean isWorkday(Instant instant)  {
		return !isHoliday(instant);
	}

	private Day() {
	}
}
