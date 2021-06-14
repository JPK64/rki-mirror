package email.preuschoff.rki.model;

import java.time.Instant;

import email.preuschoff.rki.util.Day;

public final class Incidence implements Comparable<Incidence> {
	public Instant timestamp;
	public double incidence;

	public boolean isWorkday() {
		return Day.isWorkday(timestamp);
	}

	@Override
	public int compareTo(Incidence other) {
		return other.timestamp.compareTo(timestamp);
	}
}
